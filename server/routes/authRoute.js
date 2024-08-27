const express = require('express');
const { body } = require('express-validator');
const router = express.Router();

// Import Controllers
const {
  registeringUser,
  loginController
} = require('../controllers/authController');

// Validation rules for registering a user
const registerValidationRules = [
  body('username')
    .notEmpty()
    .withMessage('Username is required')
    .isLength({ min: 5 })
    .withMessage('Username must be at least 5 characters long'),
  body('email')
    .isEmail()
    .withMessage('Invalid email format')
    .notEmpty()
    .withMessage('Email is required'),
  body('password')
    .notEmpty()
    .withMessage('Password is required')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long'),
  body('role')
    .isInt({ min: 0, max: 1 })
    .withMessage('Role must be an integer 0 or 1')
];

// Validation rules for logging in
const loginValidationRules = [
  body('email')
    .isEmail()
    .withMessage('Invalid email format')
    .notEmpty()
    .withMessage('Email is required'),
  body('password').notEmpty().withMessage('Password is required')
];

// Route to register a new user
router.post('/register', registerValidationRules, registeringUser);

// Route to log in a user
router.post('/login', loginValidationRules, loginController);

module.exports = router;
