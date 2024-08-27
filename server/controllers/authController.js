const User = require('../models/UserModel');
const { validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const roles = require('../models/roles');

const JWT_SECRET = process.env.JWT_SECRET_KEY;

//register user controller
const registeringUser = async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { username, email, role } = req.body;

  const usernameExists = await User.findOne({ username });
  debugger;
  const emailExists = await User.findOne({ email });
  debugger;
  if (usernameExists || emailExists) {
    return res.status(403).json({
      error: `${usernameExists ? 'Username' : 'Email'} already exists`
    });
  }
  const numericRole = parseInt(role, 10);

  if (![0, 1].includes(numericRole)) {
    return res.status(400).json({ error: 'Invalid role' });
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
    .json({ message: 'SignUp successfull! Please proceed', useData });
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
    const parsedRole = parseInt(role, 10);

    if (user.role !== parsedRole) {
      return res.status(403).json({ message: 'Invalid role' });
    }
    const token = jwt.sign(
      { id: user._id, email: user.email, role: user.role },
      JWT_SECRET,
      {
        expiresIn: '10d'
      }
    );

    // Fetch user-specific data based on role
    let data = {
      message: `This is protected ${user.role === 0 ? `Admin` : `User`} data`,
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
module.exports = { registeringUser, loginController };
