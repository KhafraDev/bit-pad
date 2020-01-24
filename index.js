const express = require('express');
const app = express();
const bodyParser = require('body-parser');

const { Connect } = require('./src/lib/Connect');
const connect = new Connect();

const { join } = require('path');

app.set('view engine', 'ejs');
app.set('views', join(__dirname, 'src', 'views'));

app.use(express.static(join(__dirname, 'node_modules', 'quill', 'dist')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', (req, res) => res.status(200).render('pages/main'));

app.post('/register', async (req, res) => {
    if(typeof req.body === 'undefined' || typeof req.body.name === 'undefined') {
        return res.status(404).send(null);
    }

    try {
        const client = await connect.connect();
        const db = client.db('pastes').collection('keys');

        const result = await db.findOneAndUpdate(
            { key: encodeURIComponent(req.body.name) },
            { $setOnInsert: { 
                key: encodeURIComponent(req.body.name), 
                data: '[]'
            } },
            { returnOriginal: false, upsert: true }
        ); // find existing paste of create a new one.

        return res.status(200).send({ pad: '/pad/' + result.value.key });
    } catch {
        return res.status(400).send(null);
    }
});

app.get('/pad/:name', async (req, res) => {
    if(!req.params.name.length) {
        return res.status(400).redirect('/error');
    }

    try {
        const client = await connect.connect();
        const db = client.db('pastes').collection('keys');

        const result = await db.findOne({ key: encodeURIComponent(req.params.name) });
        if(!result) return res.redirect('/error');

        return res.render('pages/pad', { html: JSON.parse(result.data.trim().length ? result.data : '[]') });
    } catch {
        return res.status(404).render('pages/error');
    }
});

app.post('/save', async (req, res) => {
    if(Buffer.byteLength(JSON.stringify(req.body)) > 100000) // 100kb
        return res.status(400).send({ fail: 'Body size is too large!' });
    if(typeof req.body === 'undefined' || typeof req.body.html === 'undefined' || typeof req.body.key === 'undefined')
        return res.status(400).send({ fail: 'One or more parameters missing or null.' });

    try {
        const client = await connect.connect();
        const db = client.db('pastes').collection('keys');
        const html = JSON.stringify(req.body.html);

        const result = await db.updateOne(
            { key: req.body.key },
            { $set: { data: html } }
        );

        if(!result) {
            return res.status(400).send({ fail: 'No document found to update.' });
        } else if(result.result.nModified === 0 && result.result.ok === 1) {
            return res.status(400).send({ fail: 'Nothing needed to be updated!' });
        }

        return res.status(200).send({ success: true });
    } catch(err) {
        if(err.type === 'entity.too.large') {
            return res.status(400).send({ fail: 'Document too large.' });
        }
        
        return res.status(400).send({ fail: 'An unexpected error occured!\n' + err.message });
    }
});

app.get('/error', (req, res) => res.status(302).render('pages/error'));
app.get('*', (req, res) => res.status(302).redirect('/error'));

app.listen(3000, () => console.log('Listening on port 3000!'));