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

  console.log('Registration attempt:', { name, email, university });

  // Validation
  if (!name || !email || !password || !university) {
    return res.status(400).json({
      success: false,
      error: 'Name, email, password, and university are required'
    });
  }

  if (password.length < 6) {
    return res.status(400).json({
      success: false,
      error: 'Password must be at least 6 characters'
    });
  }

  try {
    // Check if user exists
    const existingUser = await User.findOne({ where: { email: email.toLowerCase() } });
    if (existingUser) {
      return res.status(409).json({
        success: false,
        error: 'Email already registered'
      });
    }

    // Create user
    const user = await User.create({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password: password,
      university: university.trim(),
      role: 'STUDENT',
      isVerified: false,
      walletBalance: 0
    });

    console.log('User created successfully:', user.id);

    const token = signToken(user);

    return res.status(201).json({
      success: true,
      message: 'Registration successful',
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
    console.error('Registration error details:', {
      message: error.message,
      stack: error.stack,
      name: error.name
    });
    
    // Handle specific database errors
    if (error.name === 'SequelizeValidationError') {
      return res.status(400).json({
        success: false,
        error: 'Validation failed',
        details: error.errors.map(e => e.message)
      });
    }
    
    if (error.name === 'SequelizeUniqueConstraintError') {
      return res.status(409).json({
        success: false,
        error: 'Email already registered'
      });
    }
    
    return res.status(500).json({
      success: false,
      error: 'Registration failed - server error',
      details: process.env.NODE_ENV === 'development' ? error.message : 'Please try again'
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