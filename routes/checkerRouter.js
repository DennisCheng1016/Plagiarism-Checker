const checkerRouter = require('express').Router();
const checkerController = require('../controllers/checkerController');

checkerRouter.post("/postCheckConfig", checkerController.postCheckConfig);

module.exports = checkerRouter;