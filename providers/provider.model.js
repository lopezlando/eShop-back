const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
    name: {type: String, unique: true, required: true},
    img: {type: String},
});

module.exports = mongoose.model('Provider', schema);