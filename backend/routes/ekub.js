const express = require('express');
const auth = require('../middleware/auth');
const { EkubGroup, User, Transaction } = require('../models');

const router = express.Router();

// Get all available ekubs
router.get('/', async (req, res) => {
    try {
        const groups = await EkubGroup.findAll({ where: { status: 'Active' } });
        res.status(200).json(groups);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Create an Ekub
router.post('/', auth, async (req, res) => {
    try {
        const group = await EkubGroup.create({
            ...req.body,
            members: [{ userId: req.user.id, spot: 1, hasWon: false }],
            membersCount: 1
        });
        res.status(201).json(group);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Join an Ekub
router.post('/:id/join', auth, async (req, res) => {
    try {
        const group = await EkubGroup.findByPk(req.params.id);
        if (!group) return res.status(404).json({ error: 'Ekub not found' });
        if (group.membersCount >= group.maxMembers) return res.status(400).json({ error: 'Group is full' });

        const members = group.members;
        if (members.some(m => m.userId === req.user.id)) return res.status(400).json({ error: 'Already joined' });

        const updatedMembers = [...members, { userId: req.user.id, spot: group.membersCount + 1, hasWon: false }];
        group.members = updatedMembers;
        group.membersCount += 1;
        await group.save();

        res.status(200).json(group);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Contribute to an Ekub
router.post('/:id/contribute', auth, async (req, res) => {
    try {
        const user = await User.findByPk(req.user.id);
        const group = await EkubGroup.findByPk(req.params.id);

        if (!user || !group) return res.status(404).json({ error: 'User or Ekub not found' });
        if (user.walletBalance < group.contributionAmount) return res.status(400).json({ error: 'Insufficient balance' });

        // Deduct from user
        user.walletBalance -= group.contributionAmount;
        await user.save();

        // Add to group pool
        group.totalAmount += group.contributionAmount;
        await group.save();

        // Log transaction
        await Transaction.create({
            userId: user.id,
            amount: group.contributionAmount,
            type: 'Debit',
            description: `Contribution to ${group.name}`,
            method: 'Wallet'
        });

        res.status(200).json({ success: true, newBalance: user.walletBalance, totalPool: group.totalAmount });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Rotate (Payout) - Simulation for now
router.post('/:id/rotate', auth, async (req, res) => {
    try {
        const group = await EkubGroup.findByPk(req.params.id);
        if (!group) return res.status(404).json({ error: 'Ekub not found' });
        if (group.totalAmount <= 0) return res.status(400).json({ error: 'Pool is empty' });

        const members = group.members;
        const eligible = members.filter(m => !m.hasWon);

        if (eligible.length === 0) {
            // All have won, reset the group or close it? 
            // For now, reset all and pick first again
            members.forEach(m => m.hasWon = false);
        }

        // Pick a winner (Simulation: just pick the one with the smallest spot/order)
        const winnerEntry = eligible.sort((a, b) => a.spot - b.spot)[0] || members[0];
        const winner = await User.findByPk(winnerEntry.userId);

        if (!winner) return res.status(404).json({ error: 'Winner not found' });

        const payout = group.totalAmount;

        // Transfer funds
        winner.walletBalance += payout;
        await winner.save();

        // Mark as won in group
        winnerEntry.hasWon = true;
        group.members = members; // Trigger setter
        group.totalAmount = 0;
        await group.save();

        // Log transaction
        await Transaction.create({
            userId: winner.id,
            amount: payout,
            type: 'Credit',
            description: `Ekub Payout from ${group.name}`,
            method: 'Ekub Payout'
        });

        res.status(200).json({ success: true, winner: winner.name, amount: payout });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
