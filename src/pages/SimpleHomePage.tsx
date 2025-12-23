import React from 'react';
import { useNavigate } from 'react-router-dom';

export const SimpleHomePage: React.FC = () => {
    const navigate = useNavigate();

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

                {/* Quick Actions */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                    <button 
                        onClick={() => navigate('/work')}
                        className="bg-green-600 hover:bg-green-700 p-4 rounded-lg text-center transition-colors"
                    >
                        <div className="text-2xl mb-2">💼</div>
                        <div className="font-bold">Jobs</div>
                        <div className="text-xs text-green-200">Find Work</div>
                    </button>
                    
                    <button 
                        onClick={() => navigate('/gebeta')}
                        className="bg-blue-600 hover:bg-blue-700 p-4 rounded-lg text-center transition-colors"
                    >
                        <div className="text-2xl mb-2">📚</div>
                        <div className="font-bold">Courses</div>
                        <div className="text-xs text-blue-200">Learn Skills</div>
                    </button>
                    
                    <button 
                        onClick={() => navigate('/wallet')}
                        className="bg-purple-600 hover:bg-purple-700 p-4 rounded-lg text-center transition-colors"
                    >
                        <div className="text-2xl mb-2">💰</div>
                        <div className="font-bold">Wallet</div>
                        <div className="text-xs text-purple-200">Manage Money</div>
                    </button>
                    
                    <button 
                        onClick={() => navigate('/profile')}
                        className="bg-orange-600 hover:bg-orange-700 p-4 rounded-lg text-center transition-colors"
                    >
                        <div className="text-2xl mb-2">👤</div>
                        <div className="font-bold">Profile</div>
                        <div className="text-xs text-orange-200">Your Info</div>
                    </button>
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
                    <button className="bg-primary text-black px-6 py-2 rounded font-bold hover:bg-primary/90 transition-colors">
                        Claim 150 ETB
                    </button>
                </div>

                {/* Bottom Navigation Space */}
                <div className="h-20"></div>
            </div>
        </div>
    );
};