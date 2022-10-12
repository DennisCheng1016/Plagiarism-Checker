const connectDB = require('../Config/connectMongo');
const auth = require('../controllers/authController');
require('dotenv').config();
const jwt = require('jsonwebtoken');
const User = require('../models/user')
const httpMocks = require('node-mocks-http');
const mongoose = require("mongoose");

describe('checkAuth', () => {
    beforeAll(async () => {
        await connectDB();

        // just in case test case in database, clean it
        await User.deleteOne({ email: 'validemail@test.com' });
    });

    // use await to make sure it's cleaned up after execution
    afterAll(async () => {
        await User.deleteOne({ email: 'validemail@test.com' });
        await mongoose.disconnect();
    });

    test('Register (Success)', async () => {

        // set up mock req and res
        var req = httpMocks.createRequest({
            body: { username: "validName", email: "validemail@test.com", password: "Pwd123456", role: "student" }
        });
        var res = httpMocks.createResponse();
        await auth.register(req, res);

        // assert if the status code is 200
        expect(res.statusCode).toBe(201);

        // get data that sent to res
        data = JSON.parse(res._getData());

        //assert the error message is correct
        expect(data.msg).toBe("registration successful");
    });

    it('Register (Failure)', async function () {
        var req = httpMocks.createRequest({
            body: { username: "validName", email: "validemail@test.com", password: "Pwd123456", role: "student" }
        });
        var res = httpMocks.createResponse();
        try {
            await auth.register(req, res)
        } catch (e) {
            expect(e).toEqual(new Error("the email has been registered, wanna try new ones?"));
        }
    });

    test('Login (Success)', async () => {

        // set up mock req and res
        var req = httpMocks.createRequest({
            body: { email: "validemail@test.com", password: "Pwd123456" }
        });
        var res = httpMocks.createResponse();

        await auth.login(req, res);

        // assert the status code is 200
        expect(res.statusCode).toBe(201);

        // get data that sent to res
        data = JSON.parse(res._getData());

        // decode the token to get email, expect no errors
        jwt.verify(data.Authorization, process.env.TOKEN_SIGNATURE);
    });

    test('Login (Failure)', async () => {

        // set up mock req and res
        var req = httpMocks.createRequest({
            body: { email: "validemail@test.com", password: "Pwd12345" }
        });
        var res = httpMocks.createResponse();

        try {
            await auth.login(req, res);
        } catch (e) {
            expect(e).toEqual(new Error('Incorrect email/password.'));
        }
    });
});

