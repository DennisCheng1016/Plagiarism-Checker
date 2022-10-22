require('dotenv').config();
const connectDB = require('../Config/connectMongo');
const Permission = require('../models/permission');
const bcrypt = require('bcrypt');
const User = require('../models/user');
const httpMocks = require('node-mocks-http');
const { default: mongoose } = require('mongoose');
const datasetController = require('../controllers/datasetController');
const bufferFileController = require('../controllers/bufferFileController');

const { StatusCodes } = require('http-status-codes');
const Subject = require('../models/subject');
const Assignment = require('../models/assignment');
const Dataset = require('../models/dataset');
const fileBuffer = require('../models/bufferFile');

describe('checkAssignment', () => {
	beforeAll(async () => {
		await connectDB();
		await Permission.findOneAndDelete({ email: 'testTeacher4@gmail.com' });
		await User.findOneAndDelete({ email: 'testAdmin4@gmail.com' });
		await User.findOneAndDelete({ email: 'testTeacher4@gmail.com' });
		await User.findOneAndDelete({ email: 'testStudent4@gmail.com' });
		await Subject.findOneAndDelete({ subjectCode: 'testSubjectCode3' });
		await Assignment.findOneAndDelete({
			assignmentName: 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
		});
		// Hash the password
		const HashedPassword = bcrypt.hashSync('psw12345', 10);

		await Permission.create({ email: 'testTeacher4@gmail.com' });
		admin = await User.create({
			username: 'testAdmin4',
			email: 'testAdmin4@gmail.com',
			password: HashedPassword,
			role: 'admin',
		});
		student = await User.create({
			username: 'testStudent4',
			email: 'testStudent4@gmail.com',
			password: HashedPassword,
			role: 'student',
		});
		teacher = await User.create({
			username: 'testTeacher4',
			email: 'testTeacher4@gmail.com',
			password: HashedPassword,
			role: 'teacher',
		});
		subject = await Subject.create({
			subjectCode: 'testSubjectCode3',
			subjectName: 'testSubjectName',
			teachers: [teacher._id],
		});
		assignment = await Assignment.create({
			subjectId: subject._id,
			assignmentName: 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
			dueDate: '1000-10-16',
			threshold: '10',
			maxCheckTimes: '100',
		});
	}, 20000);
	afterAll(async () => {
		await Permission.findOneAndDelete({ email: 'testTeacher4@gmail.com' });
		await User.findOneAndDelete({ email: 'testTeacher4@gmail.com' });
		await User.findOneAndDelete({ email: 'testAdmin4@gmail.com' });
		await User.findOneAndDelete({ email: 'testStudent4@gmail.com' });
		await Subject.findOneAndDelete({ subjectCode: 'testSubjectCode3' });
		await Assignment.findOneAndDelete({
			assignmentName: 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
		});
		await mongoose.disconnect();
	});
	test('Upload files (Success)', async () => {
		const req = {
			user: teacher,
			params: { id: assignment._id },
			body: {
				fileType: 'pdf',
			},
			files: {
				file: {
					name: 'testFile.pdf',
					data: 'fakeData',
				},
			},
		};
		const res = httpMocks.createResponse();
		await bufferFileController.uploadFiles(req, res);
		expect(res.statusCode).toBe(StatusCodes.CREATED);
	});
	test('Get dataset list (Success)', async () => {
		const req = {
			user: teacher,
			params: { id: assignment._id },
		};
		const res = httpMocks.createResponse();
		await bufferFileController.getBufferFiles(req, res);
		expect(res.statusCode).toBe(StatusCodes.OK);
	});
	test('Delete dataset (Success)', async () => {
		const testFile = await fileBuffer.findOne({
			fileName: 'testFile.pdf',
			fileType: 'pdf',
		});
		const req = {
			user: teacher,
			params: { id: testFile._id },
		};
		const res = httpMocks.createResponse();
		await bufferFileController.deleteBufferFile(req, res);
		expect(res.statusCode).toBe(StatusCodes.OK);
	});
});
