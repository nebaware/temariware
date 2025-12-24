import React, { useContext } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LanguageContext } from '../../contexts/LanguageContext';

export const BottomNav: React.FC = () => {
    const { t } = useContext(LanguageContext);
    const location = useLocation();
    const hiddenPaths = ['/login', '/register', '/live', '/workspace', '/admin', '/messages', '/resume-builder'];
    if (hiddenPaths.some(p => location.pathname.startsWith(p))) return null;

    const navs = [
        { p: '/', i: 'fa-house', l: 'Home' },
        { p: '/work', i: 'fa-briefcase', l: 'Work' },
        { p: '/gebeta', i: 'fa-graduation-cap', l: 'Gebeta' },
        { p: '/wallet', i: 'fa-wallet', l: 'Wallet' },
        { p: '/profile', i: 'fa-user', l: 'Me' }
    ];

    return (
        <div className="fixed bottom-4 left-4 right-4 z-50">
            <nav className="bg-[#1e293b]/90 backdrop-blur-xl border border-white/10 rounded-2xl p-2 flex justify-between items-center shadow-2xl">
                {navs.map(n => (
                    <Link key={n.p} to={n.p} className="flex-1">
                        <div className={`flex flex-col items-center gap-1 p-2 rounded-xl transition-all active:scale-95 ${location.pathname === n.p ? 'bg-primary text-black shadow-[0_0_15px_rgba(20,241,149,0.4)]' : 'text-gray-400 hover:text-white'}`}>
                            <i className={`fas ${n.i} text-lg`}></i>
                            <span className="text-[9px] font-bold">{t(n.l)}</span>
                        </div>
                    </Link>
                ))}
            </nav>
        </div>
    );
}
