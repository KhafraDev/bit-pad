const { MongoClient } = require('mongodb');

/**
 * Connect to the database and save the connection to be re-used.
 * @returns {Promise<MongoClient>|MongoClient} client instance
 */
const Connect = async () => {
    if(!this._db) {
        this._db = await MongoClient.connect('mongodb://localhost:27017/', {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
    }

    return this._db;
}

module.exports = Connect;