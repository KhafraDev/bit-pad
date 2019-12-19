const express = require('express');
const app = express();
const bodyParser = require('body-parser');

const { Connect } = require('./lib/Connect');
const connect = new Connect();

const { join } = require('path');

app.set('view engine', 'ejs');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(join(__dirname, '..', 'views', 'static')));

app.get('/', (req, res) => res.render('pages/main'));

app.post('/register', async (req, res) => {
    if(typeof req.body === 'undefined' || typeof req.body.name === 'undefined')
        return res.send({});

    try {
        const value = encodeURIComponent(req.body.name);

        const client = await connect.connect();
        const db = client.db('pastes').collection('keys');

        const result = await db.findOneAndUpdate(
            { key: value },
            { $setOnInsert: { 
                key: value, 
                data: { html: [] } 
            } },
            { returnOriginal: false, upsert: true }
        ); // find existing paste of create a new one.

        return res.send({ pad: '/pad/' + result.value.key });
    } catch(err) {
        res.send({});
        throw err;
    }
});

app.get('/pad/:name', async (req, res) => {
    if(!req.params.name.length) return res.redirect('/');
    try {
        const client = await connect.connect();
        const db = client.db('pastes').collection('keys');

        const result = await db.findOne({ key: encodeURIComponent(req.params.name) });
        if(!result) return res.redirect('/error');

        return res.render('pages/pad', { html: result.data.html });
    } catch(err) {
        throw err;
    }
});

app.post('/save', async (req, res) => {
    if(Buffer.byteLength(JSON.stringify(req.body)) > 100000) // 100kb
        return res.send({ fail: 'Body size is too large! (code 7)' });
    if(typeof req.body === 'undefined' || typeof req.body.html === 'undefined' || typeof req.body.key === 'undefined')
        return res.send({ fail: 'One or more parameters missing or null. (code 5)' });

    try {
        const client = await connect.connect();
        const db = client.db('pastes').collection('keys');

        for(const o of req.body.html) {
            if(o.insert) o.insert = encodeURIComponent(o.insert);
        }

        const result = await db.updateOne(
            { key: encodeURIComponent(req.body.key) },
            { $set: { data: { html: req.body.html } }}
        );

        if(!result) return res.send({ fail: 'No document found to update. (code 3)' });
        if(result.result.ok === 0) return res.send({ fail: 'No document saved. (code 4)' });

        return res.send({ success: true });
    } catch(err) {
        if(err.type === 'entity.too.large') {
            return res.send({ fail: 'Document too large. (code 6)' });
        }
        
        res.send({ fail: 'An unexpected error occured!' });
        throw err;
    }
});

app.get('/error', (req, res) => {
    res.status(302); // tell browser to redirect
    res.render('pages/error');
});

app.get('*', (req, res) => res.redirect('/error'));

app.listen(3000);