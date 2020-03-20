const app = require('express')();
const bodyParser = require('body-parser');

const Connect = require('./src/lib/Connect');

const { join } = require('path');

app.set('view engine', 'ejs');
app.set('views', join(__dirname, 'src', 'views'));

app.use(bodyParser.json({
    limit: '5mb'
}));
app.use(bodyParser.urlencoded({ 
    extended: true, 
    limit: '5mb' 
}));

app.get('/', (_, res) => res.status(200).render('pages/main'));

app.post('/register', async (req, res) => {
    if(typeof req.body === 'undefined' || typeof req.body.name === 'undefined') {
        return res.status(404).send(null);
    }

    try {
        const db = (await Connect()).db('pastes').collection('keys');

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
    if(!req.params || !req.params.name || !req.params.name.length) {
        return res.status(400).redirect('/error');
    }

    try {
        const db = (await Connect()).db('pastes').collection('keys');

        const result = await db.findOne({ key: encodeURIComponent(req.params.name) });
        if(!result) return res.redirect('/error');

        return res.render('pages/pad', { html: JSON.parse(result.data.trim().length ? result.data : '[]') });
    } catch {
        return res.status(404).render('pages/error');
    }
});

app.post('/save', async (req, res) => {
    if(typeof req.body === 'undefined' || typeof req.body.html === 'undefined' || typeof req.body.key === 'undefined')
        return res.status(400).send({ fail: 'One or more parameters missing or null.' });

    try {
        const db = (await Connect()).db('pastes').collection('keys');

        const result = await db.updateOne(
            { key: req.body.key },
            { $set: { data: JSON.stringify(req.body.html) } }
        );

        if(!result) {
            return res.status(400).send({ fail: 'No document found to update.' });
        } else if(result.result.nModified === 0 && result.result.ok === 1) {
            return res.status(400).send({ fail: 'Nothing needed to be updated!' });
        }

        return res.status(200).send({ success: true });
    } catch(err) {
        if(err.type === 'entity.too.large') {
            return res.status(400).send({ fail: 'Document too large (max: 5mb).' });
        }
        
        return res.status(400).send({ fail: 'An unexpected error occured!\n' + err.message });
    }
});

app.get('/error', (_, res) => res.status(302).render('pages/error'));
app.get('*', (_, res) => res.status(302).redirect('/error'));

app.listen(3000, () => console.log('Listening on port 3000!'));