const { ObjectId } = require('mongoose');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
    email: {type: String, unique:true, reqired:true},
    hash: { type: String, required: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    verified: {type: Boolean, default: false},
    verificationToken: {type: String},
    forgotPwToken: {type: String},
    favorites: [
        {
            subcategory: {type: String},
            count: {type: Number}
        }
    ],
    addresses: [
        {
            defaultAddress: {type: Boolean, default: false},
            street: {type: String, required: true},
            streetNumber: {type: Number, required: true},
            floor: {type: Number},
            door: {type: String},
            CP: {type: Number, required: true}
        }
    ]
});

schema.set('toJSON', {
    virtuals: true,
    versionKey: false,
    transform: function (doc, ret) {
        delete ret._id;
        delete ret.hash;
    }
});

module.exports = mongoose.model('User', schema);