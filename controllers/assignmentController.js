const Assignment = require('../models/assignment');
const Subject = require('../models/subject');
const Dataset = require('../models/dataset');
const fileBuffer = require('../models/bufferFile');
const { UnauthenticatedError, NotFoundError } = require('../errors');
const { StatusCodes } = require('http-status-codes');
const Historical = require('../models/historical');

const getAssignmentList = async (req, res) => {
	const subject = await Subject.findOne({ _id: req.params.id }).populate({
		path: 'assignments',
		select: '-__v',
		populate: {
			path: 'datasets',
			select: 'datasetName',
		},
	});
	if (!subject)
		throw new NotFoundError(`No subject with id ${req.params.id}`);
	return res.status(StatusCodes.OK).json(subject.assignments);
};

const createAssignment = async (req, res) => {
	if (req.user.role !== 'teacher' && req.user.role !== 'admin')
		throw new UnauthenticatedError(
			'Only teacher/admin can create assignment'
		);
	if (!(await Subject.findById({ _id: req.params.id })))
		throw new NotFoundError(`No subject with id ${req.params.id}`);
	req.body.subjectId = req.params.id;
	const assignment = await Assignment.create(req.body);
	const subject = await Subject.findOneAndUpdate(
		{ _id: req.body.subjectId },
		{ $push: { assignments: assignment._id } },
		{ new: true, runValidators: true }
	);
	return res.status(StatusCodes.CREATED).json({ assignment });
};

const updateAssignment = async (req, res) => {
	if (req.user.role !== 'teacher' && req.user.role !== 'admin')
		throw new UnauthenticatedError(
			'Only teacher/admin can update assignment'
		);
	const {
		body: { assignmentName, dueDate, threshold, maxCheckTimes },
		params: { id: assignmentId },
	} = req;
	const assignment = await Assignment.findOneAndUpdate(
		{ _id: assignmentId },
		{ assignmentName, dueDate, threshold, maxCheckTimes },
		{ new: true, runValidators: true }
	);
	if (!assignment)
		throw new NotFoundError(`No assignmentId with id ${assignmentId}`);
	return res.status(StatusCodes.OK).json({ assignment });
};

const deleteAssignment = async (req, res) => {
	if (req.user.role !== 'teacher' && req.user.role !== 'admin')
		throw new UnauthenticatedError(
			'Only teacher/admin can delete assignment'
		);
	const assignment = await Assignment.findOneAndDelete({
		_id: req.params.id,
	});
	if (!assignment)
		throw new NotFoundError(`No assignment with id ${req.params.id}`);
	for (const datasetId of assignment.datasets) {
		let dataset = await Dataset.findOneAndDelete({ _id: datasetId });
		if (!dataset)
			throw new NotFoundError(`No dataset with id ${datasetId}`);
	}
	await fileBuffer.deleteMany({ assignmentId: assignment._id });
	await Historical.deleteMany({ assignmentId: assignment._id });
	await Subject.updateOne(
		{ _id: assignment.subjectId },
		{ $pull: { assignments: assignment._id } }
	);
	return res.status(StatusCodes.OK).send();
};

const setDatasets = async (req, res) => {
	if (req.user.role !== 'teacher' && req.user.role !== 'admin')
		throw new UnauthenticatedError(
			'Only teacher/admin can create assignment'
		);
	const { setDatasets } = req.body;
	const { id: assignmentId } = req.params;
	const assignment = await Assignment.findOneAndUpdate(
		{ _id: assignmentId },
		{ setDatasets },
		{ new: true, runValidators: true }
	);
	if (!assignment)
		throw new NotFoundError(`No assignment with id ${assignmentId}`);
	return res.status(StatusCodes.OK).json({ assignment });
};

module.exports = {
	getAssignmentList,
	createAssignment,
	updateAssignment,
	deleteAssignment,
	setDatasets,
};
