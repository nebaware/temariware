import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { StoreContext } from '../contexts/StoreContext';
import { ToastContext } from '../contexts/ToastContext';
import { Button } from '../components/common/Button';
import { Card } from '../components/common/Card';

export const VideoConferencePage: React.FC = () => {
    const { roomId } = useParams<{ roomId: string }>();
    const navigate = useNavigate();
    const { state } = useContext(StoreContext);
    const { addToast } = useContext(ToastContext);
    const [isConnected, setIsConnected] = useState(false);
    const [participants, setParticipants] = useState<string[]>([]);
    const [isMuted, setIsMuted] = useState(false);
    const [isVideoOff, setIsVideoOff] = useState(false);
    const [chatMessages, setChatMessages] = useState<Array<{id: string, user: string, message: string, time: string}>>([]);
    const [newMessage, setNewMessage] = useState('');

    useEffect(() => {
        // Simulate connection
        setTimeout(() => {
            setIsConnected(true);
            setParticipants(['You', 'Mentor John', 'Student Sarah']);
            addToast('Connected to video conference', 'success');
        }, 2000);
    }, []);

    const handleSendMessage = () => {
        if (!newMessage.trim()) return;
        const message = {
            id: Date.now().toString(),
            user: state.user?.name || 'You',
            message: newMessage,
            time: new Date().toLocaleTimeString()
        };
        setChatMessages(prev => [...prev, message]);
        setNewMessage('');
    };

    const handleLeaveCall = () => {
        addToast('Left video conference', 'info');
        navigate('/messages');
    };

    return (
        <div className="min-h-screen bg-black text-white p-4">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h1 className="text-2xl font-bold">Video Conference</h1>
                        <p className="text-gray-400">Room: {roomId}</p>
                    </div>
                    <Button onClick={handleLeaveCall} variant="outline" className="!bg-red-600 !border-red-600">
                        <i className="fas fa-phone-slash mr-2"></i>Leave Call
                    </Button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                    {/* Main Video Area */}
                    <div className="lg:col-span-3">
                        <Card className="h-96 lg:h-[500px] relative overflow-hidden">
                            {!isConnected ? (
                                <div className="flex items-center justify-center h-full">
                                    <div className="text-center">
                                        <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
                                        <p className="text-gray-400">Connecting to video conference...</p>
                                    </div>
                                </div>
                            ) : (
                                <div className="grid grid-cols-2 gap-2 h-full p-4">
                                    {/* Main Speaker */}
                                    <div className="col-span-2 bg-gray-800 rounded-lg flex items-center justify-center relative">
                                        <div className="text-center">
                                            <div className="w-20 h-20 bg-primary rounded-full flex items-center justify-center text-black font-bold text-2xl mb-2">
                                                MJ
                                            </div>
                                            <p className="font-bold">Mentor John</p>
                                            <p className="text-xs text-gray-400">Speaking</p>
                                        </div>
                                        <div className="absolute top-4 left-4 bg-green-500 text-white px-2 py-1 rounded text-xs">
                                            <i className="fas fa-microphone mr-1"></i>Live
                                        </div>
                                    </div>
                                    
                                    {/* Participants */}
                                    <div className="bg-gray-700 rounded-lg flex items-center justify-center">
                                        <div className="text-center">
                                            <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold mb-1">
                                                SS
                                            </div>
                                            <p className="text-sm">Sarah</p>
                                        </div>
                                    </div>
                                    
                                    <div className="bg-gray-700 rounded-lg flex items-center justify-center relative">
                                        <div className="text-center">
                                            <div className="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center text-white font-bold mb-1">
                                                {state.user?.name?.charAt(0) || 'Y'}
                                            </div>
                                            <p className="text-sm">You</p>
                                        </div>
                                        {isMuted && (
                                            <div className="absolute top-2 right-2 bg-red-500 rounded-full p-1">
                                                <i className="fas fa-microphone-slash text-xs"></i>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}
                        </Card>

                        {/* Controls */}
                        <div className="flex justify-center gap-4 mt-4">
                            <Button
                                onClick={() => setIsMuted(!isMuted)}
                                variant={isMuted ? "outline" : "primary"}
                                className={`!rounded-full !w-12 !h-12 ${isMuted ? '!bg-red-600 !border-red-600' : ''}`}
                            >
                                <i className={`fas ${isMuted ? 'fa-microphone-slash' : 'fa-microphone'}`}></i>
                            </Button>
                            <Button
                                onClick={() => setIsVideoOff(!isVideoOff)}
                                variant={isVideoOff ? "outline" : "primary"}
                                className={`!rounded-full !w-12 !h-12 ${isVideoOff ? '!bg-red-600 !border-red-600' : ''}`}
                            >
                                <i className={`fas ${isVideoOff ? 'fa-video-slash' : 'fa-video'}`}></i>
                            </Button>
                            <Button variant="outline" className="!rounded-full !w-12 !h-12">
                                <i className="fas fa-desktop"></i>
                            </Button>
                            <Button variant="outline" className="!rounded-full !w-12 !h-12">
                                <i className="fas fa-cog"></i>
                            </Button>
                        </div>
                    </div>

                    {/* Chat Sidebar */}
                    <div className="lg:col-span-1">
                        <Card className="h-96 lg:h-[500px] flex flex-col">
                            <div className="p-4 border-b border-gray-700">
                                <h3 className="font-bold">Chat</h3>
                                <p className="text-xs text-gray-400">{participants.length} participants</p>
                            </div>
                            
                            <div className="flex-1 p-4 overflow-y-auto space-y-3">
                                {chatMessages.map(msg => (
                                    <div key={msg.id} className="text-sm">
                                        <div className="flex justify-between items-start mb-1">
                                            <span className="font-bold text-primary">{msg.user}</span>
                                            <span className="text-xs text-gray-500">{msg.time}</span>
                                        </div>
                                        <p className="text-gray-300">{msg.message}</p>
                                    </div>
                                ))}
                                {chatMessages.length === 0 && (
                                    <p className="text-gray-500 text-center text-sm">No messages yet</p>
                                )}
                            </div>
                            
                            <div className="p-4 border-t border-gray-700">
                                <div className="flex gap-2">
                                    <input
                                        value={newMessage}
                                        onChange={(e) => setNewMessage(e.target.value)}
                                        onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                                        placeholder="Type a message..."
                                        className="flex-1 bg-gray-800 border border-gray-600 rounded px-3 py-2 text-sm text-white focus:border-primary outline-none"
                                    />
                                    <Button onClick={handleSendMessage} className="!py-2 !px-3">
                                        <i className="fas fa-paper-plane"></i>
                                    </Button>
                                </div>
                            </div>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
};