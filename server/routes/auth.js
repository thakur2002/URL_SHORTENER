// server/routes/auth.js
const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const router = express.Router();
const crypto = require('crypto'); // For generating the reset token
const nodemailer = require('nodemailer'); // For sending emails
require('dotenv').config({path:'../.env'});


// Signup route
router.post('/signup', async (req, res) => {
  const { username, password } = req.body;
  
  try {
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ error: 'Username already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ username, password: hashedPassword });
    await newUser.save();
    res.status(201).json({ message: 'User created successfully. Login now' });
  } catch (e) {
    res.status(500).json({ error:e.message });
  }
});


// Login route
router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(401).json({ error: 'Invalid username or password' });
    }
    
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid username or password' });
    }

    const token = jwt.sign({ username: user.username}, process.env.Secret);
    res.cookie('token', token, {
      httpOnly: true,       // Prevent JavaScript access to the cookie
      secure: process.env.NODE_ENV === 'production',        
      sameSite: 'Strict',   // Prevent CSRF
      maxAge: 3600000       // 1 hour expiration
    });
    res.status(201).json({ message: 'Login successful' });

  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

router.post('/reset-password-request', async (req, res) => {
  const { email,username } = req.body;

  try {
    const user = await User.findOne( { username: username } );

    if (!user) {
      return res.status(400).json({ error: 'No account with that username ' });
    }

    const resetToken = crypto.randomBytes(20).toString('hex');
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = Date.now() + 3600000; // 1 hour expiration
    await user.save();

    const resetUrl = `https://shortenmyurl-g90m.onrender.com/reset-password/${resetToken}`;
    const transporter = nodemailer.createTransport({
      service: 'Gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      to: email,
      from: process.env.EMAIL_USER,
      subject: 'Password Reset',
      text: `You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n` +
        `Please click on the following link, or paste this into your browser to complete the process:\n\n` +
        `${resetUrl}\n\n` +
        `If you did not request this, please ignore this email and your password will remain unchanged.\n`,
    };

    transporter.sendMail(mailOptions, (err, info) => {
      if (err) {
        console.error('Error sending email:', err);
        return res.status(500).json({ error: 'Error sending email' });
      }
      res.status(200).json({ message: 'Password reset email sent.' });
    });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// Reset Password
router.post('/reset-password/:token', async (req, res) => {
  try {
    const user = await User.findOne({    
      resetPasswordToken: req.params.token,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ error: 'Password reset token is invalid or has expired. Request reset again' });
    }

    const { password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    user.password = hashedPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    res.status(200).json({ message: 'Password has been reset successfully.' });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

module.exports = router;
