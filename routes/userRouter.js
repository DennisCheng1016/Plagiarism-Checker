const userRouter = require('express').Router();
const userController = require("../controllers/userController");

userRouter.get('/getUser', userController.getUserInfo);
userRouter.post('/resetPassword',userController.resetPassword);

module.exports = userRouter;
