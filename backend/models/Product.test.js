const Product = require('./Product');
const {connectDB} = require('../config/db');

let product;

beforeAll(async () => {
    await connectDB();
});
afterEach(async () => {
    await product.remove();
});

describe('Product Model', () => {
    test('should create a new product', async () => {
        product = new Product({
            name: 'Product 1',
            description: 'Description of product 1',
            price: 100,
            imageUrl: 'https://example.com/image1.jpg',
            countInStock: 10,
        });

        const savedProduct = await product.save();

        expect(savedProduct._id).toBeDefined();
        expect(savedProduct.name).toBe('Product 1');
        expect(savedProduct.description).toBe('Description of product 1');
        expect(savedProduct.price).toBe(100);
        expect(savedProduct.imageUrl).toBe('https://example.com/image1.jpg');
        expect(savedProduct.countInStock).toBe(10);
    });
    test('should not create a product without name', async () => {
        product = new Product({
            description: 'Description of product 1',
            price: 100,
            imageUrl: 'https://example.com/image1.jpg',
            countInStock: 10,
        });

        let error;
        try {
            await product.save();
        } catch (err) {
            error = err;
        }
        expect(error).toBeDefined();
        expect(error.name).toBe('ValidationError');
    });
    test('should not create a product without description', async () => {
        product = new Product({
            name: 'Product 1',
            price: 100,
            imageUrl: 'https://example.com/image1.jpg',
            countInStock: 10,
        });

        let error;
        try {
            await product.save();
        } catch (err) {
            error = err;
        }
        expect(error).toBeDefined();
        expect(error.name).toBe('ValidationError');
    });
    test('should not create a product without price', async () => {
        product = new Product({
            name: 'Product 1',
            description: 'Description of product 1',
            imageUrl: 'https://example.com/image1.jpg',
            countInStock: 10,
        });

        let error;
        try {
            await product.save();
        } catch (err) {
            error = err;
        }
        expect(error).toBeDefined();
        expect(error.name).toBe('ValidationError');
    });
    test('should not create a product without imageUrl', async () => {
        product = new Product({
            name: 'Product 1',
            description: 'Description of product 1',
            price: 100,
            countInStock: 10,
        });

        let error;
        try {
            await product.save();
        } catch (err) {
            error = err;
        }
        expect(error).toBeDefined();
        expect(error.name).toBe('ValidationError');
    });
    test('should not create a product without countInStock', async () => {
        product = new Product({
            name: 'Product 1',
            description: 'Description of product 1',
            price: 100,
            imageUrl: 'https://example.com/image1.jpg',
        });

        let error;
        try {
            await product.save();
        } catch (err) {
            error = err;
        }
        expect(error).toBeDefined();
        expect(error.name).toBe('ValidationError');
    });
});