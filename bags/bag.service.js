const 
    db = require('_helpers/db'),
    Bag = db.Bag;

module.exports = {
    create,
    getAll
};

// The bag creation function is automatically triggered as many times
// as necessary when an order is created.

async function create (orderId, providerId, productId, quantity, name, img) {
    
    let bag = await Bag.findOne({ orderId, providerId });

    if(bag) {

        bag.products.push({ productId, quantity, name, img });

    } else {

        bag = new Bag;
        bag.orderId = orderId;
        bag.providerId = providerId;
        bag.products.push({ productId, quantity, name, img });

    }

    await bag.save();
    return bag._id;

}

async function getAll() {

    return await Bag.find();

}