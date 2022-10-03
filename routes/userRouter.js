const userRouter = require('express').Router();
const userController = require("../controllers/userController");
const authController = require('../controllers/authController');

userRouter.get('/getUser', userController.getUserInfo);
userRouter.post('/resetPassword', authController.resetPassword);

module.exports = userRouter;
