const express = require('express');
const router = express.Router();

const userRoute = require('./authRoute');
const taskRoute = require('./tasksRoute');

router.use('/user', userRoute);
router.use('/task', taskRoute);

module.exports = router;
