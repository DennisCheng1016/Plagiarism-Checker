const bufferFileRouter = require('express').Router();
const bufferController = require('../controllers/bufferFileContorller');

bufferFileRouter.get("/getBufferFileList", bufferController.getBufferFiles);

module.exports = bufferFileRouter;