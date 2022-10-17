require('dotenv').config();
const connectDB = require('../Config/connectMongo');
const Permission = require('../models/permission');
const bcrypt = require('bcrypt');
const User = require('../models/user');
const httpMocks = require('node-mocks-http');
const { default: mongoose } = require('mongoose');
const subjectController = require('../controllers/subjectController');
const { StatusCodes } = require('http-status-codes');
const Subject = require('../models/subject');

describe('checkSubject', () => {
	beforeAll(async () => {
		await connectDB();
		await Permission.findOneAndDelete({ email: 'testTeacher@gmail.com' });
		await User.findOneAndDelete({ email: 'testAdmin@gmail.com' });
		await Subject.findOneAndDelete({ subjectCode: 'jestUpdateTest' });

		// Hash the password
		const HashedPassword = bcrypt.hashSync('psw12345', 10);

		await Permission.create({ email: 'testTeacher@gmail.com' });
		admin = await User.create({
			username: 'testAdmin',
			email: 'testAdmin@gmail.com',
			password: HashedPassword,
			role: 'admin',
		});
		teacher = await User.create({
			username: 'testTeacher',
			email: 'testTeacher@gmail.com',
			password: HashedPassword,
			role: 'teacher',
		});
	});
	afterAll(async () => {
		await Permission.findOneAndDelete({ email: 'testTeacher@gmail.com' });
		await User.findOneAndDelete({ email: 'testTeacher@gmail.com' });
		await User.findOneAndDelete({ email: 'testAdmin@gmail.com' });
		await mongoose.disconnect();
	});
	test('Create subject (Success)', async () => {
		const req = {
			body: {
				subjectCode: 'jestTest',
				subjectName: 'jestTest',
				teachers: [teacher.email],
			},
		};
		req.user = await User.findOne({ email: 'testAdmin@gmail.com' });
		const res = httpMocks.createResponse();
		await subjectController.createSubject(req, res);
		expect(res.statusCode).toBe(StatusCodes.CREATED);
	});
	test('Get subject list (Success)', async () => {
		const req = { email: teacher.email };
		const res = httpMocks.createResponse();
		await subjectController.getSubjectList(req, res);
		expect(res.statusCode).toBe(StatusCodes.OK);
	});
	test('Update subject (Success)', async () => {
		testSubject = await Subject.findOne({ subjectCode: 'jestTest' });

		const req = {
			params: { id: testSubject._id },
			body: {
				subjectCode: 'jestUpdateTest',
				subjectName: 'jestUpdateTest',
			},
		};
		req.user = await User.findOne({ email: 'testAdmin@gmail.com' });
		const res = httpMocks.createResponse();
		await subjectController.updateSubject(req, res);
		expect(res.statusCode).toBe(StatusCodes.OK);
	});
	test('Delete subject (Success)', async () => {
		const req = { params: { id: testSubject._id } };
		req.user = await User.findOne({ email: 'testAdmin@gmail.com' });
		const res = httpMocks.createResponse();
		await subjectController.deleteSubject(req, res);
		expect(res.statusCode).toBe(StatusCodes.OK);
	});
});
