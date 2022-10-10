const Assignment = require('../models/assignment');
const Subject = require('../models/subject');
const User = require('../models/user');
const { UnauthenticatedError, NotFoundError } = require('../errors');
const { StatusCodes } = require('http-status-codes');

const getAssignmentList = async (req, res) => {
	const subject = await Subject.findOne({ _id: req.params.id }).populate({
		path: 'assignments',
		select: '-__v',
		// populate: {
		// 	path: 'dataset',
		// 	select: 'datasetName',
		// },
	});
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
	return res.status(StatusCodes.OK).json({ assignment });
};

const deleteAssignment = async (req, res) => {
	try {
		const userEmail = req.email;
		const assignmentID = req.body.assignmentID;
		const subjectCode = req.body.subjectCode;
		if (!(await User.findOne({ email: userEmail, role: 'teacher' })))
			return res.status(409).json({ mag: 'Must be teacher to perform' });
		if (
			!(await Subject.findOne({
				subjectCode: subjectCode,
				assignments: assignmentID,
			}))
		)
			return res.status(409).json({
				mag: 'Subject not found or subject does not have this assignment',
			});
		const assignment = await Assignment.findById(assignmentID);
		if (!assignment)
			return res.status(409).json({ mag: 'Assignment does not exist' });
		else {
			const result = await Subject.updateOne(
				{ subjectCode: subjectCode },
				{ $pull: { assignments: assignment._id } }
			);
			const result2 = await Assignment.deleteOne({ _id: assignmentID });
		}
		return res.status(200).json({ msg: 'Delete assignment successfully' });
	} catch (error) {
		res.status(500).json({ msg: error.message });
	}
};

module.exports = {
	getAssignmentList,
	createAssignment,
	updateAssignment,
	deleteAssignment,
};
