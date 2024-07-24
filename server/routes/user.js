const express = require('express');
const router = express.Router();

//import Routes
const { registeringUser } = require('../controllers/userController');

router.post('/register', registeringUser);

module.exports = router;
