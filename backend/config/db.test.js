const {connectDB} = require('./db');


describe('Database Connection', () => {
    test('should connect to the database successfully', async () => {
        await connectDB();
        // If the connection is successful, this test will pass.
    });
});