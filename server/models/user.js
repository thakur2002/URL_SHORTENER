// server/models/User.js
const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  resetPasswordToken: { type: String, default:undefined},
  resetPasswordExpires: { type: Date, default:undefined},
});

module.exports = mongoose.model('urluser', UserSchema);
