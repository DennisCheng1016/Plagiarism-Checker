const bufferFileRouter = require('express').Router();
const bufferController = require('../controllers/bufferFileContorller');

bufferFileRouter.get("/getBufferFileList", bufferController.getBufferFiles);
bufferFileRouter.post("/deleteFile", bufferController.deleteBufferFile);

module.exports = bufferFileRouter;