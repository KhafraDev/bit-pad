const { MongoClient } = require('mongodb');

/**
 * @returns {Promise<MongoClient>} Client instance
 */
const Connect = async () => {
    if(!this.db) {
        this.db = await MongoClient.connect('mongodb://localhost:27017/', {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
    }

    return this.db;
}

module.exports = Connect;