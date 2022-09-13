const express = require('express');

// add our router
const adminRouter = express.Router();

// Set router to use urlencoded (so that we can read res.body).
adminRouter.use(express.urlencoded({ extended: true }));
adminRouter.use(express.json());

// require the user controller
const adminController = require('../controllers/adminController');

// Login a new user.
adminRouter.post('/login', adminController.login);

module.exports = adminRouter

