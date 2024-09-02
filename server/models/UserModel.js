import mongoose from 'mongoose';
import { v4 as uuidv4 } from 'uuid';
import crypto from 'crypto';
import roles from './roles.js'; // Ensure the correct path and file extension

const { Schema } = mongoose;

// Schema definition
const userSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true
    },
    hashedPassword: {
      type: String,
      required: true
    },
    role: {
      type: Number,
      default: roles.USER
    },
    salt: String
  },
  { timestamps: true }
);

// Virtual field
userSchema.virtual('password').set(function (password) {
  this._password = password;
  this.salt = uuidv4();
  this.hashedPassword = this.encryptPassword(password);
});

userSchema.methods = {
  encryptPassword: function (password) {
    if (!password) return '';
    try {
      return crypto
        .createHmac('sha256', this.salt)
        .update(password)
        .digest('hex');
    } catch (err) {
      console.error('Error encrypting password:', err);
      return '';
    }
  },
  authenticate: function (plainText) {
    return this.encryptPassword(plainText) === this.hashedPassword;
  }
};

const User = mongoose.model('User', userSchema);

export default User;
