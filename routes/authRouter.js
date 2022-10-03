// add our router
const authRouter = require('express').Router();

// require the user controller
const authController = require('../controllers/authController');

// Register a new user
authRouter.post('/register', authController.register);

// Login a new user.
authRouter.post('/login', authController.login);

authRouter.post('/recoverEmail', authController.sendAuthenticationEmail);

module.exports = authRouter

