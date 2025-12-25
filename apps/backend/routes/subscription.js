const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/auth');
const Subscription = require('../models/Subscription');
const User = require('../models/User');

// Get current subscription
router.get('/current', auth, async (req, res) => {
    try {
        const subscription = await Subscription.findOne({
            where: { userId: req.user.id, status: 'ACTIVE' }
        });

        if (!subscription) {
            // Create default free subscription
            const newSub = await Subscription.create({
                userId: req.user.id,
                tier: 'FREE',
                status: 'ACTIVE'
            });
            return res.json({ success: true, subscription: newSub });
        }

        res.json({ success: true, subscription });
    } catch (error) {
        console.error('Get subscription error:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

// Upgrade to Pro
router.post('/upgrade', auth, async (req, res) => {
    try {
        const { tier, paymentMethod, transactionId } = req.body;

        // Find existing subscription
        let subscription = await Subscription.findOne({
            where: { userId: req.user.id, status: 'ACTIVE' }
        });

        if (subscription) {
            // Update existing
            subscription.tier = tier;
            subscription.paymentMethod = paymentMethod;
            subscription.transactionId = transactionId;
            subscription.endDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 days
            await subscription.save();
        } else {
            // Create new
            subscription = await Subscription.create({
                userId: req.user.id,
                tier,
                paymentMethod,
                transactionId,
                status: 'ACTIVE',
                endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
            });
        }

        res.json({ success: true, subscription });
    } catch (error) {
        console.error('Upgrade error:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

// Cancel subscription
router.post('/cancel', auth, async (req, res) => {
    try {
        const subscription = await Subscription.findOne({
            where: { userId: req.user.id, status: 'ACTIVE' }
        });

        if (!subscription) {
            return res.status(404).json({ success: false, error: 'No active subscription found' });
        }

        subscription.status = 'CANCELLED';
        subscription.autoRenew = false;
        await subscription.save();

        res.json({ success: true, message: 'Subscription cancelled' });
    } catch (error) {
        console.error('Cancel subscription error:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

// Initialize payment
router.post('/payment/initialize', auth, async (req, res) => {
    try {
        const { tier, amount } = req.body;
        const chapaService = require('../utils/chapaService');

        const txRef = `TW-${req.user.id}-${Date.now()}`;
        const callbackUrl = `${process.env.API_BASE_URL || 'http://localhost:5000'}/api/subscription/payment/callback`;
        const returnUrl = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/#/subscription?status=success`;

        const result = await chapaService.initializePayment({
            amount,
            email: req.user.email,
            firstName: req.user.name.split(' ')[0],
            lastName: req.user.name.split(' ')[1] || '',
            txRef,
            callbackUrl,
            returnUrl
        });

        if (result.success) {
            // Store pending subscription
            await Subscription.create({
                userId: req.user.id,
                tier,
                status: 'PENDING',
                transactionId: txRef,
                paymentMethod: 'Chapa'
            });

            res.json({ success: true, checkoutUrl: result.data.checkout_url, txRef });
        } else {
            res.status(400).json({ success: false, error: result.error });
        }
    } catch (error) {
        console.error('Payment initialization error:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

// Payment callback (Chapa webhook)
router.post('/payment/callback', async (req, res) => {
    try {
        const { tx_ref, status } = req.body;
        const chapaService = require('../utils/chapaService');

        // Verify payment with Chapa
        const verification = await chapaService.verifyPayment(tx_ref);

        if (verification.success && verification.data.status === 'success') {
            // Update subscription
            const subscription = await Subscription.findOne({
                where: { transactionId: tx_ref }
            });

            if (subscription) {
                subscription.status = 'ACTIVE';
                subscription.endDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
                await subscription.save();

                // Update user wallet if needed
                const user = await User.findByPk(subscription.userId);
                if (user) {
                    // Emit socket event for real-time notification
                    const io = req.app.get('io');
                    if (io) {
                        io.to(`user-${user.id}`).emit('subscription:upgraded', {
                            tier: subscription.tier,
                            endDate: subscription.endDate
                        });
                    }
                }
            }
        }

        res.json({ success: true });
    } catch (error) {
        console.error('Payment callback error:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

module.exports = router;
