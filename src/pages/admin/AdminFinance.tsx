import React from 'react';
import { Card } from '../../components/common/Card';

export const AdminFinance: React.FC = () => {
    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold text-white mb-4">Finance Console</h2>
            <div className="grid md:grid-cols-3 gap-4">
                <Card>
                    <p className="text-xs text-gray-400 uppercase">Platform Profit</p>
                    <h3 className="text-2xl font-bold text-white">45,200 ETB</h3>
                </Card>
                <Card>
                    <p className="text-xs text-gray-400 uppercase">Pending Withdrawals</p>
                    <h3 className="text-2xl font-bold text-white">12</h3>
                </Card>
                <Card>
                    <p className="text-xs text-gray-400 uppercase">Escrow Held</p>
                    <h3 className="text-2xl font-bold text-white">120,000 ETB</h3>
                </Card>
            </div>
            <div className="bg-[#1e293b] p-4 rounded-xl border border-white/10">
                <h3 className="font-bold text-white mb-4">Transaction Log</h3>
                <div className="space-y-2">
                    {[1, 2, 3].map(i => (
                        <div key={i} className="flex justify-between items-center p-3 bg-black/20 rounded-lg">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-green-500/20 text-green-500 flex items-center justify-center">
                                    <i className="fas fa-arrow-down"></i>
                                </div>
                                <div>
                                    <p className="text-sm font-bold text-white">Commission Fee</p>
                                    <p className="text-xs text-gray-500">From Job #j{i}23</p>
                                </div>
                            </div>
                            <span className="text-green-400 font-bold">+150 ETB</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};
