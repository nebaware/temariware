const express = require('express');
const auth = require('../middleware/auth');
const { User, Transaction } = require('../models');

const router = express.Router();

// Get balance
router.get('/balance', auth, async (req, res) => {
    try {
        const user = await User.findByPk(req.user.id);
        if (!user) return res.status(404).json({ error: 'User not found' });
        res.status(200).json({ balance: user.walletBalance });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get transactions
router.get('/transactions', auth, async (req, res) => {
    try {
        const transactions = await Transaction.findAll({
            where: { userId: req.user.id },
            order: [['createdAt', 'DESC']]
        });
        res.status(200).json(transactions);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Send money (Simulated for basic phase)
router.post('/send', auth, async (req, res) => {
    const { amount, recipientId, description } = req.body;
    try {
        const sender = await User.findByPk(req.user.id);
        const recipient = await User.findByPk(recipientId);

        if (!sender || !recipient) return res.status(404).json({ error: 'Sender or recipient not found' });
        if (sender.walletBalance < amount) return res.status(400).json({ error: 'Insufficient balance' });

        // Update balances
        sender.walletBalance -= amount;
        recipient.walletBalance += amount;

        await sender.save();
        await recipient.save();

        // Create transactions
        await Transaction.create({
            userId: sender.id,
            amount: amount,
            type: 'Debit',
            description: description || `Sent to ${recipient.name}`,
            method: 'Wallet'
        });

        await Transaction.create({
            userId: recipient.id,
            amount: amount,
            type: 'Credit',
            description: description || `Received from ${sender.name}`,
            method: 'Wallet'
        });

        res.status(200).json({ success: true, newBalance: sender.walletBalance });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

const mpesaService = require('../utils/mpesaService');

// M-PESA Top up
router.post('/mpesa/topup', auth, async (req, res) => {
    const { amount, phoneNumber } = req.body;
    try {
        const user = await User.findByPk(req.user.id);
        if (!user) return res.status(404).json({ error: 'User not found' });

        const mpesaResponse = await mpesaService.initiateStkPush(phoneNumber, amount, `TOPUP-${user.id}`);

        // If it's mock mode, we immediately credit the account for seamless testing
        if (mpesaResponse.isMock) {
            user.walletBalance += parseFloat(amount);
            await user.save();
            await Transaction.create({
                userId: user.id,
                amount: amount,
                type: 'Credit',
                description: `Top-up via M-PESA (Mock)`,
                method: 'M-PESA',
                status: 'Completed'
            });
            return res.status(200).json({
                success: true,
                message: 'Mock payment success!',
                newBalance: user.walletBalance,
                mpesaResponse
            });
        }

        res.status(200).json({ success: true, mpesaResponse });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// M-PESA Callback (Webhook from Safaricom)
router.post('/mpesa/callback', async (req, res) => {
    const { Body } = req.body;
    console.log('M-PESA Callback Received:', JSON.stringify(Body, null, 2));

    // In a real implementation:
    // 1. Validate the callback result (ResultCode === 0)
    // 2. Extract MerchantRequestID/CheckoutRequestID
    // 3. Find the associated transaction/user
    // 4. Update the wallet balance

    res.status(200).send('OK');
});

module.exports = router;





