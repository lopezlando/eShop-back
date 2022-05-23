const 
    express = require('express'),
    router = express.Router(),
    categoryService = require('./category.service');

//routes
router.post('/create', create);
router.get('/getSubcat', getSubcat);
router.get('/', getAll);
router.get('/:id', getById);

module.exports = router;

//functions

function create(req, res, next) {
    categoryService.create(req.body)
        .then(category => category ? res.json(category) : res.sendStatus(404))
        .catch(err => next(err));
}

function getSubcat(req, res, next) {
    categoryService.getSubcat()
        .then(allSubcats => allSubcats ? res.json(allSubcats) : res.sendStatus(404))
        .catch(err => next(err));
}

function getAll(req, res, next) {
    categoryService.getAll()
        .then(category => res.json(category))
        .catch(err => next(err));
}

function getById(req, res, next) {
    categoryService.getById(req.params.id)
        .then(category => category ? res.json(category) : res.sendStatus(404))
        .catch(err => next(err));
}