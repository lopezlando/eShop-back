const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// orders are divided in bags since the idea of this ecommerce
// is to offer other businesses' products. Bags are per provider
// so that the delivery guy can pick each one of them individually
// and mark the order as picked up once all the bags are in the truck.

const schema = new Schema({
    orderId: {type: String},
    providerId: {type: String},
    products: [
        {
            productId: {type: String},
            quantity: {type: Number},
            name: {type: String},
            img: {type: String}
        }
    ]
});

module.exports = mongoose.model('Bag', schema);