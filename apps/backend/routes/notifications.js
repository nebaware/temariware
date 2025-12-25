const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/auth');
const asyncHandler = require('../utils/asyncHandler');

// GET /api/notifications - Get user notifications
router.get('/', auth, asyncHandler(async (req, res) => {
  // Mock notifications for now - in production, fetch from database
  const notifications = [
    {
      id: 1,
      type: 'job_application',
      title: 'Job Application Update',
      message: 'Your application for Backend Developer has been reviewed',
      timestamp: new Date(),
      read: false
    },
    {
      id: 2,
      type: 'wallet',
      title: 'Payment Received',
      message: 'You received 500 ETB for completing a micro job',
      timestamp: new Date(Date.now() - 3600000),
      read: false
    },
    {
      id: 3,
      type: 'course',
      title: 'New Course Available',
      message: 'React Advanced Patterns course is now available',
      timestamp: new Date(Date.now() - 7200000),
      read: true
    }
  ];

  res.json({
    success: true,
    notifications
  });
}));

// POST /api/notifications/:id/read - Mark notification as read
router.post('/:id/read', auth, asyncHandler(async (req, res) => {
  // In production, update notification in database
  res.json({
    success: true,
    message: 'Notification marked as read'
  });
}));

module.exports = router;