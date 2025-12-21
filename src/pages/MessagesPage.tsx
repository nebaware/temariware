import React, { useContext, useState } from 'react';
import { StoreContext } from '../contexts/StoreContext';
import { ToastContext } from '../contexts/ToastContext';
import { Avatar } from '../components/common/Avatar';
import { motion, AnimatePresence } from 'framer-motion';
import { contentModeration } from '../utils/contentModeration';
import { socketService } from '../services/socket';
import { api } from '../services/api';

export const MessagesPage: React.FC = () => {
    const { state, dispatch } = useContext(StoreContext);
    const { addToast } = useContext(ToastContext);
    const [selectedConv, setSelectedConv] = useState<string | null>(null);
    const [newMessage, setNewMessage] = useState('');
    const [typing, setTyping] = useState(false);

    React.useEffect(() => {
        socketService.onMessage((msg) => {
            dispatch({
                type: 'RECEIVE_MESSAGE',
                payload: {
                    senderId: msg.senderId,
                    text: msg.text
                }
            });
        });
        return () => socketService.offMessage();
    }, [dispatch]);

    const currentConv = state.conversations.find(c => c.id === selectedConv);

    const handleSend = async () => {
        if (!newMessage.trim() || !selectedConv || !state.user) return;

        // AI Content Moderation Check
        const moderationResult = contentModeration.moderateContent(newMessage);

        if (!moderationResult.allowed) {
            addToast(`Message blocked: ${moderationResult.reason}`, 'error');
            return;
        }

        const receiverId = selectedConv; // Assuming selectedConv ID is the receiver's ID for now

        try {
            // 1. Send to Backend (Persistence)
            await api.messages.sendMessage(receiverId, newMessage);

            // 2. Emit via Socket (Real-time)
            socketService.sendMessage({
                senderId: state.user.id,
                receiverId: receiverId,
                text: newMessage
            });

            // 3. Update Local State
            dispatch({
                type: 'SEND_MESSAGE',
                payload: {
                    conversationId: selectedConv,
                    text: newMessage
                }
            });

            setNewMessage('');
        } catch (error) {
            addToast('Failed to send message', 'error');
        }
    };

    if (selectedConv && currentConv) {
        return (
            <div className="flex flex-col h-screen bg-black">
                {/* Header */}
                <div className="bg-[#1e293b] border-b border-white/10 p-4 flex items-center gap-3">
                    <button onClick={() => setSelectedConv(null)} className="text-white">
                        <i className="fas fa-arrow-left"></i>
                    </button>
                    <Avatar src={currentConv.avatar} alt={currentConv.name} />
                    <div className="flex-1">
                        <h3 className="font-bold text-white">{currentConv.name}</h3>
                        <p className="text-xs text-gray-400">{typing ? 'typing...' : 'Active now'}</p>
                    </div>
                    <button className="text-gray-400 hover:text-white">
                        <i className="fas fa-ellipsis-v"></i>
                    </button>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-3 pb-24">
                    {currentConv.messages.map((msg, idx) => {
                        const isMe = msg.senderId === state.user?.id || msg.senderId === 'me';
                        return (
                            <motion.div
                                key={msg.id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}
                            >
                                <div className={`max-w-[70%] ${isMe ? 'bg-primary text-black' : 'bg-[#1e293b] text-white'} rounded-2xl px-4 py-2`}>
                                    <p className="text-sm">{msg.text}</p>
                                    <p className={`text-[10px] mt-1 ${isMe ? 'text-black/60' : 'text-gray-400'}`}>{msg.timestamp}</p>
                                </div>
                            </motion.div>
                        );
                    })}
                    {typing && (
                        <div className="flex justify-start">
                            <div className="bg-[#1e293b] rounded-2xl px-4 py-3">
                                <div className="flex gap-1">
                                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Input */}
                <div className="bg-[#1e293b] border-t border-white/10 p-4 pb-safe">
                    <div className="flex gap-2 items-center">
                        <button className="text-gray-400 hover:text-white">
                            <i className="fas fa-plus-circle text-xl"></i>
                        </button>
                        <input
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                            placeholder="Type a message..."
                            className="flex-1 bg-black/50 border border-gray-600 rounded-full px-4 py-2 text-sm text-white focus:border-primary outline-none"
                        />
                        <button
                            onClick={handleSend}
                            disabled={!newMessage.trim()}
                            className="bg-primary text-black w-10 h-10 rounded-full flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed hover:bg-white transition-colors"
                        >
                            <i className="fas fa-paper-plane"></i>
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="p-4 pb-24">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-white">Messages</h2>
                <button className="bg-primary text-black w-10 h-10 rounded-full flex items-center justify-center hover:bg-white transition-colors">
                    <i className="fas fa-edit"></i>
                </button>
            </div>

            <div className="space-y-2">
                {state.conversations.length === 0 ? (
                    <div className="text-center text-gray-500 py-12">
                        <i className="fas fa-comments text-5xl mb-3 opacity-50"></i>
                        <p className="text-sm">No conversations yet</p>
                        <p className="text-xs mt-1">Start networking to begin chatting</p>
                    </div>
                ) : (
                    state.conversations.map(c => (
                        <motion.div
                            key={c.id}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => setSelectedConv(c.id)}
                            className="flex items-center gap-3 bg-[#1e293b] p-4 rounded-xl border border-white/10 hover:border-primary/30 transition-colors cursor-pointer"
                        >
                            <div className="relative">
                                <Avatar src={c.avatar} alt={c.name} />
                                <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-[#1e293b]"></div>
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex justify-between items-start mb-1">
                                    <h4 className="font-bold text-white truncate">{c.name}</h4>
                                    <span className="text-xs text-gray-500 whitespace-nowrap ml-2">{c.lastMessageTime}</span>
                                </div>
                                <p className="text-sm text-gray-400 truncate">{c.lastMessage}</p>
                            </div>
                            {c.unreadCount > 0 && (
                                <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center text-black text-xs font-bold flex-shrink-0">
                                    {c.unreadCount}
                                </div>
                            )}
                        </motion.div>
                    ))
                )}
            </div>
        </div>
    );
};
