import express from 'express';
import {
  registeringUser,
  loginController
} from '../controllers/authController.js';
import {
  loginValidationRules,
  registerValidationRules
} from '../Utils/ExpressValidatios.js';

const router = express.Router();

// Route to register a new user
router.post('/register', registerValidationRules, registeringUser);

// Route to log in a user
router.post('/login', loginValidationRules, loginController);

export default router;
