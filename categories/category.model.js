const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
    category: {type: String, unique:true, reqired:true},
    img: { type: String},
    subcategories: [
        {
            subcategory: {type: String, unique: true},
            img: {type: String}
        }
    ]
});

module.exports = mongoose.model('Category', schema);