require('dotenv').config();
const User = require("../models/user");
const httpMocks = require("node-mocks-http");
const userController = require('../controllers/userController');
const connectDB = require("../Config/connectMongo");

describe('checkAuth', () => {
    beforeAll(async () => {
        await connectDB();
    });
    // the verify token middleware will ensure all input are valid
    it('getUserInfo (Success)', async () => {
        const req = {};
        // verify token will let req.user become user object
        req.user = await User.findById('63439de4b703b94a4429086c');
        const res = httpMocks.createResponse();
        await userController.getUserInfo(req, res);
        expect(res.statusCode).toBe(201);
        let data = JSON.parse(res._getData());
        expect(data.email).toBe("student1@gmail.com");
    });
    it('resetPassword (Success)', async () => {
        const req = {email: "student1@gmail.com", body: {password: "123123"}};
        // verify token will let req.user become user object
        req.user = await User.findById('63439de4b703b94a4429086c');
        const res = httpMocks.createResponse();
        await userController.resetPassword(req, res);
        expect(res.statusCode).toBe(201);
        let data = JSON.parse(res._getData());
        expect(data.msg).toBe("Success");
    });
});

