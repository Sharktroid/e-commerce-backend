require('dotenv').config();
const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    await mongoose.connect(
      'mongodb+srv://calvinpanc:GuH9mOGc1KsUuOE0@cluster0.wo0ia.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0',
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      },
    );

    console.log('MongoDB connection SUCCESS')
  } catch (error) {
    console.error('MongoDB connection FAIL');
    console.error(error.message);
    process.exit(1)
  }
};

module.exports = { connectDB };
