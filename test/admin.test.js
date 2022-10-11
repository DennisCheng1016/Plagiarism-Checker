require('dotenv').config();
const User = require("../models/user");
const httpMocks = require("node-mocks-http");
const adminController = require('../controllers/adminController');
const connectDB = require("../Config/connectMongo");
const Permission = require('../models/permission');
const mongoose = require("mongoose");

describe('checkAuth', () => {
    beforeAll(async () => {
        await connectDB();
        await Permission.findOneAndDelete({email: "teacher123@gmail.com"});
    });
    afterAll(async () => {
        await mongoose.disconnect();
    });
    // the verify token middleware will ensure all input are valid
    it('getAllUser (Success)', async () => {
        const req = {};
        // verify token will let req.user become user object
        req.user = await User.findById('6342e0f5748992f75b4351a2');
        const res = httpMocks.createResponse();
        await adminController.getAllUser(req,res);
        expect(res.statusCode).toBe(201);
    });
    it('getAllPermission (Success)', async () => {
        const req = {};
        // verify token will let req.user become user object
        req.user = await User.findById('63439de4b703b94a4429086c');
        const res = httpMocks.createResponse();
        await adminController.getAllPermission(req, res);
        expect(res.statusCode).toBe(201);
    });
    it('updateUser (Success)', async () => {
        const req = {body: {userEmail: "student1@gmail.com",update: {username: "student1",accountStatus:"active"}}};
        // verify token will let req.user become user object
        req.user = await User.findById('63439de4b703b94a4429086c');
        const res = httpMocks.createResponse();
        await adminController.updateUser(req, res);
        expect(res.statusCode).toBe(201);
        // get data that sent to res
        data = JSON.parse(res._getData());
        expect(data.username).toBe( "student1");
        expect(data.accountStatus).toBe("active");
    });
    it('permitTeacherRegistration (Success)', async () => {
        const req = {body: {email: "teacher123@gmail.com"}};
        // verify token will let req.user become user object
        req.user = await User.findById('63439de4b703b94a4429086c');
        const res = httpMocks.createResponse();
        await adminController.permitTeacherRegistration(req, res);
        expect(res.statusCode).toBe(201);
        // get data that sent to res
        data = JSON.parse(res._getData());
        expect(data.msg).toBe("permitted registration");
    });
});

