import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    children: React.ReactNode;
}

export const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children }) => {
    if (!isOpen) return null;
    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center bg-black/80 backdrop-blur-sm p-4">
                <motion.div initial={{ y: 100, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 100, opacity: 0 }} className="bg-[#1e293b] w-full max-w-lg rounded-3xl p-6 shadow-2xl max-h-[90vh] overflow-y-auto flex flex-col border border-white/10">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-xl font-bold text-white">{title}</h2>
                        <button onClick={onClose} className="w-8 h-8 rounded-full bg-white/10 text-white hover:bg-white/20 flex items-center justify-center transition-colors">&times;</button>
                    </div>
                    <div className="flex-1 overflow-y-auto no-scrollbar">{children}</div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
};
