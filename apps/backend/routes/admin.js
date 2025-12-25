const express = require('express');
const { User, Job, Transaction, UserApplication } = require('../models');
const { auth } = require('../middleware/auth');
const router = express.Router();

// Middleware to ensure admin access
const adminGuard = (req, res, next) => {
    if (req.user && (req.user.role === 'ADMIN' || req.user.role === 'Admin')) {
        next();
    } else {
        res.status(403).json({ error: 'Access denied. Admin only.' });
    }
};

// GET /api/admin/stats - Get real-time system statistics
router.get('/stats', auth, adminGuard, async (req, res) => {
    try {
        // Parallelize queries for performance
        const [
            userCount,
            jobCount,
            applicationCount,
            revenueSum,
            recentUsers
        ] = await Promise.all([
            User.count(),
            Job.count({ where: { status: 'Approved' } }), // Assuming Job model has status
            UserApplication ? UserApplication.count() : 0, // Fallback if model not fully synced yet
            Transaction.sum('amount', { where: { type: 'Credit', method: ['Chapa', 'Telebirr', 'M-PESA'] } }),
            User.findAll({
                limit: 5,
                order: [['createdAt', 'DESC']],
                attributes: ['id', 'name', 'email', 'role', 'createdAt']
            })
        ]);

        // Mock server health for now (requires deeper system hooks)
        const serverHealth = 98.5;
        const liveConnections = 42; // This would typically come from Socket.io service

        res.json({
            success: true,
            stats: {
                totalUsers: userCount,
                activeJobs: jobCount || 0,
                jobApps: applicationCount || 0,
                totalRevenue: revenueSum || 0,
                serverHealth,
                liveConnections
            },
            recentUsers
        });
    } catch (err) {
        console.error('Admin Stats Error:', err);
        res.status(500).json({ success: false, error: 'Failed to fetch admin stats' });
    }
});

module.exports = router;
