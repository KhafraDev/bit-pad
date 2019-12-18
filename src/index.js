const express = require('express');
const app = express();
const bodyParser = require('body-parser');

const { Connect } = require('./lib/Connect');
const connect = new Connect();

const { join } = require('path');

app.set('view engine', 'ejs');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(join(__dirname, '..', 'views', 'css')));

app.get('/', (req, res) => res.render('pages/main'));

app.post('/register', async (req, res) => {
    if(typeof req.body !== 'undefined' && typeof req.body.name !== 'undefined') {
        const value = encodeURIComponent(req.body.name);

        const client = await connect.connect();
        const db = client.db('pastes').collection('keys');

        const result = await db.findOneAndUpdate(
            { key: value },
            { $setOnInsert: { 
                key: value, 
                data: { html: '' } 
            } },
            { returnOriginal: false, upsert: true }
        ); // find existing paste of create a new one.

        return res.send({ pad: '/pad/' + result.value.key });
    } 
    
    return res.send({});
});

app.get('/pad/:name', async (req, res) => {
    if(!req.params.name.length) return res.redirect('/');
    try {
        const client = await connect.connect();
        const db = client.db('pastes').collection('keys');

        const result = await db.findOne({ key: req.params.name });
        if(!result) return res.redirect('/error', 404);

        return res.render('pages/pad', { html: result.data.html });
    } catch(err) {
        throw err;
    }
});

app.post('/save', async (req, res) => {
    if(typeof req.body !== 'undefined' && typeof req.body.html !== 'undefined' && typeof req.body.key !== 'undefined') {
        const client = await connect.connect();
        const db = client.db('pastes').collection('keys');

        const result = await db.updateOne(
            { key: encodeURIComponent(req.body.key) },
            { $set: { data: { html: encodeURIComponent(req.body.html) } }}
        );

        if(!result) return res.send({ fail: 'No document found to update. (code 3)' });
        if(result.result.ok === 0) return res.send({ fail: 'No document saved. (code 4)' });

        return res.send({ success: true });
    } 

    return res.send({ fail: 'One or more parameters missing or null. (code 5)' });
});

app.get('/error', (req, res) => res.render('pages/error'));

app.listen(3000);