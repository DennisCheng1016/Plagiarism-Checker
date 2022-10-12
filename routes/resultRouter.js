const express = require('express');

const resultRouter = express.Router();
const resultController = require('../controllers/resultController');

resultRouter.get("/list/:id", resultController.getResultList);
resultRouter.get("/:id", resultController.getResultDetail);

resultRouter.post("/dataset", resultController.saveResultsToHistorical);


module.exports = resultRouter;