const Subject = require('../models/subject');
const User = require('../models/user');
const {
	BadRequestError,
	UnauthenticatedError,
	NotFoundError,
} = require('../errors');
const { StatusCodes } = require('http-status-codes');
const Assignment = require('../models/assignment');
const Dataset = require('../models/dataset');

const getSubjectListAdmin = async (req, res) => {
	if (req.user.role !== 'admin')
		throw new UnauthenticatedError('Only admin can get all subjects');
	const subjects = await Subject.find({})
		.select('-__v')
		.sort('subjectCode')
		.populate({
			path: 'teachers',
			select: 'username',
		});

	return res.status(StatusCodes.OK).json(subjects);
};
const getSubjectList = async (req, res) => {
	const userEmail = req.email;
	const user = await User.findOne({ email: userEmail }).populate({
		path: 'subjects',
		select: 'subjectCode subjectName teachers',
		populate: {
			path: 'teachers',
			select: 'username',
		},
		options: { sort: { subjectCode: 1 } },
	});
	return res.status(200).json(user.subjects);
};

const createSubject = async (req, res) => {
	if (req.user.role !== 'admin')
		throw new UnauthenticatedError('Only admin can create subject');
	const { subjectCode, subjectName, teachers } = req.body;
	const teachersId = [];
	if (teachers) {
		for (const teacherEmail of teachers) {
			let teacher = await User.findOne({
				email: teacherEmail,
				role: 'teacher',
			}).select('_id');
			if (!teacher) throw new NotFoundError('Teacher email is incorrect');
			teachersId.push(teacher);
		}
	}
	const subject = await Subject.create({
		subjectCode,
		subjectName,
		teachers: teachersId,
	});
	for (const teacherId of teachersId) {
		const result = await User.updateOne(
			{ _id: teacherId, role: 'teacher' },
			{ $push: { subjects: subject._id } }
		);
	}
	return res.status(StatusCodes.CREATED).json({ subject });
};

const updateSubject = async (req, res) => {
	if (req.user.role !== 'admin')
		throw new UnauthenticatedError('Only admin can create subject');
	const {
		body: { subjectCode, subjectName, teachers },
		params: { id: subjectId },
	} = req;
	const subject = await Subject.findOneAndUpdate(
		{ _id: subjectId },
		{ subjectCode, subjectName },
		{ new: true, runValidators: true }
	);
	if (!subject) throw new NotFoundError(`No subject with id ${subjectId}`);
	const teachersId = [];
	if (teachers) {
		for (const teacherEmail of teachers) {
			let teacher = await User.findOne({
				email: teacherEmail,
				role: 'teacher',
			}).select('_id');
			if (!teacher) throw new NotFoundError('Teacher email is incorrect');
			teachersId.push(teacher);
		}
	}
	for (const preTeacherId of subject.teachers) {
		let teacher = await User.updateOne(
			{ _id: preTeacherId, role: 'teacher' },
			{ $pull: { subjects: subject._id } }
		);
		subject.teachers.pull(preTeacherId);
		await subject.save();
	}
	for (const teacherId of teachersId) {
		let teacher = await User.findOneAndUpdate(
			{ _id: teacherId, role: 'teacher' },
			{ $push: { subjects: subject._id } }
		);
		subject.teachers.push(teacherId);
		await subject.save();
	}
	const finalSubject = await Subject.findById(subjectId);
	return res.status(StatusCodes.OK).json({ finalSubject });
};

const deleteSubject = async (req, res) => {
	if (req.user.role !== 'admin')
		throw new UnauthenticatedError('Only admin can create subject');
	const subject = await Subject.findOneAndDelete({
		_id: req.params.id,
	});
	if (!subject)
		throw new NotFoundError(`No subject with id ${req.params.id}`);
	for (const assignmentId of subject.assignments) {
		let assignment = await Assignment.findOneAndDelete({
			_id: assignmentId,
		});
		if (!assignment)
			throw new NotFoundError(`No assignment with id ${assignmentId}`);
		for (const datasetId of assignment.datasets) {
			let dataset = await Dataset.findOneAndDelete({
				_id: datasetId,
			});
			if (!dataset)
				throw new NotFoundError(`No dataset with id ${datasetId}`);
		}
	}
	const users = await User.updateMany(
		{ subjects: subject._id },
		{ $pull: { subjects: subject._id } }
	);
	return res.status(StatusCodes.OK).send();
};

const addStudent = async (req, res) => {
	const subjectCode = req.body.subjectCode;
	const subject = await Subject.findOne({ subjectCode: subjectCode });
	if (!subject)
		throw new NotFoundError(`No subject with code ${subjectCode}`);
	if (
		await User.findOne({
			_id: req.user._id,
			subjects: { $in: [subject._id] },
		})
	)
		throw new BadRequestError('Subject exists');
	const student = await User.findOneAndUpdate(
		{ _id: req.user._id, role: 'student' },
		{ $push: { subjects: subject._id } },
		{ new: true, runValidators: true }
	);
	subject.students.push(student);
	await subject.save();
	return res.status(StatusCodes.OK).json();
};

module.exports = {
	createSubject,
	updateSubject,
	addStudent,
	deleteSubject,
	getSubjectList,
	getSubjectListAdmin,
};

function paginate(array, page_size, page_number) {
	// human-readable page numbers usually start with 1, so we reduce 1 in the first argument
	return array.slice((page_number - 1) * page_size, page_number * page_size);
}
