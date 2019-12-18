const { MongoClient } = require('mongodb');

class Connect {
    /**
     * Connects to the database or returns an existing connection.
     * @returns {MongoClient} Client object
     */
    async connect() {
        if(this.db) return Promise.resolve(this.db);

        const db = await MongoClient.connect('mongodb://127.0.0.1:27017/', {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        
        this.db = db;
        return this.db;
    }
}

module.exports = { Connect };