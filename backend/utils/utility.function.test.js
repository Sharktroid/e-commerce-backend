const utility = require('./utility.function');
const bcrypt = require('bcrypt');

describe('Utility Function Tests', () => {
    test('checkPassword should return true for matching passwords', async () => {
        const password = 'password123';
        const passwordHash = await bcrypt.hash(password, 8);
        const result = await utility.checkPassword(password, passwordHash);
        expect(result).toBe(true);
    });

    test('checkPassword should return false for non-matching passwords', async () => {
        const password = 'password123';
        const wrongPassword = 'wrongpassword';
        const passwordHash = await bcrypt.hash(password, 8);
        const result = await utility.checkPassword(wrongPassword, passwordHash);
        expect(result).toBe(false);
    });

    test('newToken should return a valid JWT token', () => {
        const user = { _id: '12345' };
        const token = utility.newToken(user);
        expect(token).toBeDefined();
        expect(typeof token).toBe('string');
    });

    test('verifyToken should resolve with payload for valid token', async () => {
        const user = { _id: '12345' };
        const token = utility.newToken(user);
        const payload = await utility.verifyToken(` ${token}`.split(' ')[1]);
        expect(payload).toBeDefined();
        expect(payload.id).toBe(user._id);
    });
});