const bufferFileRouter = require('express').Router();
const {
	uploadFiles,
	getBufferFiles,
	deleteBufferFile,
} = require('../controllers/bufferFileController');

bufferFileRouter
	.route('/:id')
	.get(getBufferFiles)
	.post(uploadFiles)
	.delete(deleteBufferFile);

module.exports = bufferFileRouter;
