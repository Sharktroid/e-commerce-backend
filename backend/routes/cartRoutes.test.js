const cartRoutes = require('./cartRoutes');
const request = require('supertest');
const express = require('express');
const mongoose = require('mongoose');
const Cart = require('../models/Cart');
const app = express();
const { connectDB } = require('../config/db');
const User = require('../models/User');
const { newToken } = require('../utils/utility.function');
require('../models/Product');

let user;
let token;

describe('Cart Routes', () => {
    beforeAll(async () => {
        connectDB();
        app.use(express.json());
        app.use('/cart', cartRoutes);
        user = new User({
            fullName: 'Jane Smith',
            email: 'janesmith@example.com',
            password: 'password123'
        });
        await user.save();
        token = newToken(user);
    });

    afterAll(async () => {
        await user.remove();
        await mongoose.connection.close();
    });

    afterEach(async () => {
        await Cart.deleteMany({});
    });

    test('POST /cart - Add product to cart', async () => {
        const req = {
            productId: '60d5f484f1c2a8b8b8b8b8b9',
            count: "2"
        }

        const response = await request(app)
            .post('/cart')
            .set('authorization', `Bearer ${token}`)
            .send(req);

        expect(response.status).toBe(201);
        expect(response.body.status).toBe('ok');
        expect(response.body.cart.productId).toBe(req.productId);
        expect(response.body.cart.count).toBe(req.count);
    });

    test('POST /cart - Add product to cart with invalid data', async () => {
        const req = {
            productId: 'invalid',
            count: "invalid"
        }

        const response = await request(app)
            .post('/cart')
            .set('authorization', `Bearer ${token}`)
            .send(req);

        expect(response.status).toBe(500);
    });

    test('GET /cart - Get cart products', async () => {
        const req = {
            productId: '60d5f484f1c2a8b8b8b8b8b9',
            count: "2"
        }

        await request(app)
            .post('/cart')
            .set('authorization', `Bearer ${token}`)
            .send(req);

        const response = await request(app)
            .get('/cart')
            .set('authorization', `Bearer ${token}`);
        expect(response.status).toBe(200);
        expect(response.body.status).toBe('ok');
    });

    test('DELETE /cart/:id - Delete product from cart', async () => {
        const req = {
            productId: '60d5f484f1c2a8b8b8b8b8b9',
            count: "2"
        }

        const cart = await request(app)
            .post('/cart')
            .set('authorization', `Bearer ${token}`)
            .send(req);

        const response = await request(app)
            .delete(`/cart/${cart.body.cart._id}`)
            .set('authorization', `Bearer ${token}`);

        expect(response.status).toBe(200);
        expect(response.body.status).toBe('ok');
        expect(Cart.findById(cart.body.cart._id)).resolves.toBeNull();
    });
});
