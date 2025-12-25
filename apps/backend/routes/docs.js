const express = require('express');
const router = express.Router();

// API Documentation
router.get('/', (req, res) => {
  res.json({
    name: 'TemariWare API',
    version: '1.0.0',
    description: 'Complete Student Ecosystem Platform API',
    baseUrl: req.protocol + '://' + req.get('host'),
    endpoints: {
      authentication: {
        'POST /api/auth/register': 'Register new user',
        'POST /api/auth/login': 'User login',
        'POST /api/auth/change-password': 'Change password'
      },
      users: {
        'GET /api/users/me': 'Get current user profile',
        'GET /api/users/discover': 'Discover other users',
        'PUT /api/users/:id': 'Update user profile',
        'POST /api/users/change-password': 'Change user password'
      },
      jobs: {
        'GET /api/jobs': 'List all jobs',
        'POST /api/jobs': 'Create new job',
        'GET /api/jobs/:id': 'Get job by ID',
        'POST /api/jobs/:id/apply': 'Apply to job'
      },
      courses: {
        'GET /api/courses': 'List all courses',
        'POST /api/courses': 'Create new course',
        'POST /api/courses/:id/enroll': 'Enroll in course'
      },
      wallet: {
        'GET /api/wallet/balance': 'Get wallet balance',
        'GET /api/wallet/transactions': 'Get transaction history',
        'POST /api/wallet/send': 'Send money'
      },
      notifications: {
        'GET /api/notifications': 'Get user notifications',
        'POST /api/notifications/:id/read': 'Mark notification as read'
      }
    },
    status: {
      server: 'online',
      database: 'connected',
      timestamp: new Date().toISOString()
    }
  });
});

// Health check with detailed info
router.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    uptime: process.uptime(),
    memory: process.memoryUsage(),
    timestamp: new Date().toISOString(),
    version: process.version,
    environment: process.env.NODE_ENV || 'development'
  });
});

module.exports = router;