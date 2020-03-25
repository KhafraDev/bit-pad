const passport = require('passport');
const { Strategy } = require('passport-local');
const { ObjectId } = require('mongodb');
const { compareSync } = require('bcryptjs');

const Connect = require('./Connect');

passport.use(new Strategy(async (username, password, done) => {
	try {
		const db = (await Connect()).db('bitpad').collection('accounts');
		const user = await db.findOne({
			username: username
		});

		if(!user) return done(null, false); // user not found in db
		if(!compareSync(password, user.password)) return done(null, false); // password is incorrect

		return done(null, user);
	} catch(err) {
		return done(err);
	}
}));

passport.serializeUser((user, done) => done(null, user._id));

passport.deserializeUser(async (id, done) => {
  	try {
		const db = (await Connect()).db('bitpad').collection('accounts');
		const user = await db.findOne({
			_id: new ObjectId(id)
		});

		return done(null, user);
  	} catch(err) {
		return done(err);
  	}	
});

module.exports = passport;