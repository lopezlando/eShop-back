const 
    db = require('_helpers/db'),
    Provider = db.Provider,
    ObjectId = require('mongodb').ObjectId;

module.exports = {
    create,
    getAll,
    getById,
    getProviders
};

async function create(userParam) {
    
    if (await Provider.findOne({ name: userParam.name })) {
        throw 'That provider already exists.';
    }

    const provider = new Provider(userParam);

    await provider.save();
    return provider;
}

async function getAll() {
    return await Provider.find();
}

async function getById(id) {
    return await Provider.findById(ObjectId(id));
}

async function getProviders() {
    return await Provider.find();
}