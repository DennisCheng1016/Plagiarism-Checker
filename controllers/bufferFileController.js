const fileBuffer = require('../models/bufferFile');
const { StatusCodes } = require('http-status-codes');
const {
	NotFoundError,
	BadRequestError,
	UnauthenticatedError,
} = require('../errors');
const Assignment = require('../models/assignment');

const uploadFiles = async (req, res) => {
	if (!req.files) throw new NotFoundError('No file upload!');
	const files = req.files.file;
	const { fileType } = req.body;
	const { id: assignmentId } = req.params;
	if (!(await Assignment.findById({ _id: assignmentId }))) {
		throw new NotFoundError(`No assignment with id ${assignmentId}}`);
	}
	if (req.user.role === 'student') {
		await fileBuffer.deleteOne({
			assignmentId: assignmentId,
			user: req.user._id,
		});
		if (Array.isArray(files))
			throw new BadRequestError(
				'Student only can upload one file for an assignment per time'
			);
		if (!files.name.endsWith(fileType)) {
			throw new BadRequestError('Upload file type is incorrect');
		}
		const saveFile = await fileBuffer.create({
			assignmentId: assignmentId,
			user: req.user._id,
			fileType: fileType,
			fileName: files.name,
			binary: files.data,
		});
	} else {
		if (Array.isArray(files)) {
			for (const file of files) {
				if (!file.name.endsWith(fileType)) {
					throw new BadRequestError('Upload file type is incorrect');
				}
				const saveFile = await fileBuffer.create({
					assignmentId: assignmentId,
					user: req.user._id,
					fileType: fileType,
					fileName: file.name,
					binary: file.data,
				});
			}
		} else {
			if (!files.name.endsWith(fileType)) {
				throw new BadRequestError('Upload file type is incorrect');
			}
			const saveFile = await fileBuffer.create({
				assignmentId: assignmentId,
				user: req.user._id,
				fileType: fileType,
				fileName: files.name,
				binary: files.data,
			});
		}
	}
	return res.status(StatusCodes.OK).send();
};

const getBufferFiles = async (req, res) => {
	const { id: assignmentId } = req.params;
	if (!(await Assignment.findById({ _id: assignmentId }))) {
		throw new NotFoundError(`No assignment with id ${assignmentId}}`);
	}
	let files;
	if (req.user.role === 'student') {
		files = await fileBuffer
			.findOne({ assignmentId: assignmentId, user: req.user._id })
			.select('-binary -__v')
			.populate({
				path: 'assignmentId',
				select: 'assignmentName',
				populate: {
					path: 'subjectId',
					select: 'subjectName',
				},
			})
			.populate({
				path: 'user',
				select: 'username email',
			});
	} else {
		files = await fileBuffer
			.find({ assignmentId: assignmentId })
			.select('-binary -__v')
			.populate({
				path: 'assignmentId',
				select: 'assignmentName',
				populate: {
					path: 'subjectId',
					select: 'subjectName',
				},
			})
			.populate({
				path: 'user',
				select: 'username email',
			});
	}
	return res.status(StatusCodes.OK).json(files);
};

const deleteBufferFile = async (req, res) => {
	if (req.user.role !== 'teacher' && req.user.role !== 'admin')
		throw new UnauthenticatedError(
			'Only teacher/admin can get buffer files'
		);
	const { id: fileId } = req.params;
	const file = await fileBuffer.findOneAndDelete({ _id: fileId });
	if (!file) throw new NotFoundError(`No file with id ${fileId}`);
	return res.status(StatusCodes.OK).send();
};

module.exports = {
	getBufferFiles,
	deleteBufferFile,
	uploadFiles,
};
