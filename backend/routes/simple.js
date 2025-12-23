const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const router = express.Router();

// Simple working registration
router.post('/simple-register', async (req, res) => {
  try {
    const { name, email, password, university } = req.body;
    
    if (!name || !email || !password || !university) {
      return res.status(400).json({
        success: false,
        error: 'All fields required'
      });
    }
    
    const { sequelize } = require('../config/db');
    
    // Create table if not exists
    await sequelize.query(`
      CREATE TABLE IF NOT EXISTS simple_users (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        university VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT NOW()
      )
    `);
    
    // Check if user exists
    const [existing] = await sequelize.query(
      'SELECT id FROM simple_users WHERE email = ?',
      { replacements: [email.toLowerCase()] }
    );
    
    if (existing.length > 0) {
      return res.status(409).json({
        success: false,
        error: 'Email already registered'
      });
    }
    
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Insert user
    const [result] = await sequelize.query(`
      INSERT INTO simple_users (name, email, password, university)
      VALUES (?, ?, ?, ?)
      RETURNING id, name, email, university
    `, {
      replacements: [name, email.toLowerCase(), hashedPassword, university]
    });
    
    const user = result[0];
    
    // Generate token
    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET || 'fallback-secret',
      { expiresIn: '1d' }
    );
    
    res.status(201).json({
      success: true,
      message: 'Registration successful',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        university: user.university
      },
      token
    });
    
  } catch (error) {
    console.error('Simple registration error:', error);
    res.status(500).json({
      success: false,
      error: 'Registration failed',
      details: error.message
    });
  }
});

// Simple login
router.post('/simple-login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        error: 'Email and password required'
      });
    }
    
    const { sequelize } = require('../config/db');
    
    // Get user
    const [users] = await sequelize.query(
      'SELECT * FROM simple_users WHERE email = ?',
      { replacements: [email.toLowerCase()] }
    );
    
    if (users.length === 0) {
      return res.status(401).json({
        success: false,
        error: 'Invalid credentials'
      });
    }
    
    const user = users[0];
    
    // Check password
    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      return res.status(401).json({
        success: false,
        error: 'Invalid credentials'
      });
    }
    
    // Generate token
    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET || 'fallback-secret',
      { expiresIn: '1d' }
    );
    
    res.json({
      success: true,
      message: 'Login successful',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        university: user.university
      },
      token
    });
    
  } catch (error) {
    console.error('Simple login error:', error);
    res.status(500).json({
      success: false,
      error: 'Login failed',
      details: error.message
    });
  }
});

module.exports = router;