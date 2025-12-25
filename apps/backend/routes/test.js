const express = require('express');
const router = express.Router();

// Test registration endpoint
router.post('/test-register', async (req, res) => {
  try {
    console.log('Test registration request body:', req.body);
    console.log('Headers:', req.headers);
    
    // Test database connection
    const { sequelize } = require('../config/db');
    await sequelize.authenticate();
    console.log('Database connection: OK');
    
    // Test User model
    const User = require('../models/User');
    console.log('User model loaded: OK');
    
    // Test basic validation
    const { name, email, password, university } = req.body;
    if (!name || !email || !password || !university) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields',
        received: { name: !!name, email: !!email, password: !!password, university: !!university }
      });
    }
    
    res.json({
      success: true,
      message: 'Test registration endpoint working',
      data: {
        name,
        email,
        university,
        passwordLength: password.length
      },
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('Test registration error:', error);
    res.status(500).json({
      success: false,
      error: 'Test failed',
      details: error.message
    });
  }
});

module.exports = router;