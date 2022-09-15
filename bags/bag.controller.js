const 
    express = require('express'),
    router = express.Router(),
    bagService = require('./bag.service');

//routes
router.post('/create', create);
router.get('/', getAll);

module.exports = router;

//endpoints

function create(req, res, next) {
    bagService.create(req.body)
        .then(bag => bag ? res.json(bag) : res.status(404).json({ message: 'We could not create the order.' }))
        .catch(err => next(err));
}

function getAll(req, res, next) {
    bagService.getAll()
        .then(bags => res.json(bags))
        .catch(err => next(err));
}