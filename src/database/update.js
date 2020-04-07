const Connect = require('../lib/mongo');

const update = async (name, html) => {
    const db = (await Connect()).db('bitpad').collection('pads');

    const r = await db.updateOne(
        { name: name.name },
        { $set: { data: typeof html === 'string' ? html : JSON.stringify(html) } }
    );

    if(
        !r ||                                               // no document found
        (r.result.nModified === 0 && r.result.ok === 1)     // not updated; nothing changed
    ) { 
        return false;
    }

    return true;
}

module.exports = update;