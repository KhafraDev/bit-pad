/**
 * v1.1.6 or below -> v1.2.0 or above
 * NOTE: this will not replace existing documents!
 * 
 * DB v1.1.6: 
 *  db: pastes
 *  collection: keys
 * 
 * DB v1.2.0
 *  db: bitpad
 *  collection: [
 *      accounts, pads
 *  ]
 */

const owner = 'khafra'; // leave blank to add no owners
const Connect = require('../../src/lib/Connect');
const { ObjectId } = require('mongodb');

(async () => {
    const _oldDB = (await Connect()).db('pastes').collection('keys');
    const _old = await _oldDB.find({}).toArray();

    const _newDB = (await Connect()).db('bitpad').collection('pads');
    const _new = _old.map(({ _id, key, data }) => {
        const o = {
            _id: new ObjectId(_id),
            access: [],
            data
        };

        if(owner.length) {
            o.owner = owner;
        }

        o.name = key;
        return o;
    });

    const r = await _newDB.insertMany(_new);
    console.log(r.result.ok === 1);
})();