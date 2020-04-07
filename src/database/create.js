const Connect = require('../lib/mongo');

const create = async name => {
    const db = (await Connect()).db('bitpad').collection('pads');

    return db.findOneAndUpdate(
        { name },
        {
            $setOnInsert: { 
                name, data: '[]'
            }
        },
        { upsert: true, /* important */ returnOriginal: false }
    );
}

module.exports = create;