const express = require('express');

const resultRouter = express.Router();
const resultController = require('../controllers/resultController');

resultRouter.get("/get-result-list", resultController.getResultList);


module.exports = resultRouter;