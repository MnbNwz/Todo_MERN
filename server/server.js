// imports
const express = require('express');
const connectDB = require('./config/db');
const cors = require('cors');
const morgan = require('morgan');
require('dotenv').config();
const cookieParser = require('cookie-parser');
const { json, urlencoded } = express;
const seedAdminUser = require('./models/SeedingData');
const routes = require('./routes/index');
const helmet = require('helmet');

// app

const app = express();
//db
connectDB();

// Seeding User
// seedAdminUser();

//middleware
app.use(morgan('dev'));
app.use(cors({ origin: true, credentials: true }));
app.use(json());
app.use(urlencoded({ extended: false }));
app.use(cookieParser());
app.use(helmet());

//routes
app.use('/', routes);
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something went wrong!');
});

//port
const port = process.env.PORT || 8080;

//listener
app.listen(port, () => console.log(`Server is running on port ${port}`));
