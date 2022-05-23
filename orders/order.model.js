const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
    date: {type: Date, default: Date.now},
    userId: {type: String},
    status: {type: String, default: 'Pending'},
    total: {type: Number},
    bags:[
        {
            bagId: {type: String}
        }
    ],
    address:[
        {
            street: {type: String, required: true},
            streetNumber: {type: Number, required: true},
            floor: {type: Number},
            door: {type: String},
            CP: {type: Number, required: true}
        }
    ]
});

module.exports = mongoose.model('Order', schema);