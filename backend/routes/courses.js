const express = require('express');
const { auth } = require('../middleware/auth');
const { Course, User } = require('../models');

const router = express.Router();

// Get all courses
router.get('/', async (req, res) => {
    try {
        const courses = await Course.findAll({ order: [['createdAt', 'DESC']] });
        res.status(200).json(courses);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Create course
router.post('/', auth, async (req, res) => {
    try {
        const user = await User.findByPk(req.user.id);
        const course = await Course.create({
            ...req.body,
            instructorId: user.id,
            instructorName: user.name,
            instructorAvatar: user.avatar
        });
        res.status(201).json(course);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Enroll in course
router.post('/:id/enroll', auth, async (req, res) => {
    try {
        const user = await User.findByPk(req.user.id);
        const course = await Course.findByPk(req.params.id);

        if (!course) return res.status(404).json({ error: 'Course not found' });

        let enrolled = user.enrolledCourses || [];
        if (enrolled.includes(course.id)) {
            return res.status(400).json({ error: 'Already enrolled' });
        }

        user.enrolledCourses = [...enrolled, course.id];
        await user.save();

        course.enrolledCount += 1;
        await course.save();

        res.status(200).json({ success: true, enrolledCourses: user.enrolledCourses });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;





