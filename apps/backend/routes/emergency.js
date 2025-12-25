const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const router = express.Router();

// Emergency registration - bypasses complex model
router.post('/emergency-register', async (req, res) => {
  try {
    const { name, email, password, university } = req.body;
    
    console.log('Emergency registration attempt:', { name, email, university });
    
    if (!name || !email || !password || !university) {
      return res.status(400).json({
        success: false,
        error: 'All fields required'
      });
    }
    
    // Hash password manually
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    
    // Direct database insert
    const { sequelize } = require('../config/db');
    
    const [results] = await sequelize.query(`
      INSERT INTO "Users" (name, email, password, university, role, "isVerified", "walletBalance", xp, level, "createdAt", "updatedAt")
      VALUES (?, ?, ?, ?, 'STUDENT', false, 0, 0, 1, NOW(), NOW())
      RETURNING id, name, email, university, role, "isVerified"
    `, {
      replacements: [name.trim(), email.toLowerCase().trim(), hashedPassword, university.trim()]
    });
    
    const user = results[0];
    
    // Generate token
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );
    
    res.status(201).json({
      success: true,
      message: 'Registration successful (emergency mode)',
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
    console.error('Emergency registration error:', error);
    
    if (error.message.includes('duplicate key') || error.message.includes('unique constraint')) {
      return res.status(409).json({
        success: false,
        error: 'Email already registered'
      });
    }
    
    res.status(500).json({
      success: false,
      error: 'Emergency registration failed',
      details: error.message
    });
  }
});

module.exports = router;