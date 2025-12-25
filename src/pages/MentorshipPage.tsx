import React, { useState, useContext, useEffect } from 'react';
import { StoreContext } from '../contexts/StoreContext';
import { ToastContext } from '../contexts/ToastContext';
import { Button } from '../components/common/Button';
import { Card } from '../components/common/Card';
import { Badge } from '../components/common/Badge';
import { Modal } from '../components/common/Modal';

interface Mentor {
    id: string;
    name: string;
    title: string;
    company: string;
    expertise: string[];
    experience: number;
    rating: number;
    sessions: number;
    matchScore: number;
    avatar: string;
    bio: string;
    availability: 'available' | 'busy' | 'offline';
    price: number;
}

interface MentorshipRequest {
    id: string;
    mentorId: string;
    status: 'pending' | 'accepted' | 'declined' | 'completed';
    topic: string;
    message: string;
    scheduledDate?: string;
}

export const MentorshipPage: React.FC = () => {
    const { state } = useContext(StoreContext);
    const { addToast } = useContext(ToastContext);
    const [activeTab, setActiveTab] = useState<'discover' | 'requests' | 'sessions'>('discover');
    const [mentors, setMentors] = useState<Mentor[]>([]);
    const [selectedMentor, setSelectedMentor] = useState<Mentor | null>(null);
    const [showRequestModal, setShowRequestModal] = useState(false);
    const [requestForm, setRequestForm] = useState({ topic: '', message: '', preferredTime: '' });
    const [filterExpertise, setFilterExpertise] = useState<string>('all');

    const mockMentors: Mentor[] = [
        {
            id: '1',
            name: 'Dr. Sarah Johnson',
            title: 'Senior Software Engineer',
            company: 'Google',
            expertise: ['React', 'Node.js', 'System Design', 'Career Growth'],
            experience: 8,
            rating: 4.9,
            sessions: 156,
            matchScore: 95,
            avatar: 'SJ',
            bio: 'Passionate about helping junior developers grow their careers in tech.',
            availability: 'available',
            price: 50
        },
        {
            id: '2',
            name: 'Michael Chen',
            title: 'Product Manager',
            company: 'Microsoft',
            expertise: ['Product Strategy', 'User Research', 'Agile', 'Leadership'],
            experience: 6,
            rating: 4.8,
            sessions: 89,
            matchScore: 87,
            avatar: 'MC',
            bio: 'Helping students transition from technical roles to product management.',
            availability: 'available',
            price: 45
        },
        {
            id: '3',
            name: 'Aisha Tadesse',
            title: 'Data Scientist',
            company: 'Ethiopian Airlines',
            expertise: ['Python', 'Machine Learning', 'Data Analysis', 'AI'],
            experience: 5,
            rating: 4.7,
            sessions: 67,
            matchScore: 92,
            avatar: 'AT',
            bio: 'Ethiopian data scientist passionate about AI applications in Africa.',
            availability: 'busy',
            price: 40
        }
    ];

    const mockRequests: MentorshipRequest[] = [
        {
            id: '1',
            mentorId: '1',
            status: 'pending',
            topic: 'Career Transition to Tech',
            message: 'I need guidance on transitioning from academia to industry.',
            scheduledDate: '2024-01-15T14:00:00Z'
        }
    ];

    useEffect(() => {
        setMentors(mockMentors);
    }, []);

    const filteredMentors = mentors.filter(mentor => 
        filterExpertise === 'all' || mentor.expertise.some(skill => 
            skill.toLowerCase().includes(filterExpertise.toLowerCase())
        )
    );

    const handleRequestMentorship = async () => {
        if (!selectedMentor || !requestForm.topic || !requestForm.message) {
            addToast('Please fill in all required fields', 'error');
            return;
        }

        // Simulate API call
        addToast('Mentorship request sent successfully!', 'success');
        setShowRequestModal(false);
        setRequestForm({ topic: '', message: '', preferredTime: '' });
        setSelectedMentor(null);
    };

    const getAvailabilityColor = (availability: string) => {
        switch (availability) {
            case 'available': return 'bg-green-500';
            case 'busy': return 'bg-yellow-500';
            case 'offline': return 'bg-gray-500';
            default: return 'bg-gray-500';
        }
    };

    const getAvailabilityText = (availability: string) => {
        switch (availability) {
            case 'available': return 'Available';
            case 'busy': return 'Busy';
            case 'offline': return 'Offline';
            default: return 'Unknown';
        }
    };

    return (
        <div className="min-h-screen bg-black text-white p-4 pb-24">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="text-center mb-6">
                    <h1 className="text-2xl font-bold mb-2">Mentorship Matching</h1>
                    <p className="text-gray-400">Connect with industry experts for personalized guidance</p>
                </div>

                {/* Tabs */}
                <div className="flex bg-gray-800 p-1 rounded-lg mb-6">
                    <button
                        onClick={() => setActiveTab('discover')}
                        className={`flex-1 py-2 px-4 rounded-md text-sm font-bold transition-all ${
                            activeTab === 'discover' ? 'bg-primary text-black' : 'text-gray-400'
                        }`}
                    >
                        Discover Mentors
                    </button>
                    <button
                        onClick={() => setActiveTab('requests')}
                        className={`flex-1 py-2 px-4 rounded-md text-sm font-bold transition-all ${
                            activeTab === 'requests' ? 'bg-primary text-black' : 'text-gray-400'
                        }`}
                    >
                        My Requests
                    </button>
                    <button
                        onClick={() => setActiveTab('sessions')}
                        className={`flex-1 py-2 px-4 rounded-md text-sm font-bold transition-all ${
                            activeTab === 'sessions' ? 'bg-primary text-black' : 'text-gray-400'
                        }`}
                    >
                        Sessions
                    </button>
                </div>

                {/* Discover Tab */}
                {activeTab === 'discover' && (
                    <div className="space-y-6">
                        {/* AI Matching Banner */}
                        <Card className="bg-gradient-to-r from-blue-900/50 to-purple-900/50 border-blue-500/30">
                            <div className="flex items-center gap-4">
                                <div className="text-3xl">🤖</div>
                                <div>
                                    <h3 className="font-bold">AI-Powered Matching</h3>
                                    <p className="text-sm text-gray-300">
                                        Our AI analyzes your profile and goals to find the perfect mentors
                                    </p>
                                </div>
                            </div>
                        </Card>

                        {/* Filters */}
                        <div className="flex gap-2 overflow-x-auto pb-2">
                            <button
                                onClick={() => setFilterExpertise('all')}
                                className={`px-3 py-1 rounded-full text-xs font-bold whitespace-nowrap ${
                                    filterExpertise === 'all' ? 'bg-primary text-black' : 'bg-gray-700 text-gray-300'
                                }`}
                            >
                                All Mentors
                            </button>
                            {['React', 'Python', 'Product', 'Data Science', 'Leadership'].map(skill => (
                                <button
                                    key={skill}
                                    onClick={() => setFilterExpertise(skill)}
                                    className={`px-3 py-1 rounded-full text-xs font-bold whitespace-nowrap ${
                                        filterExpertise === skill ? 'bg-primary text-black' : 'bg-gray-700 text-gray-300'
                                    }`}
                                >
                                    {skill}
                                </button>
                            ))}
                        </div>

                        {/* Mentors List */}
                        <div className="space-y-4">
                            {filteredMentors.map(mentor => (
                                <Card key={mentor.id} className="hover:border-primary/50 transition-all">
                                    <div className="flex gap-4">
                                        <div className="relative">
                                            <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center text-black font-bold text-xl">
                                                {mentor.avatar}
                                            </div>
                                            <div className={`absolute -bottom-1 -right-1 w-4 h-4 ${getAvailabilityColor(mentor.availability)} rounded-full border-2 border-black`}></div>
                                        </div>
                                        
                                        <div className="flex-1">
                                            <div className="flex justify-between items-start mb-2">
                                                <div>
                                                    <h3 className="font-bold text-lg">{mentor.name}</h3>
                                                    <p className="text-sm text-gray-400">{mentor.title} at {mentor.company}</p>
                                                </div>
                                                <div className="text-right">
                                                    <div className="bg-green-500/20 text-green-400 px-2 py-1 rounded text-xs font-bold mb-1">
                                                        {mentor.matchScore}% Match
                                                    </div>
                                                    <div className="text-xs text-gray-400">
                                                        {getAvailabilityText(mentor.availability)}
                                                    </div>
                                                </div>
                                            </div>
                                            
                                            <p className="text-sm text-gray-300 mb-3">{mentor.bio}</p>
                                            
                                            <div className="flex flex-wrap gap-2 mb-3">
                                                {mentor.expertise.map(skill => (
                                                    <span key={skill} className="bg-blue-500/20 text-blue-300 px-2 py-1 rounded text-xs">
                                                        {skill}
                                                    </span>
                                                ))}
                                            </div>
                                            
                                            <div className="flex justify-between items-center">
                                                <div className="flex gap-4 text-xs text-gray-400">
                                                    <span>⭐ {mentor.rating}</span>
                                                    <span>📅 {mentor.sessions} sessions</span>
                                                    <span>💰 ${mentor.price}/hour</span>
                                                </div>
                                                <Button
                                                    onClick={() => {
                                                        setSelectedMentor(mentor);
                                                        setShowRequestModal(true);
                                                    }}
                                                    disabled={mentor.availability === 'offline'}
                                                    className="!py-1 !px-3 !text-xs"
                                                >
                                                    Request Mentorship
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                </Card>
                            ))}
                        </div>
                    </div>
                )}

                {/* Requests Tab */}
                {activeTab === 'requests' && (
                    <div className="space-y-4">
                        {mockRequests.map(request => {
                            const mentor = mentors.find(m => m.id === request.mentorId);
                            return (
                                <Card key={request.id}>
                                    <div className="flex justify-between items-start mb-3">
                                        <div>
                                            <h3 className="font-bold">{request.topic}</h3>
                                            <p className="text-sm text-gray-400">To: {mentor?.name}</p>
                                        </div>
                                        <Badge color={
                                            request.status === 'pending' ? 'bg-yellow-500/20 text-yellow-400' :
                                            request.status === 'accepted' ? 'bg-green-500/20 text-green-400' :
                                            request.status === 'declined' ? 'bg-red-500/20 text-red-400' :
                                            'bg-blue-500/20 text-blue-400'
                                        }>
                                            {request.status}
                                        </Badge>
                                    </div>
                                    <p className="text-sm text-gray-300 mb-3">{request.message}</p>
                                    {request.scheduledDate && (
                                        <p className="text-xs text-gray-400">
                                            Scheduled: {new Date(request.scheduledDate).toLocaleString()}
                                        </p>
                                    )}
                                </Card>
                            );
                        })}
                        {mockRequests.length === 0 && (
                            <div className="text-center text-gray-500 py-8">
                                No mentorship requests yet. Start by discovering mentors!
                            </div>
                        )}
                    </div>
                )}

                {/* Sessions Tab */}
                {activeTab === 'sessions' && (
                    <div className="text-center text-gray-500 py-8">
                        No active sessions. Book a mentorship session to get started!
                    </div>
                )}

                {/* Request Modal */}
                <Modal
                    isOpen={showRequestModal}
                    onClose={() => setShowRequestModal(false)}
                    title="Request Mentorship"
                >
                    {selectedMentor && (
                        <div className="space-y-4">
                            <div className="bg-blue-900/20 border border-blue-500/30 p-3 rounded-lg">
                                <p className="text-sm text-blue-300">Requesting mentorship from:</p>
                                <p className="font-bold">{selectedMentor.name}</p>
                                <p className="text-sm text-gray-400">{selectedMentor.title}</p>
                            </div>
                            
                            <div>
                                <label className="block text-sm font-bold text-gray-400 mb-2">
                                    Topic/Goal *
                                </label>
                                <input
                                    value={requestForm.topic}
                                    onChange={(e) => setRequestForm(prev => ({ ...prev, topic: e.target.value }))}
                                    placeholder="e.g., Career transition, Technical skills, Interview prep"
                                    className="w-full bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white focus:border-primary outline-none"
                                />
                            </div>
                            
                            <div>
                                <label className="block text-sm font-bold text-gray-400 mb-2">
                                    Message *
                                </label>
                                <textarea
                                    value={requestForm.message}
                                    onChange={(e) => setRequestForm(prev => ({ ...prev, message: e.target.value }))}
                                    placeholder="Tell the mentor about your background and what you hope to achieve..."
                                    rows={4}
                                    className="w-full bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white focus:border-primary outline-none"
                                />
                            </div>
                            
                            <div>
                                <label className="block text-sm font-bold text-gray-400 mb-2">
                                    Preferred Time (Optional)
                                </label>
                                <input
                                    type="datetime-local"
                                    value={requestForm.preferredTime}
                                    onChange={(e) => setRequestForm(prev => ({ ...prev, preferredTime: e.target.value }))}
                                    className="w-full bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white focus:border-primary outline-none"
                                />
                            </div>
                            
                            <div className="flex gap-3 pt-4">
                                <Button
                                    onClick={() => setShowRequestModal(false)}
                                    variant="outline"
                                    className="flex-1"
                                >
                                    Cancel
                                </Button>
                                <Button
                                    onClick={handleRequestMentorship}
                                    className="flex-1"
                                >
                                    Send Request
                                </Button>
                            </div>
                        </div>
                    )}
                </Modal>
            </div>
        </div>
    );
};