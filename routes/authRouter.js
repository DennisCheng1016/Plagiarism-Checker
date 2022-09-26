// add our router
const authRouter = require('express').Router();

// require the user controller
const userController = require('../controllers/authController');

// Register a new user
authRouter.post('/register', userController.register);

// Login a new user.
authRouter.post('/login', userController.login);


module.exports = authRouter

