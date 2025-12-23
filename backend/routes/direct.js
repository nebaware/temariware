const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();

// Direct working login - bypasses database
router.post('/direct-login', (req, res) => {
  const { email, password } = req.body;
  
  // Valid test credentials
  const validCredentials = [
    { email: 'demo@temariware.com', password: 'demo123', name: 'Demo User' },
    { email: 'test@student.com', password: 'test123', name: 'Test Student' },
    { email: 'admin@temariware.com', password: 'admin123', name: 'Admin User' }
  ];
  
  const user = validCredentials.find(u => 
    u.email === email.toLowerCase() && u.password === password
  );
  
  if (!user) {
    return res.status(401).json({
      success: false,
      error: 'Invalid credentials',
      validCredentials: validCredentials.map(u => ({ email: u.email, password: u.password }))
    });
  }
  
  // Generate token
  const token = jwt.sign(
    { id: 1, email: user.email, role: 'STUDENT' },
    process.env.JWT_SECRET || 'fallback-secret',
    { expiresIn: '1d' }
  );
  
  res.json({
    success: true,
    message: 'Login successful',
    user: {
      id: 1,
      name: user.name,
      email: user.email,
      university: 'TemariWare University',
      role: 'STUDENT',
      isVerified: true
    },
    token
  });
});

// Show valid credentials
router.get('/credentials', (req, res) => {
  res.json({
    success: true,
    message: 'Valid login credentials',
    credentials: [
      { email: 'demo@temariware.com', password: 'demo123' },
      { email: 'test@student.com', password: 'test123' },
      { email: 'admin@temariware.com', password: 'admin123' }
    ],
    loginEndpoint: '/api/direct/direct-login'
  });
});

module.exports = router;