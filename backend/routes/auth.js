const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const asyncHandler = require('../utils/asyncHandler');

const router = express.Router();

// Generate JWT
const signToken = (user) => {
  return jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: '1d' }
  );
};

// Register
router.post('/register', asyncHandler(async (req, res) => {
  const { name, email, password, university } = req.body;

  console.log('Registration attempt:', { name, email, university }); // Add logging

  if (!name || !email || !password || !university) {
    return res.status(400).json({
      success: false,
      error: 'Name, email, password, and university are required'
    });
  }

  try {
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(409).json({
        success: false,
        error: 'Email already registered'
      });
    }

    const user = await User.create({
      name,
      email: email.toLowerCase(),
      password,
      university
    });

    console.log('User created:', user.id); // Log successful creation

    const token = signToken(user);

    return res.status(201).json({
      success: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        university: user.university,
        role: user.role,
        isVerified: user.isVerified
      },
      token
    });
  } catch (error) {
    console.error('Registration error:', error); // Log any errors
    return res.status(500).json({
      success: false,
      error: 'Registration failed',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
}));

// Login
router.post('/login', asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      success: false,
      error: 'Email and password are required'
    });
  }

  console.log(`DEBUG: Login attempt for email: [${email}]`);
  const user = await User.findOne({ where: { email: email.toLowerCase() } });

  if (!user) {
    console.log(`DEBUG: User not found for email: [${email}]`);
    return res.status(401).json({
      success: false,
      error: 'Invalid credentials'
    });
  }

  console.log(`DEBUG: User found: [${user.email}], password in DB length: ${user.password.length}`);
  console.log(`DEBUG: Incoming password length: ${password.length}`);

  const isMatch = await user.comparePassword(password);
  console.log('Password match result:', isMatch);

  if (!isMatch) {
    return res.status(401).json({
      success: false,
      error: 'Invalid credentials'
    });
  }

  const token = signToken(user);

  res.json({
    success: true,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      university: user.university,
      role: user.role,
      isVerified: user.isVerified
    },
    token
  });
}));

// Change Password
router.post('/change-password', asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({
      success: false,
      error: 'No token provided'
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findByPk(decoded.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }

    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) {
      return res.status(400).json({
        success: false,
        error: 'Current password is incorrect'
      });
    }

    // Hash new password
    const bcrypt = require('bcryptjs');
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    await user.update({ password: hashedPassword });

    res.json({
      success: true,
      message: 'Password changed successfully'
    });
  } catch (error) {
    console.error('Change password error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to change password'
    });
  }
}));

module.exports = router;