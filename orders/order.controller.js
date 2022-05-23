const 
    express = require('express'),
    router = express.Router(),
    orderService = require('./order.service');

//routes
router.post('/create', create);
router.get('/openOrder/:id', openOrder);
router.get('/listOfOrders', listOfOrders);
router.get('/getByStatus/:statusId', getByStatus);
router.get('/', getAll);
router.put('/changeStatus', changeStatus);
router.delete('/cancelOrder/:id', cancelOrder);
router.get('/:id', getById);

module.exports = router;

//functions

function create(req, res, next) {
    orderService.create(req.headers.authorization.split(' ')[1], req.body)
        .then(order => order ? res.json(order) : res.status(404).json({ message: 'The order could not be created.' }))
        .catch(err => next(err));
}

function openOrder(req, res, next) {
    orderService.openOrder(req.params.id)
        .then(order => order ? res.json(order) : res.status(404).json({ message: 'The order could not be visualized.' }))
        .catch(err => next(err));
}

function listOfOrders(req, res, next) {
    orderService.listOfOrders(req.headers.authorization.split(' ')[1])
        .then(orders => orders ? res.json(orders) : res.status(404).json({ message: 'The users orders could not be retrieved.' }))
        .catch(err => next(err));
}

function getAll(req, res, next) {
    orderService.getAll()
        .then(order => res.json(order))
        .catch(err => next(err));
}

function getById(req, res, next) {
    orderService.getById(req.params.id)
        .then(order => order ? res.json(order) : res.sendStatus(404))
        .catch(err => next(err));
}

function getByStatus(req, res, next) {
    orderService.getByStatus(req.headers.authorization.split(' ')[1], req.params.statusId)
        .then(orders => res.json(orders))
        .catch(err => next(err));
}

function changeStatus(req, res, next) {
    orderService.changeStatus(req.body)
        .then(order => order ? res.json(order) : res.status(404).json({ message: 'The status could not be changed.' }))
        .catch(err => next(err));
}

function cancelOrder(req, res, next) {
    orderService.cancelOrder(req.params.id)
        .then(() => res.json({ message: 'Order cancelled.' }))
        .catch(next);
}