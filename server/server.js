// imports
import express from 'express';
import connectDB from './config/db.js';
import cors from 'cors';
import morgan from 'morgan';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import { json, urlencoded } from 'express';
import { seedAdminUser } from './models/SeedingData.js';
import routes from './routes/index.js';
import helmet from 'helmet';

// Initialize dotenv
dotenv.config();

// app
const app = express();

// Connect to database
connectDB();

// Seeding User
// seedAdminUser();

// middleware
app.use(morgan('dev'));
app.use(cors({ origin: true, credentials: true }));
app.use(json());
app.use(urlencoded({ extended: false }));
app.use(cookieParser());
app.use(helmet());

// routes
app.use('/', routes);
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something went wrong!');
});

// port
const port = process.env.PORT || 8080;

// listener
app.listen(port, () => console.log(`Server is running on port ${port}`));
