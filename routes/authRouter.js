const express = require('express');

// add our router
const userRouter = express.Router();

// Set router to use urlencoded (so that we can read res.body).
userRouter.use(express.urlencoded({ extended: true }));
userRouter.use(express.json());

// require the user controller
const userController = require('../controllers/authController');

// Register a new user
userRouter.post('/register', userController.register);

// Login a new user.
userRouter.post('/login', userController.login);

module.exports = userRouter

