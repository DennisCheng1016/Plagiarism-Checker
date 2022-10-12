const checkerRouter = require('express').Router();
const checkerController = require('../controllers/checkerController');

checkerRouter.post("/", checkerController.postCheckConfig);

module.exports = checkerRouter;