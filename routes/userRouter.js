const userRouter = require('express').Router();
const userController = require("../controllers/userController");

userRouter.get('/getUser', userController.getUserInfo);

module.exports = userRouter;
