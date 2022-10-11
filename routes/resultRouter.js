const express = require('express');

const resultRouter = express.Router();
const resultController = require('../controllers/resultController');

resultRouter.get("/get-result-list", resultController.getResultList);
resultRouter.get("/get-result-detail", resultController.getResultDetail);
resultRouter.post("/store-to-datasets", resultController.storeResultsToDateset);
resultRouter.post("/tag-as-failed", resultController.tagAsFailed);


module.exports = resultRouter;