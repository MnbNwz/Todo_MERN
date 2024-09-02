import User from '../models/UserModel.js'; // Ensure the correct path and file extension
import { validationResult } from 'express-validator';
import jwt from 'jsonwebtoken';
import roles from '../models/roles.js'; // Ensure the correct path and file extension

const JWT_SECRET = process.env.JWT_SECRET_KEY;

// Register user controller
const registeringUser = async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { username, email, role } = req.body;

  const usernameExists = await User.findOne({ username });
  const emailExists = await User.findOne({ email });

  if (usernameExists || emailExists) {
    return res.status(403).json({
      error: `${usernameExists ? 'Username' : 'Email'} already exists`
    });
  }

  const user = new User(req.body);

  const useData = {
    email,
    username,
    role,
    id: user._id
  };

  await user.save();
  res
    .status(201)
    .json({ message: 'SignUp successful! Please proceed', useData });
};

// Login Controller
const loginController = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password, role } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    if (!user.authenticate(password)) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    const token = jwt.sign(
      { id: user._id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: '10d' }
    );

    // Fetch user-specific data based on role
    const data = {
      message: `This is protected ${
        user.role === roles.ADMIN ? 'Admin' : 'User'
      } data`,
      token
    };

    res.json({
      user: {
        id: user._id,
        email: user.email,
        username: user.username,
        role: user.role
      },
      data
    });
  } catch (err) {
    console.error('Error logging in user:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

export { registeringUser, loginController };
