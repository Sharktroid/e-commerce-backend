require('../utils/utility.function');
const middleware = require('./middleware');
const { newToken } = require('../utils/utility.function');
const { connectDB } = require('../config/db');
const User = require('../models/User');

let user;
let res;
let next;

const email = 'middleware@test.com'

beforeAll(async () => {
    await connectDB();
    user = new User({
        fullName: 'John Doe',
        email: email,
        password: 'password123'
    });
    await user.save();
    res = {
        status: jest.fn().mockReturnThis(),
        send: jest.fn(),
    };
    next = jest.fn()
});

afterAll(async () => {
    user.remove();
});


describe('Middleware Tests', () => {
    test('sends a response error with status code and message', () => {
        const statusCode = 404;
        const msg = 'Page not found !!';

        middleware.sendResponseError(statusCode, msg, res);

        expect(res.status).toHaveBeenCalledWith(statusCode);
        expect(res.send).toHaveBeenCalledWith(msg);
    });

    test('sends a response error with default status code and message', () => {
        const statusCode = undefined;
        const msg = undefined;

        middleware.sendResponseError(statusCode, msg, res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.send).toHaveBeenCalledWith('Invalid input !!');
    });

    test('verifyUser should call next() for valid token', async () => {
        const token = newToken(user);
        const req = {
            headers: {
                authorization: `Bearer ${token}`
            }
        }
        const res = {
            status: jest.fn().mockReturnThis(),
            send: jest.fn(),
        };
        const next = jest.fn()
        await middleware.verifyUser(req, res, next).then(() => {
            expect(res.send).not.toHaveBeenCalled();
            expect(next).toHaveBeenCalled();
            expect(req.user._id).toStrictEqual(user._id);
            expect(req.user.email).toBe(user.email);
            expect(req.user.fullName).toBe(user.fullName);
            expect(req.user.password).toBeUndefined();
        });
    });

    test('verifyUser should send error response with authorization header missing', async () => {
        const req = {
            headers: {
            }
        }
        await middleware.verifyUser(req, res, next).then(() => {
            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.send).toHaveBeenCalledWith('You are not authorized ');
            expect(next).not.toHaveBeenCalled();
        });
    });

    test('verifyUser should send error response with authorization header invalid', async () => {
        const token = newToken(user);
        const req = {
            headers: {
                authorization: `Invalid ${token}`
            }
        }
        await middleware.verifyUser(req, res, next).then(() => {
            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.send).toHaveBeenCalledWith('You are not authorized ');
            expect(next).not.toHaveBeenCalled();
        });
    });

    test('verifyUser should send error response with invalid token', async () => {
        const req = {
            headers: {
                authorization: `Bearer invalidtoken`
            }
        }
        await middleware.verifyUser(req, res, next).then(() => {
            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.send).toHaveBeenCalledWith('Error JsonWebTokenError: jwt malformed');
            expect(next).not.toHaveBeenCalled();
        });
    });
});