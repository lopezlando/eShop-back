const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
    userId: {type: String},
    products: [
        {
            productId: {type: String},
            providerId: {type: String},
            quantity: {type: Number},
            name: {type: String},
            price: {type: Number}
        }
    ],
});

module.exports = mongoose.model('Cart', schema);