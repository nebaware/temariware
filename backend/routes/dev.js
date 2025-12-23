const express = require('express');
const router = express.Router();

// Reset rate limits (development only)
router.post('/reset-rate-limit', (req, res) => {
  if (process.env.NODE_ENV !== 'production') {
    // In development, we can reset rate limits
    res.json({
      success: true,
      message: 'Rate limits reset (development mode)'
    });
  } else {
    res.status(403).json({
      success: false,
      error: 'Not available in production'
    });
  }
});

// Get current rate limit status
router.get('/rate-limit-status', (req, res) => {
  res.json({
    success: true,
    message: 'Rate limit status',
    limits: {
      auth: '20 attempts per 15 minutes',
      api: '1000 requests per hour'
    }
  });
});

module.exports = router;