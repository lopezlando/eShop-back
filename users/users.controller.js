const 
    express = require('express'),
    router = express.Router(),
    userService = require('./user.service');

// routes
router.post('/register', register);
router.post('/authenticate', authenticate);
router.get('/getUserId', getUserId);
router.post('/addAddress', addAddress);
router.put('/changeDefaultAddress/:id', changeDefaultAddress);
router.get('/getUserAddresses', getUserAddresses);
router.delete('/deleteAddress/:id', deleteAddress);
router.get('/', getAll);
router.get('/:id', getById);
router.post('/resendVerify', resendVerify);
router.post('/verifyEmail', verifyEmail);
router.post('/forgotPasswordRequest', forgotPasswordRequest);
router.post('/forgotPasswordTokenOnly', forgotPasswordTokenOnly);
router.put('/forgotPasswordUpdate', forgotPasswordUpdate);
router.put('/editName', editName);



module.exports = router;

//REGISTER, LOGIN, RETRIEVE ID

function register(req, res, next) {
    userService.create(req.body)
        .then(user => user ? res.json(user) : res.status(400).json({ message: 'Email in use' }))
        .catch(err => next(err));
}

function authenticate(req, res, next) {
    userService.authenticate(req.body)
        .then(user => user ? res.json(user) : res.status(400).json({ message: 'incorrect username or password.' }))
        .catch(err => next(err));
}

function getUserId (req, res, next) {
    userService.getUserId(req.headers.authorization.split(' ')[1])
        .then(user => user ? res.json(user) : res.status(400).json({ message: 'Cannot retrieve the session ID.' }))
        .catch(err => next(err));
}

//ADDRESSES

function addAddress(req, res, next) {
    userService.addAddress(req.headers.authorization.split(' ')[1], req.body)
        .then(user => user ? res.json(user) : res.status(400).json({ message: 'Cannot add the address.' }))
        .catch(err => next(err));
}

function changeDefaultAddress(req, res, next) {
    userService.changeDefaultAddress(req.headers.authorization.split(' ')[1], req.params.id)
        .then(user => user ? res.json(user) : res.status(400).json({ message: 'Cannot change the default address.' }))
        .catch(err => next(err));
}

function getUserAddresses(req, res, next) {
    userService.getUserAddresses(req.headers.authorization.split(' ')[1])
        .then(addresses => addresses ? res.json(addresses) : res.status(400).json({ message: 'Cannot visualize the addresses.' }))
        .catch(err => next(err));
}

function deleteAddress(req, res, next){
    userService.deleteAddress(req.headers.authorization.split(' ')[1], req.params.id)
        .then(addresses => addresses ? res.json(addresses) : res.status(400).json({ message: 'Cannot delete the address.' }))
        .catch(err => next(err));
}

//GET

function getAll(req, res, next) {
    userService.getAll()
        .then(users => res.json(users))
        .catch(err => next(err));
}

function getById(req, res, next) {
    userService.getById(req.params.id)
        .then(user => user ? res.json(user) : res.sendStatus(404))
        .catch(err => next(err));
}

//VERIFY EMAIL

function resendVerify(req, res, next) {
    userService.resendVerify(req.body)
    .then(() => res.json({ message: 'Codigo de verificacion reenviado'}))
    .catch(next);
}

function verifyEmail(req, res, next) {
    userService.verifyEmail(req.body)
        .then(user => user ? res.json(user) : res.status(404).json({ message: 'User not found/invalid verify token.' }))
        .catch(next);
}

//FORGET PW

function forgotPasswordRequest(req, res, next) {
    userService.forgotPasswordRequest(req.body)
        .then(() => res.json({ message: 'Email sent.' }))
        .catch(next);
}

function forgotPasswordTokenOnly(req, res, next) {
    userService.forgotPasswordTokenOnly(req.body)
        .then(() => res.json({ message: 'Token ok' }))
        .catch(next);
}

function forgotPasswordUpdate(req, res, next) {
    userService.forgotPasswordUpdate(req.body)
        .then(() => res.json({ message: 'Password updated.'}))
        .catch(next);
}

//EDIT NAME

function editName(req, res, next) {
    userService.editName(req.headers.authorization.split(' ')[1], req.body)
        .then(user => user ? res.json(user) : res.status(404).json({ message: 'Cannot change the name.' }))
        .catch(next);
}