import React, { useContext, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { StoreContext } from '../contexts/StoreContext';
import { Avatar } from '../components/common/Avatar';
import { motion, AnimatePresence } from 'framer-motion';

const MOCK_PARTICIPANTS = [
    { id: '1', name: 'Abebe K.', avatar: 'https://i.pravatar.cc/150?img=1', isMuted: false, isVideoOff: false },
    { id: '2', name: 'Sara M.', avatar: 'https://i.pravatar.cc/150?img=5', isMuted: true, isVideoOff: false },
    { id: '3', name: 'Daniel T.', avatar: 'https://i.pravatar.cc/150?img=3', isMuted: false, isVideoOff: true },
];

export const LiveClassRoom: React.FC = () => {
    const { id } = useParams();
    const { state } = useContext(StoreContext);
    const navigate = useNavigate();
    const session = state.liveSessions.find(s => s.id === id);
    const [isMuted, setIsMuted] = useState(false);
    const [isVideoOff, setIsVideoOff] = useState(false);
    const [showChat, setShowChat] = useState(false);
    const [showParticipants, setShowParticipants] = useState(false);
    const [chatMessages, setChatMessages] = useState([
        { id: '1', sender: 'Instructor', text: 'Welcome everyone!', time: '10:00 AM' },
        { id: '2', sender: 'Abebe K.', text: 'Thank you!', time: '10:01 AM' },
    ]);
    const [newMessage, setNewMessage] = useState('');
    const [localStream, setLocalStream] = useState<MediaStream | null>(null);
    const localVideoRef = React.useRef<HTMLVideoElement>(null);
    const remoteVideoRef = React.useRef<HTMLVideoElement>(null);

    React.useEffect(() => {
        const startStream = async () => {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
                setLocalStream(stream);
                if (localVideoRef.current) {
                    localVideoRef.current.srcObject = stream;
                }
            } catch (err) {
                console.error("Failed to get local stream", err);
            }
        };
        startStream();

        return () => {
            localStream?.getTracks().forEach(track => track.stop());
        };
    }, []);

    const toggleMute = () => {
        if (localStream) {
            localStream.getAudioTracks().forEach(track => track.enabled = !track.enabled);
            setIsMuted(!isMuted);
        }
    };

    const toggleVideo = () => {
        if (localStream) {
            localStream.getVideoTracks().forEach(track => track.enabled = !track.enabled);
            setIsVideoOff(!isVideoOff);
        }
    };

    if (!session) return <div className="p-8 text-white">Session ended or not found.</div>;

    const handleSendMessage = () => {
        if (!newMessage.trim()) return;
        setChatMessages([...chatMessages, {
            id: Date.now().toString(),
            sender: 'You',
            text: newMessage,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }]);
        setNewMessage('');
    };

    return (
        <div className="h-screen bg-black flex flex-col">
            {/* Main Video Area */}
            <div className="flex-1 bg-gray-900 relative">
                {/* Host/Remote Video */}
                <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-gray-900 to-black">
                    <video
                        ref={remoteVideoRef}
                        autoPlay
                        className="w-full h-full object-cover"
                        poster={session.hostAvatar}
                    />
                    {!remoteVideoRef.current?.srcObject && (
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                            <Avatar src={session.hostAvatar} size="xl" className="mb-4 animate-pulse border-4 border-primary" />
                            <h2 className="text-2xl font-bold text-white mb-2">{session.title}</h2>
                            <p className="text-gray-400 text-sm mb-2">Hosted by {session.host}</p>
                            <div className="flex items-center justify-center gap-2">
                                <span className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></span>
                                <span className="text-red-500 font-bold text-sm">LIVE</span>
                                <span className="text-gray-500 text-sm">• {session.viewers} watching</span>
                            </div>
                        </div>
                    )}
                </div>

                {/* Recording Indicator */}
                <div className="absolute top-4 left-4 bg-red-500/20 border border-red-500 px-3 py-1 rounded-full flex items-center gap-2">
                    <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                    <span className="text-red-500 text-xs font-bold">Recording</span>
                </div>

                {/* Participant Count */}
                <button
                    onClick={() => setShowParticipants(!showParticipants)}
                    className="absolute top-4 right-4 bg-black/50 backdrop-blur-sm px-4 py-2 rounded-full text-white text-sm hover:bg-black/70 transition-colors"
                >
                    <i className="fas fa-users mr-2"></i>
                    {MOCK_PARTICIPANTS.length + 1} participants
                </button>

                {/* Self View */}
                <div className="absolute bottom-4 right-4 w-48 h-32 bg-black border-2 border-gray-700 rounded-xl overflow-hidden z-10">
                    {isVideoOff ? (
                        <div className="w-full h-full bg-gray-800 flex items-center justify-center">
                            <i className="fas fa-video-slash text-gray-500 text-2xl"></i>
                        </div>
                    ) : (
                        <video
                            ref={localVideoRef}
                            autoPlay
                            muted
                            className="w-full h-full object-cover"
                        />
                    )}
                    <div className="absolute bottom-2 left-2 text-xs text-white bg-black/50 px-2 py-1 rounded">You</div>
                    {isMuted && <div className="absolute top-2 right-2 text-red-500 bg-black/50 p-1 rounded-full"><i className="fas fa-microphone-slash"></i></div>}
                </div>

                {/* Participants Panel */}
                <AnimatePresence>
                    {showParticipants && (
                        <motion.div
                            initial={{ x: 300 }}
                            animate={{ x: 0 }}
                            exit={{ x: 300 }}
                            className="absolute right-0 top-0 bottom-0 w-80 bg-[#1e293b] border-l border-white/10 p-4 overflow-y-auto"
                        >
                            <h3 className="text-white font-bold mb-4">Participants ({MOCK_PARTICIPANTS.length + 1})</h3>
                            <div className="space-y-2">
                                <div className="flex items-center gap-3 p-2 rounded-lg bg-primary/10 border border-primary/30">
                                    <Avatar src={session.hostAvatar} size="sm" />
                                    <div className="flex-1">
                                        <p className="text-white text-sm font-bold">{session.host} (Host)</p>
                                    </div>
                                    <i className="fas fa-crown text-primary"></i>
                                </div>
                                {MOCK_PARTICIPANTS.map(p => (
                                    <div key={p.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/5">
                                        <Avatar src={p.avatar} size="sm" />
                                        <div className="flex-1">
                                            <p className="text-white text-sm">{p.name}</p>
                                        </div>
                                        <div className="flex gap-1 text-gray-400 text-xs">
                                            {p.isMuted && <i className="fas fa-microphone-slash"></i>}
                                            {p.isVideoOff && <i className="fas fa-video-slash"></i>}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Chat Panel */}
                <AnimatePresence>
                    {showChat && (
                        <motion.div
                            initial={{ y: 300 }}
                            animate={{ y: 0 }}
                            exit={{ y: 300 }}
                            className="absolute bottom-20 left-4 w-80 h-96 bg-[#1e293b] rounded-xl border border-white/10 flex flex-col"
                        >
                            <div className="p-3 border-b border-white/10 flex justify-between items-center">
                                <h3 className="text-white font-bold text-sm">Chat</h3>
                                <button onClick={() => setShowChat(false)} className="text-gray-400 hover:text-white">
                                    <i className="fas fa-times"></i>
                                </button>
                            </div>
                            <div className="flex-1 overflow-y-auto p-3 space-y-2">
                                {chatMessages.map(msg => (
                                    <div key={msg.id} className="text-xs">
                                        <span className="font-bold text-primary">{msg.sender}</span>
                                        <span className="text-gray-500 ml-2">{msg.time}</span>
                                        <p className="text-white mt-1">{msg.text}</p>
                                    </div>
                                ))}
                            </div>
                            <div className="p-3 border-t border-white/10 flex gap-2">
                                <input
                                    value={newMessage}
                                    onChange={(e) => setNewMessage(e.target.value)}
                                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                                    placeholder="Type a message..."
                                    className="flex-1 bg-black/50 border border-gray-600 rounded-lg px-3 py-2 text-xs text-white focus:border-primary outline-none"
                                />
                                <button onClick={handleSendMessage} className="bg-primary text-black px-3 rounded-lg hover:bg-white transition-colors">
                                    <i className="fas fa-paper-plane text-xs"></i>
                                </button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Controls */}
            <div className="h-20 bg-[#1e293b] flex items-center justify-center gap-4 px-4">
                <button
                    onClick={toggleMute}
                    className={`w-12 h-12 rounded-full ${isMuted ? 'bg-red-500' : 'bg-gray-700'} text-white hover:opacity-80 transition-all`}
                >
                    <i className={`fas fa-microphone${isMuted ? '-slash' : ''}`}></i>
                </button>
                <button
                    onClick={toggleVideo}
                    className={`w-12 h-12 rounded-full ${isVideoOff ? 'bg-red-500' : 'bg-gray-700'} text-white hover:opacity-80 transition-all`}
                >
                    <i className={`fas fa-video${isVideoOff ? '-slash' : ''}`}></i>
                </button>
                <button
                    onClick={() => navigate('/')}
                    className="w-14 h-14 rounded-full bg-red-500 text-white hover:bg-red-600 transition-all"
                >
                    <i className="fas fa-phone-slash"></i>
                </button>
                <button className="w-12 h-12 rounded-full bg-gray-700 text-white hover:bg-gray-600 transition-all">
                    <i className="fas fa-hand-paper"></i>
                </button>
                <button
                    onClick={() => setShowChat(!showChat)}
                    className={`w-12 h-12 rounded-full ${showChat ? 'bg-primary text-black' : 'bg-gray-700 text-white'} hover:opacity-80 transition-all relative`}
                >
                    <i className="fas fa-comment-alt"></i>
                    {chatMessages.length > 2 && !showChat && (
                        <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full text-white text-xs flex items-center justify-center">
                            {chatMessages.length - 2}
                        </div>
                    )}
                </button>
                <button className="w-12 h-12 rounded-full bg-gray-700 text-white hover:bg-gray-600 transition-all">
                    <i className="fas fa-desktop"></i>
                </button>
            </div>
        </div>
    );
};
