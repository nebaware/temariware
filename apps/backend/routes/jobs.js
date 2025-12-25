const express = require('express');
const { auth } = require('../middleware/auth');
const requireAdmin = require('../middleware/requireAdmin');
const Job = require('../models/Job');
const User = require('../models/User');
const asyncHandler = require('../utils/asyncHandler');
const { Op } = require('sequelize');

const router = express.Router();

// GET /api/jobs - list jobs (non-admin sees approved only)
router.get('/', auth, asyncHandler(async (req, res) => {
    let whereClause = {};
    if (req.user.role !== 'Admin') {
        whereClause.status = 'Approved';
    }

    const { type } = req.query;
    if (type && type !== 'all') {
        whereClause.type = type;
    }

    const jobs = await Job.findAll({
        where: whereClause,
        order: [['createdAt', 'DESC']]
    });
    res.json(jobs);
}));

// POST /api/jobs - create job (any authenticated user)
router.post('/', auth, asyncHandler(async (req, res) => {
    const { title, company, type, location, description, salary, salaryVal, tags } = req.body;
    if (!title || !company || !type || !location || !description) {
        return res.status(400).json({ error: 'title, company, type, location, description are required' });
    }
    const job = await Job.create({
        title,
        company,
        type,
        location,
        description,
        salary,
        salaryVal,
        tags,
        createdBy: req.user.id,
        status: req.user.role === 'Admin' ? 'Approved' : 'Pending'
    });
    res.status(201).json(job);
}));

// GET /api/jobs/:id
router.get('/:id', auth, asyncHandler(async (req, res) => {
    const job = await Job.findByPk(req.params.id);
    if (!job) return res.status(404).json({ error: 'Job not found' });

    if (job.status !== 'Approved' && req.user.role !== 'Admin' && job.createdBy !== req.user.id) {
        return res.status(403).json({ error: 'Not authorized to view this job' });
    }
    res.json(job);
}));

// PUT /api/jobs/:id (owner or admin)
router.put('/:id', auth, asyncHandler(async (req, res) => {
    const job = await Job.findByPk(req.params.id);
    if (!job) return res.status(404).json({ error: 'Job not found' });
    if (req.user.role !== 'Admin' && job.createdBy !== req.user.id) {
        return res.status(403).json({ error: 'Not authorized to update this job' });
    }

    const fields = ['title', 'company', 'companySize', 'type', 'location', 'description', 'salary', 'salaryVal', 'tags', 'isGroupProject'];
    fields.forEach(f => {
        if (req.body[f] !== undefined) job[f] = req.body[f];
    });

    if (req.user.role === 'Admin' && req.body.status) {
        job.status = req.body.status;
    } else if (req.body.status) {
        job.status = 'Pending';
    }

    await job.save();
    res.json(job);
}));

// DELETE /api/jobs/:id (owner or admin)
router.delete('/:id', auth, asyncHandler(async (req, res) => {
    const job = await Job.findByPk(req.params.id);
    if (!job) return res.status(404).json({ error: 'Job not found' });
    if (req.user.role !== 'Admin' && job.createdBy !== req.user.id) {
        return res.status(403).json({ error: 'Not authorized to delete this job' });
    }
    await job.destroy();
    res.json({ success: true });
}));

// POST /api/jobs/:id/apply - user applies
router.post('/:id/apply', auth, asyncHandler(async (req, res) => {
    const job = await Job.findByPk(req.params.id);
    if (!job) return res.status(404).json({ error: 'Job not found' });
    if (job.status !== 'Approved') return res.status(403).json({ error: 'Job not open' });

    const user = await User.findByPk(req.user.id);
    if (!user) return res.status(404).json({ error: 'User not found' });

    // Handle appliedJobs as JSON string if it's not already structured
    let appliedJobs = user.appliedJobs || [];
    if (typeof appliedJobs === 'string') appliedJobs = JSON.parse(appliedJobs);

    const already = appliedJobs.some(j => j.jobId === job.id);
    if (already) return res.status(400).json({ error: 'Already applied' });

    appliedJobs.push({ jobId: job.id, appliedAt: new Date().toISOString(), status: 'Applied' });

    // Increment applicantsCount
    job.applicantsCount += 1;

    // Update user - we need to ensure the setter/getter for appliedJobs is handled or we manually update
    // Assuming User model might need update for appliedJobs persistence if not using JSON.
    // For now, let's just use the current instance update.
    user.appliedJobs = appliedJobs;

    await user.save();
    await job.save();
    res.json({ success: true });
}));

// Admin: approve/reject job
router.post('/:id/moderate', auth, requireAdmin, asyncHandler(async (req, res) => {
    const { status } = req.body;
    if (!['Approved', 'Rejected', 'Pending'].includes(status)) {
        return res.status(400).json({ error: 'Invalid status' });
    }
    const job = await Job.findByPk(req.params.id);
    if (!job) return res.status(404).json({ error: 'Job not found' });

    job.status = status;
    await job.save();
    res.json(job);
}));

module.exports = router;
