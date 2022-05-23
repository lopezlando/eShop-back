const 
    express = require('express'),
    router = express.Router(),
    cartService = require('./cart.service');

//routes
router.post('/create', create);
router.post('/addToCart', addToCart);
router.put('/deleteItem/:id', deleteItem);
router.delete('/deleteCart', deleteCart);
router.get('/openCart', openCart);
router.get('/cartLength', cartLength);
router.get('/productLength/:productId', productLength);
router.get('/', getAll);
router.get('/:id', getById);

module.exports = router;

function create(req, res, next) {
    cartService.create(req.body)
        .then(() => res.json({}))
        .catch(err => next(err));
}

function addToCart(req, res, next) {
    cartService.addToCart(req.headers.authorization.split(' ')[1], req.body)
        .then(cart => cart ? res.json(cart) : res.status(404).json({ message: 'We could not retrieve the cart.' }))
        .catch(err => next(err));
}

function deleteItem(req, res, next) {
    cartService.deleteItem(req.headers.authorization.split(' ')[1], req.params.id)
        .then(cart => cart ? res.json(cart) : res.status(404).json({ message: 'There was an issue while deleting the cart' }))
        .catch(err => next(err));
}

function deleteCart(req, res, next) {
    cartService.deleteCart(req.headers.authorization.split(' ')[1])
        .then(() => res.json({}))
        .catch(err => next(err));
}

function openCart(req, res, next) {
    cartService.openCart(req.headers.authorization.split(' ')[1])
        .then(cart => cart ? res.json(cart) : res.status(404).json({ message: 'The cart could not be visualized.' }))
        .catch(err => next(err));
}

function cartLength(req, res, next) {
    cartService.cartLength(req.headers.authorization.split(' ')[1])
        .then(cart => cart ? res.json(cart) : res.status(404).json({ message: 'The cart could not be retrieved.' }))
        .catch(err => next(err));
}

function productLength(req, res, next) {
    cartService.productLength(req.headers.authorization.split(' ')[1], req.params.productId)
        .then(cart => cart ? res.json(cart) : res.status(404).json({ message: 'The cart could not be retrieved.' }))
        .catch(err => next(err));
}

function getAll(req, res, next) {
    cartService.getAll()
        .then(cart => res.json(cart))
        .catch(err => next(err));
}

function getById(req, res, next) {
    cartService.getById(req.params.id)
        .then(cart => cart ? res.json(cart) : res.sendStatus(404))
        .catch(err => next(err));
}