const connectDB = require('../Config/connectMongo');
const auth = require('../controllers/authController');
require('dotenv').config();
const jwt = require('jsonwebtoken');
const User = require('../models/user')
const httpMocks = require('node-mocks-http');

describe('checkAuth', () => {
    beforeAll(async () => {
        await connectDB();

        // just in case test case in database, clean it
        await User.deleteOne({ email: 'validemail@test.com' });
    });

    // use await to make sure it's cleaned up after execution
    afterAll(async () => {
        await User.deleteOne({ email: 'validemail@test.com' })
    });

    test('status 200 and send token when valid register', async () => {

        // set up mock req and res
        var req = httpMocks.createRequest({
            body: { username: "validName", email: "validemail@test.com", password: "Pwd123456" }
        });
        var res = httpMocks.createResponse();
        await auth.register(req, res);

        // assert if the status code is 200
        expect(res.statusCode).toBe(200);

        // get data that sent to res
        data = JSON.parse(res._getData());
        var emailGet;

        // decode the token to get email
        jwt.verify(data.token, process.env.TOKEN_SIGNATURE, (err, user) => {
            emailGet = user.email;
        });

        // assert if the decoded info is correct
        expect(emailGet).toBe("validemail@test.com");
    });

    test('status 409 when account has been registered', async () => {

        // set up mock req and res
        var req = httpMocks.createRequest({
            body: { username: "validName", email: "validemail@test.com", password: "Pwd123456" }
        });
        var res = httpMocks.createResponse();

        await auth.register(req, res);

        // assert the status code is 409
        expect(res.statusCode).toBe(409);

        // get data that sent to res
        data = JSON.parse(res._getData());

        //assert the error message is correct
        expect(data.msg).toBe("Email has been registered");
    });

    test('should return status 200 when login with correct info', async () => {

        // set up mock req and res
        var req = httpMocks.createRequest({
            body: { email: "validemail@test.com", password: "Pwd123456" }
        });
        var res = httpMocks.createResponse();

        await auth.login(req, res);

        // assert the status code is 200
        expect(res.statusCode).toBe(200);

        // get data that sent to res
        data = JSON.parse(res._getData());

        // decode the token to get email
        var emailGet;
        jwt.verify(data.token, process.env.TOKEN_SIGNATURE, (err, user) => {
            emailGet = user.email;
        });

        // assert if the decoded info is correct
        expect(emailGet).toBe("validemail@test.com");
    });

    test('status 400 when login with incorrect info', async () => {

        // set up mock req and res
        var req = httpMocks.createRequest({
            body: { email: "validemail@test.com", password: "Pwd12345" }
        });
        var res = httpMocks.createResponse();

        await auth.login(req, res);

        // assert the status code is 200
        expect(res.statusCode).toBe(400);

        // get data that sent to res
        data = JSON.parse(res._getData());

        //assert the error message is correct
        expect(data.msg).toBe("Incorrect email/password.");
    });
});

