const datasetFileRouter = require('express').Router();
const {
	getDatasetFiles,
	getDatasetFile,
	deleteDatasetFile,
} = require('../controllers/datasetFileController');

datasetFileRouter
	.route('/:id')
	.get(getDatasetFile)
	.delete(deleteDatasetFile);
datasetFileRouter.route('/list/:id').get(getDatasetFiles);

module.exports = datasetFileRouter;
