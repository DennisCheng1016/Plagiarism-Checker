const datasetRouter = require('express').Router();
const {
	getDatasetList,
	createDataset,
	updateDataset,
	deleteDataset,
} = require('../controllers/datasetController');

datasetRouter
	.route('/:id')
	.get(getDatasetList)
	.post(createDataset)
	.patch(updateDataset)
	.delete(deleteDataset);

module.exports = datasetRouter;
