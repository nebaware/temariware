const express = require('express');
const { auth } = require('../middleware/auth');
const { Message, User } = require('../models');
const { Op } = require('sequelize');

const router = express.Router();

// Get conversation with a specific user
router.get('/:userId', auth, async (req, res) => {
    try {
        const messages = await Message.findAll({
            where: {
                [Op.or]: [
                    { senderId: req.user.id, receiverId: req.params.userId },
                    { senderId: req.params.userId, receiverId: req.user.id }
                ]
            },
            order: [['createdAt', 'ASC']]
        });
        res.status(200).json(messages);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Send message
router.post('/', auth, async (req, res) => {
    const { receiverId, text } = req.body;
    try {
        const message = await Message.create({
            senderId: req.user.id,
            receiverId,
            text
        });
        res.status(201).json(message);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;





