const Cart = require('./Cart');
const { connectDB } = require('../config/db');
const Product = require('./Product');
const User = require('./User');


let user;
let product;
let cart;

beforeAll(async () => {
    await connectDB();
    product = new Product({
        name: 'Product 1',
        description: 'Description of product 1',
        price: 100,
        imageUrl: 'https://example.com/image1.jpg',
        countInStock: 10,
    });
    await product.save();
    user = new User({
        fullName: 'John Doe',
        email: 'jdoe@example.com',
        password: 'password123'
    });
    await user.save();
});

afterEach(async () => {
    await cart.remove();
});

afterAll(async () => {
    await product.remove();
    await user.remove();
});

describe('Cart Model', () => {
    test('should create a new cart', async () => {
        cart = new Cart({
            userId: user._id,
            productId: product._id,
            count: 2,
        });

        const savedCart = await cart.save();

        expect(savedCart._id).toBeDefined();
        expect(savedCart.userId.toString()).toBe(user._id.toString());
        expect(savedCart.productId.toString()).toBe(product._id.toString());
        expect(savedCart.count).toBe("2");
    });

    test('should not create a cart without userId', async () => {
        cart = new Cart({
            productId: product._id,
            count: 2,
        });

        let error;
        try {
            await cart.save();
        } catch (err) {
            error = err;
        }

        expect(error).toBeDefined();
        expect(error.name).toBe('ValidationError');
    });

    test('should not create a cart without productId', async () => {
        cart = new Cart({
            userId: user._id,
            count: 2,
        });
        let error;
        try {
            await cart.save();
        } catch (err) {
            error = err;
        }
        expect(error).toBeDefined();
        expect(error.name).toBe('ValidationError');
    });

    test('should not create a cart without count', async () => {
        const cart = new Cart({
            userId: user._id,
            productId: product._id,
        });
        let error;
        try {
            await cart.save();
        } catch (err) {
            error = err;
        }
        expect(error).toBeDefined();
        expect(error.name).toBe('ValidationError');
    });
});