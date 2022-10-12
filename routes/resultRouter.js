const express = require('express');

const resultRouter = express.Router();
const resultController = require('../controllers/resultController');

resultRouter.get("/getResultList", resultController.getResultList);
resultRouter.get("/getResultDetail", resultController.getResultDetail);
resultRouter.post("/postResultsToDatasets", resultController.storeResultsToDateset);
resultRouter.post("/postResultToFailed", resultController.tagAsFailed);


module.exports = resultRouter;