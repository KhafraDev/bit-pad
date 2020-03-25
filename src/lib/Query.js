/**
 * Database queries.
 */
const Connect = require('./Connect');
const { ObjectId } = require('mongodb');

/**
 * Test if a pad exists, a
 * @param {string} name Pad name
 * @param {any} user User object 
 * @returns {Promise<boolean>}
 */
const padExists = async (name, user) => {
    const db = (await Connect()).db('bitpad').collection('pads');
    const options = { name };
    if(user) {
        Object.assign(options, {
            owner: user.username
        });
    }
    const r = await db.findOne(options);

    if(!r) { // pad doesn't exist
        return false; 
    } else if(!r.owner) { // no owner on pad; anyone can access
        return { message: true };
    } else if(!user && r.owner) { // no user logged in but the pad has an owner
        return { message: 'You cannot access this pad.' };
    } else if(r.owner !== user.username) { // owner's name doesn't match user's name
        return { message: 'You cannot access this pad.' }
    } else if(user.username === r.owner) { // pad owner = user trying to access it
        return { message: true };
    }

    return false;
}

/**
 * @param {string} name Pad name
 * @param {any} user User object 
 * @returns {Promise<boolean>}
 */
const padCreate = async (name, user) => {
    const db = (await Connect()).db('bitpad').collection('pads');
    const options = { name };
    if(user) {
        Object.assign(options, {
            owner: user.username
        });
    }

    const r = await db.insertOne({
        ...options,
        data: '[]'
    });

    return r.result.ok === 1;
}

/**
 * Get a pad or return null
 * @param {string} name pad name 
 * @param {*} user user object
 */
const padGet = async (name, user) => {
    if(!(await padExists(name, user))) {
        return null;
    }

    const db = (await Connect()).db('bitpad').collection('pads');
    const options = { name };
    if(user) {
        Object.assign(options, {
            owner: user.username
        });
    }

    const r = await db.findOne(options);
    if(!r) { // pad doesn't exist (?)
        return null;
    } else if(!user && r.owner) { // pad has an owner, user isn't logged in
        return null;
    } else if(r.owner !== user.username) { // user is not the pad owner
        return null;
    }

    return r;
}

const padUpdate = async (name, html, user) => {
    const pad = await padGet(name, user);
    if(!pad) {
        return { message: false };
    } 

    const db = (await Connect()).db('bitpad').collection('pads');

    const r = await db.updateOne(
        { name: name },
        { $set: { data: JSON.stringify(html) } }
    );

    if(!r) { // document not found
        return { message: 'No document found to update.' };
    } else if(r.result.nModified === 0 && result.result.ok === 1) { // not updated; nothing changed
        return { message: 'Nothing needed to be updated!' };
    }

    return { message: true };
}

/**
 * Add a pad to an account.
 * @param {string} name Pad name
 * @param {any} user User object 
 * @returns {Promise<boolean>}
 */
const updateOwner = async (name, user) => {
    if(!user) return;
    
    const db = (await Connect()).db('bitpad').collection('accounts');
    const r = await db.updateOne(
        { _id: new ObjectId(user._id) },
        { $push: { pads: { name: name } } }
    );

    return r.result.ok === 1;
}

/**
 * Test if an account already exists
 * @param {string} username Username 
 * @returns {Promise<boolean>}
 */
const accountExists = async username => {
    const db = (await Connect()).db('bitpad').collection('accounts');

    const r = await db.findOne({ username });
    return r ? true : false;
}

/**
 * Register an account
 * @param {string} username Username
 * @param {string} password Password
 */
const accountRegister = async (username, password) => {
    if(await accountExists(username)) {
        return null;
    }

    const db = (await Connect()).db('bitpad').collection('accounts');
    const r = await db.insertOne({
        username,
        password,
        pads: []
    });

    return r.result.ok === 1;
}

module.exports = {
    padExists,
    padCreate,
    padGet,
    padUpdate,
    accountRegister,
    updateOwner
}