require('rootpath')();
require('dotenv').config();
const 
    express = require('express'),
    app = express(),
    cors = require('cors'),
    bodyParser = require('body-parser'),
    jwt = require('_helpers/jwt'),
    errorHandler = require('_helpers/error-handler');

// Middelware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());

// use JWT auth to secure the api
app.use(jwt());

// api routes
app.use('/api/users', require('./users/users.controller'));
app.use('/api/categories', require('./categories/category.controller'));
app.use('/api/providers', require('./providers/provider.controller'));
app.use('/api/products', require('./products/product.controller'));
app.use('/api/cart', require('./cart/cart.controller'));
app.use('/api/orders', require('./orders/order.controller'));
app.use('/api/bags', require('./bags/bag.controller'));

// global error handler
app.use(errorHandler);

// start server
const 
    port = process.env.PORT || 3000,
    server = app.listen(port, function () {
        console.log('Server running on port ' + port);
    });



