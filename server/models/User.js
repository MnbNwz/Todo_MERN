const mongoose = require('mongoose');
const uuid = require('uuid');
const crypto = require('crypto');

//schema
const userSchema = new mongoose.Schema(
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
    salt: String
  },
  { timestamps: true }
);

//virtual field
userSchema.virtual('password').set(function (password) {
  this._password = password;
  this.salt = uuid.v4();
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
module.exports = mongoose.model('User', userSchema);
