require('dotenv').config();
const connectDB = require('../Config/connectMongo');
const Permission = require('../models/permission');
const bcrypt = require('bcrypt');
const User = require('../models/user');
const httpMocks = require('node-mocks-http');
const { default: mongoose } = require('mongoose');
const assignmentController = require('../controllers/assignmentController');

const { StatusCodes } = require('http-status-codes');
const Subject = require('../models/subject');
const Assignment = require('../models/assignment');

describe('checkAssignment', () => {
	beforeAll(async () => {
		await connectDB();
		await Permission.findOneAndDelete({ email: 'testTeacher@gmail.com' });
		await User.findOneAndDelete({ email: 'testAdmin@gmail.com' });
		await User.findOneAndDelete({ email: 'testTeacher@gmail.com' });
		await User.findOneAndDelete({ email: 'testStudent@gmail.com' });
		await Subject.findOneAndDelete({ subjectCode: 'testSubjectCode' });
		// Hash the password
		const HashedPassword = bcrypt.hashSync('psw12345', 10);

		await Permission.create({ email: 'testTeacher2@gmail.com' });
		admin = await User.create({
			username: 'testAdmin2',
			email: 'testAdmin2@gmail.com',
			password: HashedPassword,
			role: 'admin',
		});
		student = await User.create({
			username: 'testStudent2',
			email: 'testStudent2@gmail.com',
			password: HashedPassword,
			role: 'student',
		});
		teacher = await User.create({
			username: 'testTeacher2',
			email: 'testTeacher2@gmail.com',
			password: HashedPassword,
			role: 'teacher',
		});
		subject = await Subject.create({
			subjectCode: 'testSubjectCode',
			subjectName: 'testSubjectName',
			teachers: [teacher._id],
		});
	}, 20000);
	afterAll(async () => {
		await Permission.findOneAndDelete({ email: 'testTeacher2@gmail.com' });
		await User.findOneAndDelete({ email: 'testTeacher2@gmail.com' });
		await User.findOneAndDelete({ email: 'testAdmin2@gmail.com' });
		await User.findOneAndDelete({ email: 'testStudent2@gmail.com' });
		await Subject.findOneAndDelete({ subjectCode: 'testSubjectCode' });
		await mongoose.disconnect();
	});
	test('Create assignment (Success)', async () => {
		const req = {
			user: teacher,
			params: { id: subject._id },
			body: {
				assignmentName: 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
				dueDate: '1000-10-16',
				threshold: '10',
				maxCheckTimes: '100',
			},
		};
		const res = httpMocks.createResponse();
		await assignmentController.createAssignment(req, res);
		expect(res.statusCode).toBe(StatusCodes.CREATED);
	});
	test('Update assignment (Success)', async () => {
		testAssignment = await Assignment.findOne({
			assignmentName: 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
			dueDate: '1000-10-16',
			threshold: '10',
			maxCheckTimes: '100',
		});
		const req = {
			user: teacher,
			params: { id: testAssignment._id },
			body: {
				assignmentName: 'yyyyyyyyyyyyyyyyyyyyyyyy',
				dueDate: '1200-10-16',
				threshold: '20',
				maxCheckTimes: '30',
			},
		};
		const res = httpMocks.createResponse();
		await assignmentController.updateAssignment(req, res);
		expect(res.statusCode).toBe(StatusCodes.OK);
	});
	test('Get assignment list (Success)', async () => {
		const req = {
			params: { id: subject._id },
		};
		const res = httpMocks.createResponse();
		await assignmentController.getAssignmentList(req, res);
		expect(res.statusCode).toBe(StatusCodes.OK);
	});
	test('Delete assignment (Success)', async () => {
		const req = {
			user: teacher,
			params: { id: testAssignment._id },
		};
		const res = httpMocks.createResponse();
		await assignmentController.deleteAssignment(req, res);
		expect(res.statusCode).toBe(StatusCodes.OK);
	});
});
