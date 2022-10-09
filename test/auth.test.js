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
            body: { username: "validName", email: "validemail@test.com", password: "Pwd123456", role: "student" }
        });
        var res = httpMocks.createResponse();
        await auth.register(req, res);

        // assert if the status code is 200
        expect(res.statusCode).toBe(200);

        // get data that sent to res
        data = JSON.parse(res._getData());

        //assert the error message is correct
        expect(data.msg).toBe("registration successful");
    });

    it('should throw error when account has been registered', async function () {
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
        const payload = jwt.verify(data.Authorization, process.env.TOKEN_SIGNATURE);

        // assert if the decoded info is correct
        expect(payload.username).toBe("validName");
        expect(payload.email).toBe("validemail@test.com");
        expect(payload.role).toBe("student");
    });

    test('status 409 when login with incorrect info', async () => {

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

