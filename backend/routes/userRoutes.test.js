const request = require('supertest');
const express = require('express');
const mongoose = require('mongoose');
const app = express();
const { connectDB } = require('../config/db');
const User = require('../models/User');
const { newToken } = require('../utils/utility.function');
const userRoutes = require('./userRoutes');

describe('User Routes', () => {
    beforeAll(async () => {
        connectDB();
        app.use(express.json());
        app.use('/user', userRoutes);
        await User.deleteMany({});
    });

    afterAll(async () => {
        await User.deleteMany({});
        await mongoose.connection.close();
    });

    afterEach(async () => {
        //  User.deleteMany({});
    });

    test('POST /user/signup - User signup', async () => {
        const req = {
            fullName: 'John Doe',
            email: 'jdoe@example.com',
            password: 'password123'
        };

        const response = await request(app)
            .post('/user/signup')
            .send(req);
        expect(response.status).toBe(201);
        expect(response.text).toBe('Successfully account opened ');
    });

    test('POST /user/signin - User signin', async () => {
        const req = {
            email: 'jdoe@example.com',
            password: 'password123'
        };

        await request(app)
            .post('/user/signup')
            .send(req);

        const response = await request(app)
            .post('/user/signin')
            .send(req);
        expect(response.status).toBe(200);
        expect(response.body.status).toBe('ok');
        expect(response.body.token).toBeDefined();
    });


    test('POST /user/signin - User signin with invalid password', async () => {
        const correctReq = {
            email: 'jdoe@example.com',
            password: 'password123'
        };

        await request(app)
            .post('/user/signup')
            .send(correctReq);

        const incorrectReq = { ...correctReq, password: 'wrongpassword' };

        const response = await request(app)
            .post('/user/signin')
            .send(incorrectReq);

        expect(response.status).toBe(400);
        expect(response.text).toEqual('InValid password !');
    });

    test('POST /user/signin - User signin with unregistered email', async () => {
        const correctReq = {
            email: 'jdoe@example.com',
            password: 'password123'
        };

        await request(app)
            .post('/user/signup')
            .send(correctReq);

        const incorrectReq = {
            email: 'other@email.com',
            password: 'password123'
        };

        const response = await request(app)
            .post('/user/signin')
            .send(incorrectReq);

        expect(response.status).toBe(400);
        expect(response.text).toEqual('You have to Sign up first !');
    });

    test('GET /me - Get user info', async () => {
        const req = {
            user: {
                email: 'jdoe@example.com',
                password: 'password123'
            }
        };

        await request(app)
            .post('/user/signup')
            .send(req);

        const response = await request(app)
            .get('/user/me')
            .set('authorization', `Bearer ${newToken(req)}`)
            .send(req);

        expect(response.status).toBe(200);
        expect(response.body.email).toBe(req.email);
        expect(response.body.fullName).toBe(req.fullName);
    });

    test('GET /me - Do not get user info without token', async () => {
        const response = await request(app)
            .get('/user/me');

        expect(response.status).toBe(400);
        expect(response.text).toEqual('You are not authorized ');
    });
});