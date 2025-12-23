const express = require('express');
const bcrypt = require('bcryptjs');
const router = express.Router();

// Create test user and show credentials
router.post('/create-test-user', async (req, res) => {
  try {
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
    
    const testEmail = 'demo@temariware.com';
    const testPassword = 'demo123';
    
    // Check if test user exists
    const [existing] = await sequelize.query(
      'SELECT id FROM simple_users WHERE email = ?',
      { replacements: [testEmail] }
    );
    
    if (existing.length === 0) {
      // Create test user
      const hashedPassword = await bcrypt.hash(testPassword, 10);
      
      await sequelize.query(`
        INSERT INTO simple_users (name, email, password, university)
        VALUES (?, ?, ?, ?)
      `, {
        replacements: ['Demo User', testEmail, hashedPassword, 'TemariWare University']
      });
    }
    
    res.json({
      success: true,
      message: 'Test user created/verified',
      credentials: {
        email: testEmail,
        password: testPassword
      },
      loginUrl: '/api/simple/simple-login'
    });
    
  } catch (error) {
    console.error('Create test user error:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// List all users (for debugging)
router.get('/list-users', async (req, res) => {
  try {
    const { sequelize } = require('../config/db');
    
    const [users] = await sequelize.query(
      'SELECT id, name, email, university, created_at FROM simple_users ORDER BY id'
    );
    
    res.json({
      success: true,
      users: users,
      count: users.length
    });
    
  } catch (error) {
    res.json({
      success: false,
      error: error.message,
      note: 'Table might not exist yet'
    });
  }
});

module.exports = router;