const User = require('../models/User');

const registeringUser = async (req, res) => {
  const usernameExists = await User.findOne({ username: req.body.username });
  const emailExists = await User.findOne({ email: req.body.email });
  if (usernameExists) {
    return res.status(403).json({ error: 'Username already exists' });
  }
  if (emailExists) {
    return res.status(403).json({ error: 'Email already exists' });
  }

  //if new user
  const user = new User(req.body);
  await user.save();
  res.status(201).json({ message: 'SignUp successfull! Please proceed', user });
};

module.exports = { registeringUser };
