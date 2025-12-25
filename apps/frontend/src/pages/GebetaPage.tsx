import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { StoreContext } from '../contexts/StoreContext';
import { ToastContext } from '../contexts/ToastContext';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { Modal } from '../components/common/Modal';
import { generateStudyPlan, chatWithMentor } from '../services/geminiService';

export const GebetaPage: React.FC = () => {
    const { state, dispatch } = useContext(StoreContext);
    const { addToast } = useContext(ToastContext);
    const navigate = useNavigate();
    const [studyTopic, setStudyTopic] = useState('');
    const [studyPlan, setStudyPlan] = useState('');
    const [loadingAI, setLoadingAI] = useState(false);
    const [showAIChat, setShowAIChat] = useState(false);
    const [aiMessage, setAiMessage] = useState('');
    const [chatHistory, setChatHistory] = useState<{ role: 'user' | 'ai', text: string }[]>([]);

    const handleGenerateStudyPlan = async () => {
        if (!studyTopic) return;
        setLoadingAI(true);
        const plan = await generateStudyPlan(studyTopic);
        setStudyPlan(plan);
        setLoadingAI(false);
    };

    const handleSendMessage = async () => {
        if (!aiMessage) return;
        const userMsg = aiMessage;
        setChatHistory(prev => [...prev, { role: 'user', text: userMsg }]);
        setAiMessage('');
        const response = await chatWithMentor(userMsg, "Gebeta Learning Hub");
        setChatHistory(prev => [...prev, { role: 'ai', text: response }]);
    };

    const mealDeals = [
        { id: 'm1', name: 'Campus Cafe Combo', price: 150, credits: 50, image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400' },
        { id: 'm2', name: 'Student Lounge Pasta', price: 120, credits: 40, image: 'https://images.unsplash.com/photo-1473093226795-af9932fe5856?w=400' },
    ];

    const handleRedeem = (deal: any) => {
        if ((state.user?.xp || 0) < deal.credits) {
            addToast('Not enough credits! Study more to earn XP.', 'error');
            return;
        }
        addToast(`Successfully redeemed ${deal.name}! Show this to the vendor.`, 'success');
    };

    return (
        <div className="p-4 pb-32 max-w-md mx-auto">
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h2 className="text-2xl font-bold text-white">Gebeta <span className="text-primary">Learning</span></h2>
                    <p className="text-gray-400 text-xs mt-1">Study more, eat for less</p>
                </div>
                <Button onClick={() => navigate('/create-course')} variant="neon" className="!py-2 !px-4 !text-xs">
                    <i className="fas fa-plus mr-1"></i> Create
                </Button>
            </div>

            {/* Credit Info */}
            <Card className="bg-gradient-to-br from-primary/10 to-blue-500/10 border-primary/20 mb-6 !p-4">
                <div className="flex justify-between items-center">
                    <div>
                        <p className="text-[10px] text-gray-400 font-bold uppercase">Available Meal Credits</p>
                        <p className="text-2xl font-bold text-white">{Math.floor((state.user?.xp || 0) / 10)} <span className="text-xs text-primary font-normal">Credits</span></p>
                    </div>
                    <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center text-primary text-xl">
                        <i className="fas fa-utensils"></i>
                    </div>
                </div>
            </Card>

            {/* AI Study Buddy Section */}
            <h3 className="text-white font-bold mb-3 text-sm flex items-center gap-2">
                <i className="fas fa-robot text-secondary"></i> AI Study Buddy
            </h3>
            <Card className="bg-[#1e293b] border-secondary/20 mb-6 !p-4">
                <div className="space-y-4">
                    <p className="text-xs text-gray-400">Generate a custom study plan for any topic.</p>
                    <div className="flex gap-2">
                        <input
                            value={studyTopic}
                            onChange={(e) => setStudyTopic(e.target.value)}
                            placeholder="e.g. Data Structures, React hooks..."
                            className="flex-1 bg-black/50 border border-gray-600 rounded-xl px-3 py-2 text-xs text-white focus:border-secondary outline-none"
                        />
                        <Button onClick={handleGenerateStudyPlan} disabled={loadingAI || !studyTopic} variant="secondary" className="!py-2 !px-4 !text-xs">
                            {loadingAI ? <i className="fas fa-spinner fa-spin"></i> : 'Plan'}
                        </Button>
                    </div>

                    {studyPlan && (
                        <div className="mt-4 p-3 bg-black/30 rounded-xl border border-white/5 max-h-60 overflow-y-auto">
                            <div className="text-xs text-gray-300 leading-relaxed whitespace-pre-line">
                                {studyPlan}
                            </div>
                        </div>
                    )}
                </div>
            </Card>

            {/* Meal Deals */}
            <h3 className="text-white font-bold mb-3 text-sm flex items-center gap-2">
                <i className="fas fa-percent text-accent"></i> Discounted Meal Deals
            </h3>
            <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide mb-6">
                {mealDeals.map(deal => (
                    <div key={deal.id} className="min-w-[200px] bg-[#1e293b] rounded-2xl overflow-hidden border border-white/5 flex flex-col">
                        <img src={deal.image} className="w-full h-24 object-cover" />
                        <div className="p-3">
                            <h4 className="text-white font-bold text-xs mb-1">{deal.name}</h4>
                            <div className="flex justify-between items-center mt-2">
                                <span className="text-primary font-bold text-sm">{deal.price} ETB</span>
                                <button onClick={() => handleRedeem(deal)} className="bg-primary/10 text-primary text-[10px] font-bold px-2 py-1 rounded hover:bg-primary/20 transition-colors">
                                    {deal.credits} Credits
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <h3 className="text-white font-bold mb-3 text-sm flex items-center gap-2">
                <i className="fas fa-graduation-cap text-blue-400"></i> Active Courses
            </h3>
            <div className="grid grid-cols-1 gap-4">
                {state.courses.map(c => (
                    <Card key={c.id} className="!p-0 overflow-hidden shadow-xl border-white/5 bg-[#1e293b]/50">
                        <div className="relative">
                            <img src={c.thumbnail} className="w-full h-32 object-cover" />
                            <div className="absolute top-2 right-2 bg-black/60 backdrop-blur px-2 py-1 rounded text-[10px] text-white">
                                {c.enrolledCount} enrolled
                            </div>
                        </div>
                        <div className="p-4">
                            <h3 className="font-bold text-white text-sm">{c.title}</h3>
                            <p className="text-gray-400 text-[10px] mt-1 mb-3">{c.instructorName}</p>
                            <div className="flex justify-between items-center">
                                <div className="flex items-center gap-1">
                                    <i className="fas fa-star text-yellow-500 text-[10px]"></i>
                                    <span className="text-[10px] text-gray-300">4.8</span>
                                </div>
                                {state.user?.enrolledCourses?.includes(c.id) ? (
                                    <span className="text-xs font-bold text-green-500"><i className="fas fa-check-circle mr-1"></i> Enrolled</span>
                                ) : (
                                    <Button onClick={() => dispatch({ type: 'ENROLL_COURSE', payload: c.id })} variant="secondary" className="!py-1 !px-3 !text-[10px]">Enroll Now</Button>
                                )}
                            </div>
                        </div>
                    </Card>
                ))}
            </div>

            {/* AI Tutor Chat Floating Button */}
            <button
                onClick={() => setShowAIChat(true)}
                className="fixed bottom-24 right-6 w-14 h-14 bg-secondary text-white rounded-full shadow-2xl flex items-center justify-center hover:scale-110 transition-transform active:scale-95 z-40"
            >
                <i className="fas fa-comment-dots text-xl"></i>
            </button>

            {/* AI Chat Modal */}
            <Modal isOpen={showAIChat} onClose={() => setShowAIChat(false)} title="AI Mentor Chat">
                <div className="flex flex-col h-[400px]">
                    <div className="flex-1 overflow-y-auto space-y-3 p-2">
                        {chatHistory.length === 0 && (
                            <div className="text-center text-gray-500 py-10">
                                <i className="fas fa-robot text-4xl mb-3"></i>
                                <p className="text-sm">Hi! I'm your AI Study Mentor. How can I help you learn today?</p>
                            </div>
                        )}
                        {chatHistory.map((msg, i) => (
                            <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                <div className={`max-w-[80%] p-3 rounded-2xl text-xs ${msg.role === 'user' ? 'bg-secondary text-white rounded-tr-none' : 'bg-white/10 text-gray-200 rounded-tl-none'}`}>
                                    {msg.text}
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="p-4 border-t border-white/10 flex gap-2">
                        <input
                            value={aiMessage}
                            onChange={(e) => setAiMessage(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                            placeholder="Ask a question..."
                            className="flex-1 bg-black/50 border border-gray-600 rounded-xl px-4 py-2 text-xs text-white outline-none focus:border-secondary"
                        />
                        <button onClick={handleSendMessage} className="bg-secondary text-white px-4 rounded-xl">
                            <i className="fas fa-paper-plane text-xs"></i>
                        </button>
                    </div>
                </div>
            </Modal>
        </div>
    );
};

