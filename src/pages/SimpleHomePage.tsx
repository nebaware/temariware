import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import { StoreContext } from '../contexts/StoreContext';
import { ToastContext } from '../contexts/ToastContext';
import { UserRole } from '../types';

export const SimpleHomePage: React.FC = () => {
    const navigate = useNavigate();
    const { state } = useContext(StoreContext);
    const { addToast } = useContext(ToastContext);

    return (
        <div className="min-h-screen bg-black text-white p-4">
            <div className="max-w-md mx-auto">
                {/* Header */}
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-primary mb-2">TemariWare</h1>
                    <p className="text-gray-400">Student Ecosystem Platform</p>
                </div>

                {/* User Info */}
                <div className="bg-gray-800 rounded-lg p-4 mb-6">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center text-black font-bold">
                            DU
                        </div>
                        <div>
                            <h2 className="font-bold">Demo User</h2>
                            <p className="text-sm text-gray-400">Level 1 Student</p>
                        </div>
                    </div>
                    <div className="bg-gray-700 rounded p-3">
                        <p className="text-sm text-gray-400">Wallet Balance</p>
                        <p className="text-xl font-bold text-primary">1,250 ETB</p>
                    </div>
                </div>

                {/* Admin Panel Access */}
                {state.user?.role === 'Admin' && (
                    <div className="mb-6">
                        <button 
                            onClick={() => {
                                console.log('Admin button clicked');
                                navigate('/admin');
                            }}
                            className="w-full bg-red-600 hover:bg-red-700 p-4 rounded-lg text-center transition-colors"
                        >
                            <div className="text-2xl mb-2">⚙️</div>
                            <div className="font-bold">Admin Panel</div>
                            <div className="text-xs text-red-200">Manage Platform</div>
                        </button>
                    </div>
                )}

                {/* Quick Actions */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                    <button 
                        onClick={() => {
                            console.log('Work button clicked');
                            navigate('/work');
                        }}
                        className="bg-green-600 hover:bg-green-700 p-4 rounded-lg text-center transition-colors"
                    >
                        <div className="text-2xl mb-2">💼</div>
                        <div className="font-bold">Jobs</div>
                        <div className="text-xs text-green-200">AI Matching</div>
                    </button>
                    
                    <button 
                        onClick={() => {
                            console.log('Gebeta button clicked');
                            navigate('/gebeta');
                        }}
                        className="bg-blue-600 hover:bg-blue-700 p-4 rounded-lg text-center transition-colors"
                    >
                        <div className="text-2xl mb-2">📚</div>
                        <div className="font-bold">Courses</div>
                        <div className="text-xs text-blue-200">Learn Skills</div>
                    </button>
                    
                    <button 
                        onClick={() => {
                            console.log('Wallet button clicked');
                            navigate('/wallet');
                        }}
                        className="bg-purple-600 hover:bg-purple-700 p-4 rounded-lg text-center transition-colors"
                    >
                        <div className="text-2xl mb-2">💰</div>
                        <div className="font-bold">Wallet</div>
                        <div className="text-xs text-purple-200">ETB Payments</div>
                    </button>
                    
                    <button 
                        onClick={() => {
                            console.log('Profile button clicked');
                            navigate('/profile');
                        }}
                        className="bg-orange-600 hover:bg-orange-700 p-4 rounded-lg text-center transition-colors"
                    >
                        <div className="text-2xl mb-2">👤</div>
                        <div className="font-bold">Profile</div>
                        <div className="text-xs text-orange-200">Portfolio</div>
                    </button>
                </div>

                {/* Additional Features */}
                <div className="grid grid-cols-3 gap-3 mb-6">
                    <button 
                        onClick={() => navigate('/resume-builder')}
                        className="bg-indigo-600 hover:bg-indigo-700 p-3 rounded-lg text-center transition-colors"
                    >
                        <div className="text-lg mb-1">📄</div>
                        <div className="text-xs font-bold">Resume</div>
                    </button>
                    
                    <button 
                        onClick={() => navigate('/ekub')}
                        className="bg-yellow-600 hover:bg-yellow-700 p-3 rounded-lg text-center transition-colors"
                    >
                        <div className="text-lg mb-1">🤝</div>
                        <div className="text-xs font-bold">Ekub</div>
                    </button>
                    
                    <button 
                        onClick={() => navigate('/messages')}
                        className="bg-pink-600 hover:bg-pink-700 p-3 rounded-lg text-center transition-colors"
                    >
                        <div className="text-lg mb-1">💬</div>
                        <div className="text-xs font-bold">Chat</div>
                    </button>
                </div>

                {/* New Roadmap Features */}
                <div className="mb-6">
                    <h3 className="text-lg font-bold mb-3 text-primary">New Features</h3>
                    <div className="grid grid-cols-2 gap-3">
                        <button 
                            onClick={() => navigate('/advanced-portfolio')}
                            className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 p-4 rounded-lg text-center transition-colors"
                        >
                            <div className="text-2xl mb-2">🎨</div>
                            <div className="font-bold text-sm">Portfolio Builder</div>
                            <div className="text-xs text-purple-200">AI-Powered</div>
                        </button>
                        
                        <button 
                            onClick={() => navigate('/mentorship')}
                            className="bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700 p-4 rounded-lg text-center transition-colors"
                        >
                            <div className="text-2xl mb-2">🤝</div>
                            <div className="font-bold text-sm">Mentorship</div>
                            <div className="text-xs text-green-200">Find Mentors</div>
                        </button>
                        
                        <button 
                            onClick={() => navigate('/video/demo-room')}
                            className="bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 p-4 rounded-lg text-center transition-colors"
                        >
                            <div className="text-2xl mb-2">📹</div>
                            <div className="font-bold text-sm">Video Calls</div>
                            <div className="text-xs text-red-200">Live Sessions</div>
                        </button>
                        
                        <button 
                            onClick={() => addToast('Coming Soon!', 'info')}
                            className="bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 p-4 rounded-lg text-center transition-colors"
                        >
                            <div className="text-2xl mb-2">🚀</div>
                            <div className="font-bold text-sm">More Features</div>
                            <div className="text-xs text-gray-300">Coming Soon</div>
                        </button>
                    </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-3 mb-6">
                    <div className="bg-gray-800 p-3 rounded text-center">
                        <div className="text-lg font-bold text-yellow-400">120</div>
                        <div className="text-xs text-gray-400">XP/Hour</div>
                    </div>
                    <div className="bg-gray-800 p-3 rounded text-center">
                        <div className="text-lg font-bold text-blue-400">5</div>
                        <div className="text-xs text-gray-400">Streak</div>
                    </div>
                    <div className="bg-gray-800 p-3 rounded text-center">
                        <div className="text-lg font-bold text-green-400">12</div>
                        <div className="text-xs text-gray-400">Tasks</div>
                    </div>
                </div>

                {/* Daily Claim */}
                <div className="bg-gradient-to-r from-primary/20 to-blue-500/20 border border-primary/30 rounded-lg p-6 text-center">
                    <div className="text-4xl mb-2">🎁</div>
                    <h3 className="font-bold mb-2">Daily Reward</h3>
                    <p className="text-sm text-gray-400 mb-4">Claim your daily bonus</p>
                    <button 
                        onClick={() => {
                            console.log('Daily claim button clicked');
                            alert('Daily reward claimed! +150 ETB');
                        }}
                        className="bg-primary text-black px-6 py-2 rounded font-bold hover:bg-primary/90 transition-colors"
                    >
                        Claim Activity Reward
                    </button>
                </div>

                {/* Bottom Navigation Space */}
                <div className="h-20"></div>
            </div>
        </div>
    );
};