```javascript
const express = require('express');
const router = express.Router();
const asyncHandler = require('../utils/asyncHandler');
const { User } = require('../models');
const multer = require('multer');
const { auth } = require('../middleware/auth');
const requireAdmin = require('../middleware/requireAdmin');

// GET /api/users/me - Get current user profile
router.get('/me', auth, asyncHandler(async (req, res) => {
  const user = await User.findByPk(req.user.id, {
    attributes: { exclude: ['password'] }
  });
  if (!user) return res.status(404).json({ error: 'User not found' });
  res.json(user);
}));

// GET /api/users - List all users (Admin only)
router.get('/', auth, requireAdmin, asyncHandler(async (req, res) => {
  const users = await User.findAll({
    attributes: { exclude: ['password'] },
    order: [['createdAt', 'DESC']]
  });
  res.json(users);
}));

// GET /api/users/discover - List users for discovery
router.get('/discover', auth, asyncHandler(async (req, res) => {
  // Return users excluding self
  const users = await User.findAll({
    where: {
      id: { [require('sequelize').Op.ne]: req.user.id }
    },
    attributes: ['id', 'name', 'email', 'university', 'role', 'isVerified', 'bio', 'skills', 'level', 'xp'],
    limit: 20
  });
  res.json(users);
}));

// PUT /api/users/:id - Update user (Self or Admin)
router.put('/:id', auth, asyncHandler(async (req, res) => {
  if (req.user.role !== 'Admin' && req.user.id != req.params.id) {
    return res.status(403).json({ error: 'Not authorized' });
  }

  const user = await User.findByPk(req.params.id);
  if (!user) return res.status(404).json({ error: 'User not found' });

  const allowedFields = ['name', 'university', 'bio', 'skills', 'walletBalance', 'xp', 'level'];
  allowedFields.forEach(field => {
    if (req.body[field] !== undefined) user[field] = req.body[field];
  });

  // Only Admin can change role or ban status
  if (req.user.role === 'Admin') {
    if (req.body.role) user.role = req.body.role;
    if (req.body.isVerified !== undefined) user.isVerified = req.body.isVerified;
    if (req.body.isBanned !== undefined) user.isBanned = req.body.isBanned;
  }

  await user.save();
  res.json(user);
}));

// POST /api/users/:id/ban - Ban user (Admin only)
router.post('/:id/ban', auth, requireAdmin, asyncHandler(async (req, res) => {
  const user = await User.findByPk(req.params.id);
  if (!user) return res.status(404).json({ error: 'User not found' });

  user.isBanned = true;
  await user.save();
  res.json({ success: true, message: 'User banned' });
}));

// POST /api/users/:id/unban - Unban user (Admin only)
router.post('/:id/unban', auth, requireAdmin, asyncHandler(async (req, res) => {
  const user = await User.findByPk(req.params.id);
  if (!user) return res.status(404).json({ error: 'User not found' });

  user.isBanned = false;
  await user.save();
  res.json({ success: true, message: 'User unbanned' });
}));

module.exports = router;