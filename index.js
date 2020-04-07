const express = require('express');
const { json, urlencoded } = require('body-parser');
const app = require('next')({ 
	dev: process.env.NODE_ENV === 'production'
});

const handle = app.getRequestHandler();
const Create = require('./src/database/create');
const Update = require('./src/database/update');

app.prepare().then(() => {
    const server = express();

	server.disable('x-powered-by');

	server.use(urlencoded({ extended: true, limit: '5mb' }));
	server.use(json({ limit: '5mb' }));

	/* Home page */
	server.get('/', (req, res) => {
		return app.render(req, res, '/', req.query);
	});

	/* Create a pad, or return with an existing one. */
	server.post('/create', async (req, res) => {
		if(!('name' in req.body)) {
			return res.status(400).send(null);
		}
		
		const pad = await Create(encodeURIComponent(req.body.name.toLowerCase()));
		return res.status(200).send(pad.value);
	});

	/* Get a pad's contents, or create a new one. */
	server.post(/create|get/i, async (req, res) => {
		if(!('name' in req.body)) {
			return res.status(400).send(null);
		}

		const pad = await Create(encodeURIComponent(req.body.name.toLowerCase()));
		return res.status(200).send(pad.value);
	});

	/* Save a pad to the database */
	server.post('/save', async (req, res) => {
		if(!('html' in req.body) || !('name' in req.body)) {
			return res.status(400).send(null);
		}
	
		const saved = await Update(req.body.name, req.body.html);
		return res.status(saved ? 200 : 400).send({ 'hello': 'Khafra says hello' });
	});

    server.all('*', (req, res) => {
        return handle(req, res);
    });
    
    server.listen(3000, () => console.log(`Ready on port 3000!`));
});