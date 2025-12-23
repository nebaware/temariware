import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { StoreContext } from '../contexts/StoreContext';
import { LanguageContext } from '../contexts/LanguageContext';
import { Avatar } from '../components/common/Avatar';
import { Card } from '../components/common/Card';

export const HomePage: React.FC = () => {
    const { state, dispatch } = useContext(StoreContext);
    const { t } = useContext(LanguageContext);
    const navigate = useNavigate();
    const [claimed, setClaimed] = useState(state.user?.dailyClaimed || false);

    // Debug: Log user state
    console.log('HomePage - User state:', state.user);
    console.log('HomePage - Is authenticated:', state.isAuthenticated);

    // Fallback user data if missing
    const user = state.user || {
        name: 'Welcome User',
        level: 1,
        xp: 0,
        walletBalance: 0,
        streak: 0,
        avatar: '',
        dailyClaimed: false
    };

    const handleClaim = () => {
        if (claimed) return;
        dispatch({ type: 'CLAIM_DAILY_REWARD' });
        setClaimed(true);
    };

    const levelProgress = ((user.xp || 0) % 1000) / 10;

    // Show loading state if no user data
    if (!state.isAuthenticated) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-black text-white">
                <div className="text-center">
                    <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
                    <p>Loading your dashboard...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="pb-32 max-w-md mx-auto pt-4 px-4 min-h-screen">
            <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-3">
                    <div onClick={() => navigate('/profile')} className="relative cursor-pointer">
                        <Avatar src={user.avatar || ''} alt="me" size="md" className="border-2 border-primary" />
                        <div className="absolute -bottom-1 -right-1 bg-black text-white text-[10px] font-bold px-1.5 rounded border border-gray-700">Lvl {user.level || 1}</div>
                    </div>
                    <div>
                        <h2 className="font-bold text-white text-sm">{user.name}</h2>
                        <div className="w-24 h-1.5 bg-gray-800 rounded-full mt-1 overflow-hidden">
                            <div className="h-full bg-gradient-to-r from-primary to-blue-500" style={{ width: `${levelProgress}%` }}></div>
                        </div>
                    </div>
                </div>
                <div className="bg-gray-800/80 backdrop-blur px-4 py-2 rounded-xl border border-white/5 flex flex-col items-end">
                    <span className="text-[10px] text-gray-400 uppercase font-bold">Wallet</span>
                    <span className="text-primary font-bold font-mono">{(user.walletBalance ?? 0).toLocaleString()} ETB</span>
                </div>
            </div>

            <div className="grid grid-cols-3 gap-2 mb-6">
                <div className="bg-[#1e293b] p-2 rounded-xl border border-white/5 text-center">
                    <span className="text-[10px] text-accent font-bold">XP / Hour</span>
                    <p className="text-white font-bold">+120</p>
                </div>
                <div className="bg-[#1e293b] p-2 rounded-xl border border-white/5 text-center">
                    <span className="text-[10px] text-blue-400 font-bold">Study Streak</span>
                    <p className="text-white font-bold">{user.streak || 0} Days</p>
                </div>
                <div className="bg-[#1e293b] p-2 rounded-xl border border-white/5 text-center">
                    <span className="text-[10px] text-primary font-bold">Tasks Done</span>
                    <p className="text-white font-bold">12</p>
                </div>
            </div>

            <div className="relative h-64 mb-8 flex items-center justify-center">
                <div className="absolute inset-0 bg-primary/20 blur-[100px] rounded-full"></div>
                <motion.button whileTap={{ scale: 0.95 }} onClick={handleClaim} disabled={claimed} className={`relative z-10 w-48 h-48 rounded-full flex flex-col items-center justify-center border-4 shadow-[0_0_50px_rgba(20,241,149,0.2)] transition-all ${claimed ? 'border-gray-700 bg-gray-800 grayscale' : 'border-primary bg-gradient-to-b from-[#1e293b] to-black cursor-pointer'}`}>
                    {claimed ? (
                        <>
                            <i className="fas fa-check text-4xl text-gray-500 mb-2"></i>
                            <span className="text-gray-500 text-xs font-bold">Claimed</span>
                            <span className="text-gray-600 text-[10px]">Come back tmrw</span>
                        </>
                    ) : (
                        <>
                            <div className="text-5xl mb-2 animate-bounce">🎁</div>
                            <span className="text-white font-bold text-lg">Daily Claim</span>
                            <span className="text-primary text-xs font-bold">+150 ETB</span>
                        </>
                    )}
                </motion.button>
            </div>

            <h3 className="text-white font-bold mb-3 flex items-center gap-2"><i className="fas fa-bolt text-yellow-400"></i> Quick Actions</h3>
            <div className="grid grid-cols-2 gap-3 mb-20">
                <Card onClick={() => navigate('/gebeta')} className="bg-gradient-to-br from-purple-900/50 to-blue-900/50 border-purple-500/30">
                    <i className="fas fa-book-open text-2xl text-purple-400 mb-2"></i>
                    <h4 className="text-white font-bold text-sm">Study & Earn</h4>
                    <p className="text-gray-400 text-[10px]">Complete modules for XP</p>
                </Card>
                <Card onClick={() => navigate('/work')} className="bg-gradient-to-br from-green-900/50 to-teal-900/50 border-green-500/30">
                    <i className="fas fa-briefcase text-2xl text-green-400 mb-2"></i>
                    <h4 className="text-white font-bold text-sm">Find Gigs</h4>
                    <p className="text-gray-400 text-[10px]">Earn real money</p>
                </Card>
                <Card onClick={() => navigate('/wallet')} className="col-span-2 bg-[#1e293b]">
                    <div className="flex justify-between items-center">
                        <div>
                            <h4 className="text-white font-bold text-sm">Wallet & Ekub</h4>
                            <p className="text-gray-400 text-[10px]">Manage finances</p>
                        </div>
                        <div className="w-10 h-10 bg-gray-700 rounded-full flex items-center justify-center text-white">
                            <i className="fas fa-chevron-right"></i>
                        </div>
                    </div>
                </Card>
            </div>
        </div>
    );
};
