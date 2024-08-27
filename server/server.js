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

// app

const app = express();
//db
connectDB();
seedAdminUser();
//middleware
app.use(morgan('dev'));
app.use(cors({ origin: true, credentials: true }));
app.use(json());
app.use(urlencoded({ extended: false }));
app.use(cookieParser());

//routes
app.use('/', routes);

//port
const port = process.env.PORT || 8080;

//listener
const server = app.listen(port, () =>
  console.log(`Server is running on port ${port}`)
);
