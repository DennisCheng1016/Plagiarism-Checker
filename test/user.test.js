require('dotenv').config();
const User = require('../models/user');
const httpMocks = require('node-mocks-http');
const userController = require('../controllers/userController');
const connectDB = require('../Config/connectMongo');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

describe('checkAuth', () => {
	beforeAll(async () => {
		await connectDB();
		// hash the password
		const HashedPassword = bcrypt.hashSync('Psw12345', 10);
		await User.findOneAndDelete({ email: 'testStudent2@test.com' });
		await User.create({
			username: 'testStudent2',
			email: 'testStudent2@test.com',
			password: HashedPassword,
			role: 'student',
		});
	});
	afterAll(async () => {
		await User.findOneAndDelete({ email: 'testStudent2@test.com' });
		await mongoose.disconnect();
	});
	// the verify token middleware will ensure all input are valid
	it('getUserInfo (Success)', async () => {
		const req = {};
		// verify token will let req.user become user object
		req.user = await User.findOne({ email: 'testStudent2@test.com' });
		const res = httpMocks.createResponse();
		await userController.getUserInfo(req, res);
		expect(res.statusCode).toBe(201);
		let data = JSON.parse(res._getData());
		expect(data.email).toBe('testStudent2@test.com');
	});
	it('resetPassword (Success)', async () => {
		const req = {
			email: 'testStudent2@test.com',
			body: { password: '123123' },
		};
		// verify token will let req.user become user object
		req.user = await User.findOne({ email: 'testStudent2@test.com' });
		const res = httpMocks.createResponse();
		await userController.resetPassword(req, res);
		expect(res.statusCode).toBe(201);
		let data = JSON.parse(res._getData());
		expect(data.msg).toBe('Success');
	});
});
