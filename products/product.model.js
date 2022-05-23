const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
    name: {type: String, required: true},
    category: {type: String},
    subcategory: {type: String},
    description: {type: String},
    price: {type: Number},
    img: {type: String},
    postDate: {type: Date, default: Date.now},
    stock: {type: Number, required: true},
    providerId: {type: String},
    providerName: {type: String},
    providerImg: {type: String}
});

module.exports = mongoose.model('Product', schema);