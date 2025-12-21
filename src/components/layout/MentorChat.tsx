import React, { useState, useRef, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { chatWithMentor } from '../../services/geminiService';

export const MentorChat: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<{ role: 'user' | 'ai', text: string }[]>([]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const handleSend = async () => {
        if (!input.trim()) return;
        const userMsg = input;
        setInput('');
        setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
        setLoading(true);
        const response = await chatWithMentor(userMsg, "User is a student in Ethiopia using TemariWare.");
        setMessages(prev => [...prev, { role: 'ai', text: response }]);
        setLoading(false);
    };

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    return (
        <>
            <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={() => setIsOpen(true)} className="fixed bottom-24 right-4 w-14 h-14 bg-gradient-to-tr from-primary to-blue-500 rounded-full shadow-[0_0_20px_rgba(20,241,149,0.4)] flex items-center justify-center text-black text-2xl z-40">
                <i className="fas fa-robot"></i>
            </motion.button>
            <AnimatePresence>
                {isOpen && (
                    <motion.div initial={{ opacity: 0, y: 50, scale: 0.9 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 50, scale: 0.9 }} className="fixed bottom-28 right-4 w-80 sm:w-96 h-[500px] bg-[#1e293b] border border-white/20 rounded-3xl shadow-2xl flex flex-col z-50 overflow-hidden">
                        <div className="p-4 bg-gradient-to-r from-gray-900 to-gray-800 border-b border-white/10 flex justify-between items-center">
                            <div className="flex items-center gap-2">
                                <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-black text-xs font-bold"><i className="fas fa-robot"></i></div>
                                <div>
                                    <h3 className="font-bold text-white text-sm">TemariGuide AI</h3>
                                    <span className="text-[10px] text-primary flex items-center gap-1"><span className="w-1.5 h-1.5 bg-primary rounded-full animate-pulse"></span> Online</span>
                                </div>
                            </div>
                            <button onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-white"><i className="fas fa-times"></i></button>
                        </div>
                        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-black/20">
                            {messages.length === 0 && (
                                <div className="text-center text-gray-500 text-xs mt-10">
                                    <i className="fas fa-sparkles text-2xl mb-2 text-primary/50"></i>
                                    <p>Ask me about your career, studies, or how to use the app!</p>
                                </div>
                            )}
                            {messages.map((m, i) => (
                                <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                    <div className={`max-w-[80%] p-3 rounded-2xl text-sm ${m.role === 'user' ? 'bg-primary text-black rounded-tr-sm' : 'bg-gray-700 text-white rounded-tl-sm'}`}>{m.text}</div>
                                </div>
                            ))}
                            {loading && (
                                <div className="flex justify-start">
                                    <div className="bg-gray-700 text-white p-3 rounded-2xl rounded-tl-sm flex gap-1">
                                        <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"></span>
                                        <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce delay-75"></span>
                                        <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce delay-150"></span>
                                    </div>
                                </div>
                            )}
                            <div ref={messagesEndRef} />
                        </div>
                        <div className="p-3 bg-gray-800 border-t border-white/10 flex gap-2">
                            <input value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleSend()} placeholder="Type a message..." className="flex-1 bg-black/50 border border-gray-600 rounded-xl px-3 py-2 text-sm text-white focus:border-primary outline-none" />
                            <button onClick={handleSend} disabled={!input.trim() || loading} className="w-10 h-10 bg-primary rounded-xl text-black flex items-center justify-center hover:bg-white transition-colors disabled:opacity-50"><i className="fas fa-paper-plane"></i></button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};
