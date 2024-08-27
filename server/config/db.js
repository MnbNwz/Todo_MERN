// backend/config/db.js

const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();
const DB = process.env.MONGO_URI;
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(`${DB}`, {});

    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1); // Exit process with failure
  }
};

// Handling graceful shutdown
process.on('SIGINT', async () => {
  await mongoose.connection.close();
  console.log('MongoDB connection closed due to app termination');
  process.exit(0);
});

module.exports = connectDB;
