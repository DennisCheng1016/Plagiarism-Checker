const { StatusCodes } = require('http-status-codes');
const {
	UnauthenticatedError,
	NotFoundError,
	BadRequestError,
} = require('../errors');
const Assignment = require('../models/assignment');
const Dataset = require('../models/dataset');
const fileBuffer = require('../models/bufferFile');
const Historical = require('../models/historical');

const getDatasetList = async (req, res) => {
	if (req.user.role !== 'teacher' && req.user.role !== 'admin')
		throw new UnauthenticatedError('Only teacher/admin can create dataset');
	const assignment = await Assignment.findOne({
		_id: req.params.id,
	}).populate({
		path: 'datasets',
		select: '-__v',
	});
	if (!assignment)
		throw new NotFoundError(`No dataset with id ${req.params.id}`);
	return res.status(StatusCodes.OK).json(assignment.datasets);
};

const createDataset = async (req, res) => {
	if (req.user.role !== 'teacher' && req.user.role !== 'admin')
		throw new UnauthenticatedError('Only teacher/admin can create dataset');
	if (!(await Assignment.findById({ _id: req.params.id })))
		throw new NotFoundError(`No assignment with id ${req.params.id}`);
	req.body.assignmentId = req.params.id;
	const dataset = await Dataset.create(req.body);
	const assignment = await Assignment.findOneAndUpdate(
		{ _id: req.body.assignmentId },
		{ $push: { datasets: dataset._id } },
		{ new: true, runValidators: true }
	);
	return res.status(StatusCodes.CREATED).json({ dataset });
};

const updateDataset = async (req, res) => {
	if (req.user.role !== 'teacher' && req.user.role !== 'admin')
		throw new UnauthenticatedError('Only teacher/admin can create dataset');
	const {
		body: { datasetName },
		params: { id: datasetId },
	} = req;
	const dataset = await Dataset.findOneAndUpdate(
		{ _id: datasetId },
		{ datasetName },
		{ new: true, runValidators: true }
	);
	if (!dataset) throw new NotFoundError(`No dataset with id ${datasetId}`);
	return res.status(StatusCodes.OK).json({ dataset });
};

const deleteDataset = async (req, res) => {
	if (req.user.role !== 'teacher' && req.user.role !== 'admin')
		throw new UnauthenticatedError('Only teacher/admin can create dataset');
	const dataset = await Dataset.findOneAndDelete({ _id: req.params.id });
	if (dataset.fileType === 'failed') {
		throw new BadRequestError('You cannot delete this dataset');
	}
	if (!dataset)
		throw new NotFoundError(`No dataset with id ${req.params.id}`);
	await Historical.deleteMany({ datasetId: dataset._id });
	await Assignment.updateOne(
		{ _id: dataset.assignmentId },
		{ $pull: { datasets: dataset._id } }
	);
	return res.status(StatusCodes.OK).send();
};

module.exports = {
	getDatasetList,
	createDataset,
	updateDataset,
	deleteDataset,
};
