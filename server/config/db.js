// backend/config/db.js

const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();
const DB = process.env.MONGO_URI;

let connection = null; // Variable to hold the singleton connection

const connectDB = async () => {
  if (connection) {
    console.log('MongoDB is already connected.');
    return connection; // Return the existing connection
  }

  try {
    connection = await mongoose.connect(DB, {});
    console.log(`MongoDB Connected: ${connection.connection.host}`);
    return connection; // Return the new connection
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
