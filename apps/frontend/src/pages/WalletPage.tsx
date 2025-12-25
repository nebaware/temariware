import React, { useContext, useState } from 'react';
import { StoreContext } from '../contexts/StoreContext';
import { ToastContext } from '../contexts/ToastContext';
import { Button } from '../components/common/Button';
import { Modal } from '../components/common/Modal';
import { Card } from '../components/common/Card';
import { api } from '../services/api';

export const WalletPage: React.FC = () => {
    const { state, dispatch } = useContext(StoreContext);
    const { addToast } = useContext(ToastContext);
    const [showSend, setShowSend] = useState(false);
    const [showReceive, setShowReceive] = useState(false);
    const [showTopUp, setShowTopUp] = useState(false);
    const [sendAmount, setSendAmount] = useState('');
    const [topUpAmount, setTopUpAmount] = useState('');
    const [recipient, setRecipient] = useState('');
    const [paymentMethod, setPaymentMethod] = useState<'Chapa' | 'Telebirr' | 'M-PESA'>('Chapa');
    const [mpesaPhone, setMpesaPhone] = useState('');
    const [loadingTopUp, setLoadingTopUp] = useState(false);
    const [isPolling, setIsPolling] = useState(false); // New state for M-PESA simulation

    const handleTopUp = async () => {
        const amount = parseFloat(topUpAmount);
        if (amount <= 0) {
            addToast('Invalid amount', 'error');
            return;
        }

        if (paymentMethod === 'M-PESA' && !mpesaPhone) {
            addToast('Please enter your M-PESA phone number', 'error');
            return;
        }

        setLoadingTopUp(true);
        try {
            if (paymentMethod === 'M-PESA') {
                // 1. Initiate STK Push
                const res = await api.wallet.topUpMpesa(amount, mpesaPhone);
                if (res.success) {
                    setShowTopUp(false);
                    // 2. Start Simulation of User Action (Entering PIN on Phone)
                    setIsPolling(true);

                    setTimeout(() => {
                        // 3. Simulate Success Callback after 5 seconds
                        setIsPolling(false);
                        dispatch({ type: 'UPDATE_PROFILE', payload: { walletBalance: res.newBalance } }); // Balance update happens here now
                        addToast(`✅ Payment Received! Balance Updated.`, 'success');
                        setTopUpAmount('');
                        setMpesaPhone('');
                    }, 5000);
                }
            } else {
                // Keep simulated flow for Chapa/Telebirr for now
                dispatch({
                    type: 'ADD_TRANSACTION',
                    payload: {
                        id: `tx-topup-${Date.now()}`,
                        amount,
                        type: 'Credit',
                        description: `Top-up via ${paymentMethod}`,
                        date: new Date().toLocaleDateString(),
                        method: paymentMethod,
                        status: 'Completed'
                    }
                });
                addToast(`Successfully topped up ${amount} ETB via ${paymentMethod}`, 'success');
                setShowTopUp(false);
                setTopUpAmount('');
            }
        } catch (err: any) {
            addToast(err.message || 'Top-up failed', 'error');
        } finally {
            setLoadingTopUp(false);
        }
    };

    const handleSend = () => {
        const amount = parseFloat(sendAmount);
        if (amount <= 0 || amount > (state.user?.walletBalance || 0)) {
            addToast('Invalid amount', 'error');
            return;
        }
        dispatch({
            type: 'ADD_TRANSACTION',
            payload: {
                id: `tx-${Date.now()}`,
                amount,
                type: 'Debit',
                description: `Sent to ${recipient}`,
                date: new Date().toLocaleDateString(),
                method: 'Wallet',
                status: 'Completed'
            }
        });
        addToast('Money sent successfully!', 'success');
        setShowSend(false);
        setSendAmount('');
        setRecipient('');
    };

    const handleReceive = () => {
        const amount = parseFloat(sendAmount);
        if (amount <= 0) {
            addToast('Invalid amount', 'error');
            return;
        }
        dispatch({
            type: 'ADD_TRANSACTION',
            payload: {
                id: `tx-${Date.now()}`,
                amount,
                type: 'Credit',
                description: 'Received payment',
                date: new Date().toLocaleDateString(),
                method: 'Wallet',
                status: 'Completed'
            }
        });
        addToast('Payment received!', 'success');
        setShowReceive(false);
        setSendAmount('');
    };

    const totalSpent = state.user?.transactions
        .filter(t => t.type === 'Debit')
        .reduce((sum, t) => sum + t.amount, 0) || 0;

    const totalReceived = state.user?.transactions
        .filter(t => t.type === 'Credit')
        .reduce((sum, t) => sum + t.amount, 0) || 0;

    return (
        <div className="p-4 pb-24 max-w-md mx-auto">
            <h2 className="text-2xl font-bold text-white mb-6">My Wallet</h2>

            {/* Balance Card */}
            <div className="bg-gradient-to-br from-primary via-blue-500 to-purple-600 p-6 rounded-3xl mb-6 text-black shadow-2xl">
                <p className="text-sm font-bold opacity-80">Total Balance</p>
                <h1 className="text-5xl font-bold mt-2 mb-4">{state.user?.walletBalance.toLocaleString()} <span className="text-2xl">ETB</span></h1>
                <div className="flex gap-3">
                    <button onClick={() => setShowTopUp(true)} className="flex-1 bg-white/20 hover:bg-white/30 backdrop-blur-sm py-3 rounded-xl font-bold text-sm transition-all border border-white/10">
                        <i className="fas fa-plus mr-2"></i> Top Up
                    </button>
                    <button onClick={() => setShowSend(true)} className="flex-1 bg-black/10 hover:bg-black/20 backdrop-blur-sm py-3 rounded-xl font-bold text-sm transition-all">
                        <i className="fas fa-paper-plane mr-2"></i> Send
                    </button>
                </div>
            </div>

            {/* Analytics */}
            <div className="grid grid-cols-2 gap-3 mb-6">
                <Card className="!p-4">
                    <p className="text-xs text-gray-400 mb-1">Total Received</p>
                    <p className="text-xl font-bold text-green-400">+{totalReceived.toLocaleString()}</p>
                </Card>
                <Card className="!p-4">
                    <p className="text-xs text-gray-400 mb-1">Total Spent</p>
                    <p className="text-xl font-bold text-red-400">-{totalSpent.toLocaleString()}</p>
                </Card>
            </div>

            {/* Transactions */}
            <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold text-white">Recent Transactions</h3>
                <span className="text-xs text-gray-400">{state.user?.transactions.length || 0} total</span>
            </div>

            <div className="space-y-3">
                {state.user?.transactions.length === 0 ? (
                    <div className="text-center text-gray-500 py-8">
                        <i className="fas fa-receipt text-4xl mb-2 opacity-50"></i>
                        <p className="text-sm">No transactions yet</p>
                    </div>
                ) : (
                    state.user?.transactions.slice(0, 10).map(t => (
                        <div key={t.id} className="flex justify-between items-center bg-[#1e293b] p-4 rounded-xl border border-white/10 hover:border-primary/30 transition-colors">
                            <div className="flex items-center gap-3">
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${t.type === 'Credit' ? 'bg-green-500/20' : 'bg-red-500/20'}`}>
                                    <i className={`fas ${t.type === 'Credit' ? 'fa-arrow-down text-green-400' : 'fa-arrow-up text-red-400'}`}></i>
                                </div>
                                <div>
                                    <p className="text-white font-bold text-sm">{t.description}</p>
                                    <p className="text-xs text-gray-400">{t.date} • {t.method}</p>
                                </div>
                            </div>
                            <div className="text-right">
                                <span className={`font-bold text-lg ${t.type === 'Credit' ? 'text-green-400' : 'text-red-400'}`}>
                                    {t.type === 'Credit' ? '+' : '-'}{t.amount}
                                </span>
                                <p className="text-xs text-gray-500">{t.status}</p>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Top Up Modal */}
            <Modal isOpen={showTopUp} onClose={() => setShowTopUp(false)} title="Top Up Wallet">
                <div className="space-y-6">
                    <div>
                        <label className="block text-[10px] font-bold text-gray-400 mb-3 uppercase tracking-wider">Select Payment Method</label>
                        <div className="grid grid-cols-3 gap-3">
                            <button
                                onClick={() => setPaymentMethod('Chapa')}
                                className={`p-3 rounded-2xl border-2 transition-all flex flex-col items-center gap-2 ${paymentMethod === 'Chapa' ? 'border-primary bg-primary/10' : 'border-gray-800 bg-black/20'}`}
                            >
                                <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center text-blue-600 font-bold text-lg italic">C</div>
                                <span className="text-[10px] font-bold text-white">Chapa</span>
                            </button>
                            <button
                                onClick={() => setPaymentMethod('Telebirr')}
                                className={`p-3 rounded-2xl border-2 transition-all flex flex-col items-center gap-2 ${paymentMethod === 'Telebirr' ? 'border-primary bg-primary/10' : 'border-gray-800 bg-black/20'}`}
                            >
                                <div className="w-8 h-8 bg-[#0081C9] rounded-lg flex items-center justify-center text-white font-bold text-lg">Tb</div>
                                <span className="text-[10px] font-bold text-white">Telebirr</span>
                            </button>
                            <button
                                onClick={() => setPaymentMethod('M-PESA')}
                                className={`p-3 rounded-2xl border-2 transition-all flex flex-col items-center gap-2 ${paymentMethod === 'M-PESA' ? 'border-primary bg-primary/10' : 'border-gray-800 bg-black/20'}`}
                            >
                                <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-green-700 rounded-lg flex items-center justify-center text-white font-bold text-lg">M</div>
                                <span className="text-[10px] font-bold text-white">M-PESA</span>
                            </button>
                        </div>
                    </div>

                    {paymentMethod === 'M-PESA' && (
                        <div>
                            <label className="block text-[10px] font-bold text-gray-400 mb-2 uppercase tracking-wider">M-PESA Phone Number</label>
                            <div className="relative">
                                <i className="fas fa-phone absolute left-4 top-4 text-gray-500 text-xs"></i>
                                <input
                                    type="text"
                                    value={mpesaPhone}
                                    onChange={(e) => setMpesaPhone(e.target.value)}
                                    placeholder="2519..."
                                    className="w-full bg-black/50 border border-gray-600 rounded-2xl pl-10 pr-4 py-4 text-sm text-white focus:border-primary outline-none"
                                />
                            </div>
                            <p className="text-[10px] text-gray-500 mt-1">Include country code (e.g., 251912345678)</p>
                        </div>
                    )}
                    <div>
                        <label className="block text-[10px] font-bold text-gray-400 mb-2 uppercase tracking-wider">Amount (ETB)</label>
                        <input
                            type="number"
                            value={topUpAmount}
                            onChange={(e) => setTopUpAmount(e.target.value)}
                            placeholder="Min. 50 ETB"
                            className="w-full bg-black/50 border border-gray-600 rounded-2xl px-4 py-4 text-xl font-bold text-white focus:border-primary outline-none"
                        />
                    </div>
                    <div className="bg-yellow-500/10 p-3 rounded-xl border border-yellow-500/20">
                        <p className="text-[10px] text-yellow-500 flex gap-2">
                            <i className="fas fa-info-circle mt-0.5"></i>
                            This is a simulated transaction. In production, you will be redirected to {paymentMethod}'s secure gateway.
                        </p>
                    </div>
                    <Button onClick={handleTopUp} className="w-full !py-4" disabled={loadingTopUp || !topUpAmount || parseFloat(topUpAmount) < 50}>
                        {loadingTopUp ? <i className="fas fa-spinner fa-spin mr-2"></i> : null}
                        {loadingTopUp ? 'Processing...' : 'Confirm Top Up'}
                    </Button>
                </div>
            </Modal>

            {/* Send Money Modal */}
            <Modal isOpen={showSend} onClose={() => setShowSend(false)} title="Send Money">
                <div className="space-y-4">
                    <div>
                        <label className="block text-xs font-bold text-gray-400 mb-2">RECIPIENT</label>
                        <input
                            value={recipient}
                            onChange={(e) => setRecipient(e.target.value)}
                            placeholder="Enter name or email"
                            className="w-full bg-black/50 border border-gray-600 rounded-xl px-4 py-3 text-sm text-white focus:border-primary outline-none"
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-gray-400 mb-2">AMOUNT (ETB)</label>
                        <input
                            type="number"
                            value={sendAmount}
                            onChange={(e) => setSendAmount(e.target.value)}
                            placeholder="0.00"
                            className="w-full bg-black/50 border border-gray-600 rounded-xl px-4 py-3 text-sm text-white focus:border-primary outline-none"
                        />
                        <p className="text-xs text-gray-500 mt-1">Available: {state.user?.walletBalance.toLocaleString()} ETB</p>
                    </div>
                    <div className="flex gap-3 pt-4 border-t border-white/10">
                        <Button onClick={() => setShowSend(false)} variant="outline" className="flex-1">Cancel</Button>
                        <Button onClick={handleSend} className="flex-1" disabled={!recipient || !sendAmount}>Send Money</Button>
                    </div>
                </div>
            </Modal>

            {/* Receive Money Modal */}
            <Modal isOpen={showReceive} onClose={() => setShowReceive(false)} title="Receive Money">
                <div className="space-y-4">
                    <div className="bg-blue-500/10 p-4 rounded-xl border border-blue-500/20 text-center">
                        <div className="w-32 h-32 bg-white mx-auto mb-3 rounded-xl flex items-center justify-center">
                            <i className="fas fa-qrcode text-6xl text-black"></i>
                        </div>
                        <p className="text-xs text-blue-300">Share this QR code to receive payment</p>
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-gray-400 mb-2">REQUEST AMOUNT (Optional)</label>
                        <input
                            type="number"
                            value={sendAmount}
                            onChange={(e) => setSendAmount(e.target.value)}
                            placeholder="0.00"
                            className="w-full bg-black/50 border border-gray-600 rounded-xl px-4 py-3 text-sm text-white focus:border-primary outline-none"
                        />
                    </div>
                    <div className="flex gap-3 pt-4 border-t border-white/10">
                        <Button onClick={() => setShowReceive(false)} variant="outline" className="flex-1">Close</Button>
                        <Button onClick={handleReceive} className="flex-1" disabled={!sendAmount}>Simulate Receive</Button>
                    </div>
                </div>
            </Modal>

            {/* M-PESA Polling Modal */}
            <Modal isOpen={isPolling} onClose={() => { }} title="Check Your Phone">
                <div className="text-center py-8">
                    <div className="w-20 h-20 mx-auto bg-green-500/10 rounded-full flex items-center justify-center mb-6 relative">
                        <div className="absolute inset-0 rounded-full border-4 border-green-500/30 border-t-green-500 animate-spin"></div>
                        <i className="fas fa-mobile-alt text-3xl text-green-500"></i>
                    </div>

                    <h3 className="text-white text-xl font-bold mb-2">STK Push Sent</h3>
                    <p className="text-gray-400 text-sm mb-6 max-w-xs mx-auto">
                        Please enter your M-PESA PIN on your mobile device to complete the transaction of <span className="text-white font-bold">{topUpAmount} ETB</span>.
                    </p>

                    <div className="bg-blue-900/20 p-4 rounded-xl border border-blue-500/30 text-xs text-blue-300">
                        <i className="fas fa-info-circle mr-2"></i>
                        Waiting for M-PESA confirmation...
                    </div>
                </div>
            </Modal>
        </div>
    );
};
