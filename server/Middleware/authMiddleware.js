import jwt from 'jsonwebtoken';
import UserModel from '../models/UserModel.js'; // Ensure the correct path and file extension

const authenticateToken = async (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1]; // Assuming Bearer token

  if (!token) {
    return res.status(401).json({ message: 'Token required' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    const user = await UserModel.findById(decoded.id);
    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }

    req.user = user; // Add user info to request

    next();
  } catch (err) {
    return res.status(403).json({ message: 'Invalid or expired token' });
  }
};

export default authenticateToken;
