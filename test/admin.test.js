require('dotenv').config();
const User = require("../models/user");
const httpMocks = require("node-mocks-http");
const adminController = require('../controllers/adminController');
const connectDB = require("../Config/connectMongo");
const Permission = require('../models/permission');
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

describe('checkAuth', () => {
    beforeAll(async () => {
        await connectDB();
        await Permission.findOneAndDelete({email: "teacher123@gmail.com"});

        // hash the password
        const HashedPassword = await bcrypt.hashSync("Psw12345", 10);
        // create student account
        await User.create({
            username: "testStudent", email: "testStudent@test.com", password: HashedPassword, role:"student"
        });
        // create admin account
        await User.create({
            username: "testAdmin", email: "testAdmin@test.com", password: HashedPassword, role:"admin"
        });
    });
    afterAll(async () => {
        await Permission.findOneAndDelete({email: "teacher123@gmail.com"});
        await User.findOneAndDelete({email: "testStudent@test.com"});
        await User.findOneAndDelete({email: "testAdmin@test.com"});
        await mongoose.disconnect();
    });
    // the verify token middleware will ensure all input are valid
    it('getAllUser (Success)', async () => {
        const req = {};
        // verify token will let req.user become user object
        req.user = await User.findOne({email: "testAdmin@test.com"});
        const res = httpMocks.createResponse();
        await adminController.getAllUser(req,res);
        expect(res.statusCode).toBe(201);
    });
    it('getAllPermission (Success)', async () => {
        const req = {};
        // verify token will let req.user become user object
        req.user = await User.findOne({email: "testAdmin@test.com"});
        const res = httpMocks.createResponse();
        await adminController.getAllPermission(req, res);
        expect(res.statusCode).toBe(201);
    });
    it('updateUser (Success)', async () => {
        const req = {body: {userEmail: "testStudent@test.com",update: {username: "testStudent1",accountStatus:"active"}}};
        // verify token will let req.user become user object
        req.user = await User.findOne({email: "testAdmin@test.com"});
        const res = httpMocks.createResponse();
        await adminController.updateUser(req, res);
        expect(res.statusCode).toBe(201);
        // get data that sent to res
        data = JSON.parse(res._getData());
        expect(data.username).toBe( "testStudent1");
        expect(data.accountStatus).toBe("active");
    });
    it('permitTeacherRegistration (Success)', async () => {
        const req = {body: {email: "teacher123@gmail.com"}};
        // verify token will let req.user become user object
        req.user = await User.findOne({email: "testAdmin@test.com"});
        const res = httpMocks.createResponse();
        await adminController.permitTeacherRegistration(req, res);
        expect(res.statusCode).toBe(201);
        // get data that sent to res
        data = JSON.parse(res._getData());
        expect(data.msg).toBe("permitted registration");
    });
});

