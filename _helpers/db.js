const 
    mongoose = require('mongoose'),
    connectionString = process.env.MONGODB_URI,
    connectionOptions = { useCreateIndex: true, useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false };
mongoose.connect(connectionString || 'mongodb://localhost/eShop', connectionOptions);
mongoose.Promise = global.Promise;

module.exports = {
    User: require('../users/user.model'),
    Category: require('../categories/category.model'),
    Provider: require('../providers/provider.model'),
    Product: require('../products/product.model'),
    Cart: require('../cart/cart.model'),
    Order: require('../orders/order.model'),
    Bag: require('../bags/bag.model')
}