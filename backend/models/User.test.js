const User = require('../models/User');
const { connectDB } = require('../config/db');

let user;

const email = 'usermodel@test.com'

beforeAll(async () => {
    await connectDB();
});

afterEach(async () => {
    await user.remove();
});

describe('User Model', () => {
    test('should create a new user', async () => {
        user = new User({
            fullName: 'John Doe',
            email: email,
            password: 'password123'
        });
        const savedUser = await user.save();
        expect(savedUser._id).toBeDefined();
        expect(savedUser.fullName).toBe(user.fullName);
        expect(savedUser.email).toBe(user.email);
        expect(savedUser.password).toBe(user.password);
    });

    test('should not create a user without email', async () => {
        user = new User({
            fullName: 'John Doe',
            password: 'password123'
        });
        let error;
        try {
            await user.save();
        } catch (err) {
            error = err;
        }
        expect(error).toBeDefined();
        expect(error.name).toBe('ValidationError');
    });
    test('should not create a user without password', async () => {
        user = new User({
            fullName: 'John Doe',
            email: email
        });
        let error;
        try {
            await user.save();
        } catch (err) {
            error = err;
        }
        expect(error).toBeDefined();
        expect(error.name).toBe('ValidationError');
    });

    test('should not create a user with duplicate email', async () => {
        user = new User({
            fullName: 'John Doe',
            email: email,
            password: 'password123'
        });
        await user.save();
        const duplicateUser = new User({
            fullName: 'Jane Doe',
            email: email,
            password: 'password456'
        });
        let error;
        try {
            await duplicateUser.save();
        } catch (err) {
            error = err;
        }
        expect(error).toBeDefined();
        expect(error.name).toBe('MongoError');
    });
});