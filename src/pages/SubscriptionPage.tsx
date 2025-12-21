import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { StoreContext } from '../contexts/StoreContext';
import { ToastContext } from '../contexts/ToastContext';
import { Button } from '../components/common/Button';
import { Card } from '../components/common/Card';
import { Modal } from '../components/common/Modal';
import { api } from '../services/api';

export const SubscriptionPage: React.FC = () => {
    const { state } = useContext(StoreContext);
    const { addToast } = useContext(ToastContext);
    const navigate = useNavigate();
    const [currentTier, setCurrentTier] = useState<'FREE' | 'PRO' | 'ENTERPRISE'>('FREE');
    const [showUpgradeModal, setShowUpgradeModal] = useState(false);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchSubscription();
    }, []);

    const fetchSubscription = async () => {
        try {
            const res = await api.subscription.getCurrent();
            if (res.subscription) {
                setCurrentTier(res.subscription.tier);
            }
        } catch (error) {
            console.error('Failed to fetch subscription:', error);
        }
    };

    const handleUpgrade = async () => {
        setLoading(true);
        try {
            // In production, this would redirect to payment gateway
            const res = await api.subscription.upgrade({
                tier: 'PRO',
                paymentMethod: 'Chapa',
                transactionId: `mock-${Date.now()}`
            });

            if (res.success) {
                setCurrentTier('PRO');
                addToast('Successfully upgraded to Pro! 🎉', 'success');
                setShowUpgradeModal(false);
            }
        } catch (error: any) {
            addToast(error.message || 'Upgrade failed', 'error');
        } finally {
            setLoading(false);
        }
    };

    const tiers = [
        {
            name: 'FREE',
            price: '0 ETB',
            period: 'forever',
            features: [
                '50 ETB daily claim limit',
                '3 job applications/day',
                'Basic AI resume (1/week)',
                'Standard support',
                'Community access'
            ],
            color: 'from-gray-700 to-gray-900',
            current: currentTier === 'FREE'
        },
        {
            name: 'PRO',
            price: '99 ETB',
            period: '/month',
            features: [
                '200 ETB daily claim limit',
                'Unlimited job applications',
                'Advanced AI features (unlimited)',
                'Priority support',
                'Verified badge ✓',
                'Analytics dashboard',
                'Ad-free experience',
                'Early access to features'
            ],
            color: 'from-primary to-blue-600',
            popular: true,
            current: currentTier === 'PRO'
        },
        {
            name: 'ENTERPRISE',
            price: '4,999 ETB',
            period: '/year',
            features: [
                'Everything in Pro',
                'Bulk student accounts',
                'Custom branding',
                'Dedicated admin panel',
                'API access',
                'Priority listing',
                'Dedicated account manager'
            ],
            color: 'from-purple-600 to-pink-600',
            current: currentTier === 'ENTERPRISE'
        }
    ];

    return (
        <div className="min-h-screen bg-black pb-24">
            {/* Header */}
            <div className="p-6 bg-gradient-to-br from-primary/20 to-blue-900/20 border-b border-white/10">
                <button onClick={() => navigate(-1)} className="text-gray-400 hover:text-white mb-4">
                    <i className="fas fa-arrow-left mr-2"></i> Back
                </button>
                <div>
                    <h1 className="text-3xl font-bold text-white mb-2">Subscription Plans</h1>
                    <p className="text-gray-400">Choose the plan that fits your needs</p>
                </div>
            </div>

            {/* Current Plan Badge */}
            {currentTier !== 'FREE' && (
                <div className="p-4">
                    <Card className="!p-4 bg-gradient-to-r from-primary/20 to-blue-600/20 border-primary/30">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-white font-bold">Current Plan: {currentTier}</p>
                                <p className="text-xs text-gray-400">Active until {new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString()}</p>
                            </div>
                            <i className="fas fa-crown text-primary text-2xl"></i>
                        </div>
                    </Card>
                </div>
            )}

            {/* Pricing Cards */}
            <div className="p-4 space-y-4">
                {tiers.map((tier) => (
                    <Card key={tier.name} className={`!p-6 bg-gradient-to-br ${tier.color} ${tier.popular ? 'border-2 border-primary shadow-[0_0_30px_rgba(20,241,149,0.3)]' : ''}`}>
                        {tier.popular && (
                            <div className="bg-primary text-black text-xs font-bold px-3 py-1 rounded-full w-fit mb-3">
                                MOST POPULAR
                            </div>
                        )}

                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <h3 className="text-2xl font-bold text-white">{tier.name}</h3>
                                <div className="flex items-baseline gap-1 mt-2">
                                    <span className="text-3xl font-bold text-white">{tier.price}</span>
                                    <span className="text-gray-400 text-sm">{tier.period}</span>
                                </div>
                            </div>
                            {tier.current && (
                                <div className="bg-white/20 text-white text-xs font-bold px-3 py-1 rounded-full">
                                    CURRENT
                                </div>
                            )}
                        </div>

                        <ul className="space-y-2 mb-6">
                            {tier.features.map((feature, idx) => (
                                <li key={idx} className="flex items-start gap-2 text-sm text-white">
                                    <i className="fas fa-check text-primary mt-0.5"></i>
                                    <span>{feature}</span>
                                </li>
                            ))}
                        </ul>

                        {!tier.current && (
                            <Button
                                onClick={() => tier.name === 'PRO' ? setShowUpgradeModal(true) : addToast('Contact us for Enterprise', 'info')}
                                className="w-full"
                                variant={tier.popular ? 'primary' : 'outline'}
                            >
                                {tier.name === 'FREE' ? 'Current Plan' : tier.name === 'PRO' ? 'Upgrade to Pro' : 'Contact Sales'}
                            </Button>
                        )}
                    </Card>
                ))}
            </div>

            {/* Upgrade Modal */}
            <Modal isOpen={showUpgradeModal} onClose={() => setShowUpgradeModal(false)} title="Upgrade to Pro">
                <div className="space-y-4">
                    <div className="bg-gradient-to-br from-primary/20 to-blue-600/20 p-4 rounded-xl border border-primary/30">
                        <h4 className="text-white font-bold mb-2">TemariWare Pro</h4>
                        <p className="text-2xl font-bold text-white">99 ETB <span className="text-sm text-gray-400">/month</span></p>
                    </div>

                    <div className="bg-yellow-500/10 p-3 rounded-xl border border-yellow-500/20">
                        <p className="text-xs text-yellow-500 flex gap-2">
                            <i className="fas fa-info-circle mt-0.5"></i>
                            <span>In production, you'll be redirected to Chapa/Telebirr for secure payment. This is a demo upgrade.</span>
                        </p>
                    </div>

                    <div className="flex gap-3">
                        <Button onClick={() => setShowUpgradeModal(false)} variant="outline" className="flex-1">
                            Cancel
                        </Button>
                        <Button onClick={handleUpgrade} className="flex-1" disabled={loading}>
                            {loading ? <><i className="fas fa-spinner fa-spin mr-2"></i> Processing...</> : 'Confirm Upgrade'}
                        </Button>
                    </div>
                </div>
            </Modal>
        </div>
    );
};
