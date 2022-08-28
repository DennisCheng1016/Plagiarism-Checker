const fileRouter = require('express').Router();
const fileController = require('../controllers/fileController');

fileRouter.post("/post-one-pdf", fileController.postSinglePDF);

fileRouter.get("/get-one-txt", fileController.getSingleTXT);
fileRouter.get("/get-mock-result", fileController.getMockResult);

module.exports = fileRouter;