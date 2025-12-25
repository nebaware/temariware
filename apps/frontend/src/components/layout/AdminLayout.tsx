import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';

export const AdminLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const navItems = [
        { path: '/admin', icon: 'fa-chart-pie', label: 'Overview' },
        { path: '/admin/users', icon: 'fa-users', label: 'Users' },
        { path: '/admin/verifications', icon: 'fa-id-card', label: 'Verifications' },
        { path: '/admin/jobs', icon: 'fa-briefcase', label: 'Jobs' },
        { path: '/admin/finance', icon: 'fa-wallet', label: 'Finance' },
        { path: '/admin/logs', icon: 'fa-file-alt', label: 'Audit Logs' }
    ];

    return (
        <div className="min-h-screen bg-black text-gray-100 font-sans flex">
            <div className="w-64 bg-[#1e293b] border-r border-white/10 flex flex-col hidden md:flex">
                <div className="p-6 border-b border-white/10">
                    <h1 className="text-xl font-bold text-white tracking-widest">TEMARI<span className="text-primary">ADMIN</span></h1>
                </div>
                <nav className="flex-1 p-4 space-y-2">
                    {navItems.map(item => (
                        <Link key={item.path} to={item.path}>
                            <div className={`p-3 rounded-xl flex items-center gap-3 transition-all ${location.pathname === item.path ? 'bg-primary text-black font-bold' : 'text-gray-400 hover:bg-white/5 hover:text-white'}`}>
                                <i className={`fas ${item.icon} w-5 text-center`}></i>
                                <span>{item.label}</span>
                            </div>
                        </Link>
                    ))}
                </nav>
                <div className="p-4 border-t border-white/10">
                    <button onClick={() => navigate('/')} className="w-full p-3 rounded-xl border border-white/10 text-gray-400 hover:text-white text-sm flex items-center justify-center gap-2">
                        <i className="fas fa-arrow-left"></i> Back to App
                    </button>
                </div>
            </div>
            <div className="md:hidden fixed top-0 w-full bg-[#1e293b] z-50 border-b border-white/10 p-4 flex justify-between items-center">
                <span className="font-bold">ADMIN PANEL</span>
                <button onClick={() => navigate('/')} className="text-sm">Exit</button>
            </div>
            <div className="flex-1 overflow-y-auto p-6 pt-20 md:pt-6">
                {children}
            </div>
        </div>
    );
};
