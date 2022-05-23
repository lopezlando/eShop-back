const 
    express = require('express'),
    router = express.Router(),
    productService = require('./product.service');

//routes
router.post('/create', create);
router.put('/updateStock', updateStock);
router.get('/partialMatch', partialMatch);
router.get('/getBySubcategory/:subcat', getBySubcategory);
router.get('/getByProvider/:provId', getByProvider);
router.get('/getByProvSubcat/:provId/:subcat', getByProvSubcat);
router.get('/getByCategory/:cat', getByCategory);
router.get('/recommended', recommended);
router.get('/', getAll);
router.get('/:id', getById);

module.exports = router;

//functions

function create(req, res, next) {
    productService.create(req.body)
        .then(product => product ? res.json(product) : res.sendStatus(404))
        .catch(err => next(err));
}

function updateStock(req, res, next) {
    productService.updateStock(req.body)
        .then(product => product ? res.json(product) : res.sendStatus(404))
        .catch(err => next(err));
}

function partialMatch(req, res, next) {
    productService.partialMatch(req.query)
        .then(product => product ? res.json(product) : res.sendStatus(404))
        .catch(err => next(err));
}

function getBySubcategory(req, res, next) {
    productService.getBySubcategory(req.params.subcat)
        .then(product => product ? res.json(product) : res.status(404).json({ message: 'There are no products in that subcategory.' }))
        .catch(err => next(err));
}

function getByProvider(req, res, next) {
    productService.getByProvider(req.params.provId)
        .then(product => product ? res.json(product) : res.status(404).json({ message: 'There are no products for that provider.' }))
        .catch(err => next(err));
}

function getByProvSubcat(req, res, next) {
    productService.getByProvSubcat(req.params)
        .then(product => product ? res.json(product) : res.status(404).json({ message: 'There are no products in that subcategory for that provider.' }))
        .catch(err => next(err));
}

function getByCategory(req, res, next) {
    productService.getByCategory(req.params.cat)
        .then(product => product ? res.json(product) : res.status(404).json({ message: 'There are no products in that category.' }))
        .catch(err => next(err));
}

function recommended(req, res, next) {
    productService.recommended(req.headers.authorization.split(' ')[1])
        .then(product => product ? res.json(product) : res.status(404).json({ message: 'There was an issue loading the recommended products.' }))
        .catch(err => next(err));
}

function getAll(req, res, next) {
    productService.getAll()
        .then(product => res.json(product))
        .catch(err => next(err));
}

function getById(req, res, next) {
    productService.getById(req.params.id)
        .then(product => product ? res.json(product) : res.sendStatus(404))
        .catch(err => next(err));
}