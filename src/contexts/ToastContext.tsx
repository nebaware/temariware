import React, { createContext, useState, useContext } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

interface Toast { id: number; message: string; type: 'success' | 'error' | 'info'; }
export const ToastContext = createContext<{ addToast: (msg: string, type?: 'success' | 'error' | 'info') => void }>({ addToast: () => { } });

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [toasts, setToasts] = useState<Toast[]>([]);
    const addToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
        const id = Date.now();
        setToasts(prev => [...prev, { id, message, type }]);
        setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 3000);
    };
    return (
        <ToastContext.Provider value={{ addToast }}>
            {children}
            <div className="fixed top-20 right-4 z-[100] flex flex-col gap-2 pointer-events-none">
                <AnimatePresence>
                    {toasts.map(t => (
                        <motion.div key={t.id} initial={{ x: 50, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: 50, opacity: 0 }} className={`pointer-events-auto px-4 py-3 rounded-xl shadow-lg border ${t.type === 'success' ? 'bg-green-900/90 border-green-500/50 text-white' : t.type === 'error' ? 'bg-red-900/90 border-red-500/50 text-white' : 'bg-blue-900/90 border-blue-500/50 text-white'} flex items-center gap-3 backdrop-blur-md min-w-[250px]`}>
                            <i className={`fas ${t.type === 'success' ? 'fa-check-circle' : t.type === 'error' ? 'fa-exclamation-circle' : 'fa-info-circle'}`}></i>
                            <span className="text-sm font-bold">{t.message}</span>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>
        </ToastContext.Provider>
    );
};
