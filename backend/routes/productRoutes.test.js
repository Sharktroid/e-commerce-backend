const request = require('supertest');
const express = require('express');
const mongoose = require('mongoose');
const app = express();
const { connectDB } = require('../config/db');
const User = require('../models/User');
const { newToken } = require('../utils/utility.function');
const productRoutes = require('./productRoutes');
const Product = require('../models/Product');

let user;
let token;

describe('Product Routes', () => {
    beforeAll(async () => {
        connectDB();
        app.use(express.json());
        app.use('/product', productRoutes);
        user = new User({
    fullName: 'Alice Johnson',
    email: 'alicejohnson@example.com',
    password: 'password123'
});
        await user.save();
        token = newToken(user);
    });

    afterAll(async () => {
        await user.remove();
        await mongoose.connection.close();
    });

    test('GET /product - Get all products', async () => {
        const product = new Product({
            name: 'Test Product',
            price: 100,
            description: 'Test Description',
            imageUrl: 'http://example.com/image.jpg',
            countInStock: 10,
        });
        await product.save();
        const response = await request(app)
            .get('/product')
            .set('authorization', `Bearer ${token}`);
        expect(response.status).toBe(200);
        expect(response.body[0].name).toBe(product.name);
        expect(response.body[0].price).toBe(product.price);
        expect(response.body[0].description).toBe(product.description);
        expect(response.body[0].imageUrl).toBe(product.imageUrl);
        expect(response.body[0].countInStock).toBe(product.countInStock);
        product.remove();
    });

    test('GET /product/:id - Get product by ID', async () => {
        const product = new Product({
            name: 'Test Product',
            price: 100,
            description: 'Test Description',
            imageUrl: 'http://example.com/image.jpg',
            countInStock: 10,
        });
        await product.save();
        const response = await request(app)
            .get(`/product/${product._id}`)
            .set('authorization', `Bearer ${token}`);
        expect(response.status).toBe(200);
        expect(response.body.name).toBe(product.name);
        expect(response.body.price).toBe(product.price);
        expect(response.body.description).toBe(product.description);
        expect(response.body.imageUrl).toBe(product.imageUrl);
        expect(response.body.countInStock).toBe(product.countInStock);
        product.remove();
    });
});