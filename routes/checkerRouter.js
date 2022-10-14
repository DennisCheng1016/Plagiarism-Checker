const checkerRouter = require('express').Router();
const checkerController = require('../controllers/checkerController');

checkerRouter.post("/", checkerController.postCheckConfig);

checkerRouter.get("/:id", checkerController.canStudentCheck);

module.exports = checkerRouter;