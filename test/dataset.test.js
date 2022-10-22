require('dotenv').config();
const connectDB = require('../Config/connectMongo');
const Permission = require('../models/permission');
const bcrypt = require('bcrypt');
const User = require('../models/user');
const httpMocks = require('node-mocks-http');
const { default: mongoose } = require('mongoose');
const datasetController = require('../controllers/datasetController');

const { StatusCodes } = require('http-status-codes');
const Subject = require('../models/subject');
const Assignment = require('../models/assignment');
const Dataset = require('../models/dataset');

describe('checkAssignment', () => {
	beforeAll(async () => {
		await connectDB();
		await Permission.findOneAndDelete({ email: 'testTeacher3@gmail.com' });
		await User.findOneAndDelete({ email: 'testAdmin3@gmail.com' });
		await User.findOneAndDelete({ email: 'testTeacher3@gmail.com' });
		await User.findOneAndDelete({ email: 'testStudent3@gmail.com' });
		await Subject.findOneAndDelete({ subjectCode: 'testSubjectCode2' });
		await Assignment.findOneAndDelete({
			assignmentName: 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
		});
		// Hash the password
		const HashedPassword = bcrypt.hashSync('psw12345', 10);

		await Permission.create({ email: 'testTeacher3@gmail.com' });
		admin = await User.create({
			username: 'testAdmin3',
			email: 'testAdmin3@gmail.com',
			password: HashedPassword,
			role: 'admin',
		});
		student = await User.create({
			username: 'testStudent3',
			email: 'testStudent3@gmail.com',
			password: HashedPassword,
			role: 'student',
		});
		teacher = await User.create({
			username: 'testTeacher3',
			email: 'testTeacher3@gmail.com',
			password: HashedPassword,
			role: 'teacher',
		});
		subject = await Subject.create({
			subjectCode: 'testSubjectCode2',
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
		await Permission.findOneAndDelete({ email: 'testTeacher3@gmail.com' });
		await User.findOneAndDelete({ email: 'testTeacher3@gmail.com' });
		await User.findOneAndDelete({ email: 'testAdmin3@gmail.com' });
		await User.findOneAndDelete({ email: 'testStudent3@gmail.com' });
		await Subject.findOneAndDelete({ subjectCode: 'testSubjectCode2' });
		await Assignment.findOneAndDelete({
			assignmentName: 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
		});
		await mongoose.disconnect();
	});
	test('Create dataset (Success)', async () => {
		const req = {
			user: teacher,
			params: { id: assignment._id },
			body: {
				datasetName: 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
				fileType: 'pdf',
			},
		};
		const res = httpMocks.createResponse();
		await datasetController.createDataset(req, res);
		expect(res.statusCode).toBe(StatusCodes.CREATED);
	});
	test('Update dataset (Success)', async () => {
		testDataset = await Dataset.findOne({
			assignmentName: 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
			fileType: 'pdf',
		});
		const req = {
			user: teacher,
			params: { id: testDataset._id },
			body: {
				assignmentName: 'yyyyyyyyyyyyyyyyyyyyyyyy',
				fileType: 'c',
			},
		};
		const res = httpMocks.createResponse();
		await datasetController.updateDataset(req, res);
		expect(res.statusCode).toBe(StatusCodes.OK);
	});
	test('Get dataset list (Success)', async () => {
		const req = {
			user: teacher,
			params: { id: assignment._id },
		};
		const res = httpMocks.createResponse();
		await datasetController.getDatasetList(req, res);
		expect(res.statusCode).toBe(StatusCodes.OK);
	});
	test('Delete dataset (Success)', async () => {
		const req = {
			user: teacher,
			params: { id: testDataset._id },
		};
		const res = httpMocks.createResponse();
		await datasetController.deleteDataset(req, res);
		expect(res.statusCode).toBe(StatusCodes.OK);
	});
});
