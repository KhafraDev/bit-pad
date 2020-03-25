const owner = 'khafra'; // must provider username, case-sensitive
const Connect = require('../../src/lib/Connect');

(async () => {
    const _pads = (await Connect()).db('bitpad').collection('pads');
    const pads = await _pads.find({}).toArray();

    const names = pads.map(({ name }) => ({ name: name }));
    
    const _accounts = (await Connect()).db('bitpad').collection('accounts');
    await _accounts.updateOne(
        { username: owner },
        { $push: {
            pads: { $each: [ ...names ] }
        } }
    );
})();