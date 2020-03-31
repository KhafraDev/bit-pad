const express = require('express');
const app = express();
const { urlencoded, json } = require('body-parser');
const { join } = require('path');

const passport = require('./src/lib/Passport');
const Authenticated = require('./src/lib/Authenticated'); 
const { 
	padExists, 
	padCreate, 
	padGet, 
	padUpdate,
	accountRegister,
	updateOwner,
	addOwner
} = require('./src/lib/Query');

app.set('view engine', 'ejs');
app.set('views', join(__dirname, 'src', 'views'));
app.set('etag', false);
app.set('x-powered-by', false);
app.set('view cache', false);

app.use(urlencoded({ extended: true, limit: '5mb' }));
app.use(json({ limit: '5mb' }));
app.use(express.static('src/public'));
app.use((req, res, next) => {
	res.set('Cache-Control', 'no-store, no-cache, must-revalidate, private, max-age=0');
	res.set('Pragma', 'no-cache');
	res.set('Expires', '0'); // should be ignored because of max-age
	return next();
});
app.use(require('express-session')({ 
	secret: 'my secret... eventually', 
	resave: false, 
	saveUninitialized: false 
}));

app.use(passport.initialize());
app.use(passport.session());

/**
 * Main Routes
 */

app.get('/', (req, res) => res.status(200).render('pages/main', {
	authenticated: req.isAuthenticated()
}));

/**
 * Login/Authentication Routes
 */

app.get('/login', (req, res) => res.status(200).render('pages/login', {
	authenticated: req.isAuthenticated()
}));
  
app.post(
	'/login', 
	passport.authenticate('local', { 
		failureRedirect: '/login', 
		successRedirect: '/profile' 
	}), 
	(req, res) => res.status(200).redirect('/profile', {
		authenticated: req.isAuthenticated() 
	})
);

app.post('/register', async (req, res) => {
	if(!('username' in req.body) || !('password' in req.body)) {
		return res.status(400).send({
			message: 'Missing username or password!'
		});
	} else if(
		(req.body.username.length < 3 || req.body.username.length > 30) ||
		(req.body.password.length < 8 || req.body.password.length > 100)
	) {
		return res.status(400).send({
			message: 'Username must be between 3 and 30 characters and password must be between 8 and 100 characters.'
		});
	}

	const r = await accountRegister(req.body.username, req.body.password);
	return res.status(200).send({
		message: !!r
	});
});
  
app.post('/logout', (req, res) => {
	req.logout();
	res.clearCookie('connect.sid');
    res.redirect('/');
});

app.get(
	'/profile', 
	Authenticated, 
	(req, res) => res.status(200).render('pages/profile', { 
			user: req.user,
			authenticated: req.isAuthenticated() 
	})
);

/**
 * Pad methods
 */

app.post('/create', async (req, res) => {
	if(!('name' in req.body)) {
		return res.status(400).send({ message: 'Bad request.' })
	}

	const exists = await padExists(req.body.name, req.user);
	if(Object.prototype.toString.call(exists) === '[object Object]') {
		return exists.message === true 
			? res.status(200).send({
				name: req.body.name
			  })
			: res.status(400).send({
				message: exists.message
			  });
	} else {
		const created = await padCreate(req.body.name, req.user);
		if(created) {
			res.status(201).send({
				name: req.body.name
			});
			
			return updateOwner(req.body.name, req.user);
		} else {
			return res.status(400).send({
				message: 'An unknown error occured registering this pad.'
			});
		}
	}
});

app.get('/pad/:name?', async (req, res) => {
	if(!('name' in req.params) || req.params.name === undefined) {
		return res.status(302).redirect('../');
	}

	const pad = await padGet(req.params.name, req.user);
	if(pad === null) {
		return res.status(302).redirect('../');
	}

	return res.status(200).render('pages/pad', {
		authenticated: req.isAuthenticated(),
		html: pad.data
	})
});

app.post('/save', async (req, res) => {
    if(!('html' in req.body) || !('name' in req.body)) {
		return res.status(400).send({
			message: 'Missing one or more parameters'
		});
	}

	const saved = await padUpdate(req.body.name, req.body.html, req.user);
	return res.status(200).send({
		message: saved.message === false 
			? 'Not authenticated'
			: saved.message
	});
});

app.post('/add', async (req, res) => {
	if(!('addUser' in req.body)) {
		return res.status(400).send({ message: 'No user to add!' });
	} else if(!('padName' in req.body)) {
		return res.status(400).send({ message: 'No pad name given!' })
	}else if(req.body.addUser.length < 3 || req.body.addUser.length > 30) {
		return res.status(400).send({ message: 'Invalid username!' });
	}

	await addOwner(req.body.padName, req.body.addUser, req.user);
	return res.status(302).redirect('/profile');
});

app.listen(3000, () => console.log('Listening on port 3000!'));