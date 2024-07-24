const express = require('express');
const router = express.Router();

const userRoute = require('../routes/user');

router.use('/user', userRoute);

module.exports = router;
