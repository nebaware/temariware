import React, { useState, useContext } from 'react';
import { StoreContext } from '../contexts/StoreContext';
import { ToastContext } from '../contexts/ToastContext';
import { Button } from '../components/common/Button';
import { Card } from '../components/common/Card';
import { Badge } from '../components/common/Badge';
import { Modal } from '../components/common/Modal';

interface Alumni {
    id: string;
    name: string;
    graduationYear: number;
    university: string;
    degree: string;
    currentRole: string;
    company: string;
    location: string;
    industry: string;
    skills: string[];
    avatar: string;
    bio: string;
    linkedIn?: string;
    mentoring: boolean;
    achievements: string[];
}

interface AlumniEvent {
    id: string;
    title: string;
    type: 'networking' | 'workshop' | 'webinar' | 'reunion' | 'career-fair';
    date: string;
    time: string;
    location: string;
    isVirtual: boolean;
    organizer: string;
    attendees: number;
    maxAttendees: number;
    description: string;
    speakers: string[];
    tags: string[];
}

interface JobReferral {
    id: string;
    title: string;
    company: string;
    referredBy: string;
    location: string;
    salary: string;
    description: string;
    requirements: string[];
    posted: string;
    deadline: string;
}

export const AlumniNetworkPage: React.FC = () => {
    const { state } = useContext(StoreContext);
    const { addToast } = useContext(ToastContext);
    const [activeTab, setActiveTab] = useState<'directory' | 'events' | 'referrals' | 'mentorship'>('directory');
    const [alumni, setAlumni] = useState<Alumni[]>([]);
    const [events, setEvents] = useState<AlumniEvent[]>([]);
    const [referrals, setReferrals] = useState<JobReferral[]>([]);
    const [selectedAlumni, setSelectedAlumni] = useState<Alumni | null>(null);
    const [selectedEvent, setSelectedEvent] = useState<AlumniEvent | null>(null);
    const [showAlumniModal, setShowAlumniModal] = useState(false);
    const [showEventModal, setShowEventModal] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [filters, setFilters] = useState({
        university: 'all',
        industry: 'all',
        graduationYear: 'all',
        mentoring: false
    });

    const mockAlumni: Alumni[] = [
        {
            id: '1',
            name: 'Sarah Tadesse',
            graduationYear: 2020,
            university: 'Addis Ababa University',
            degree: 'Computer Science',
            currentRole: 'Senior Software Engineer',
            company: 'Google',
            location: 'Mountain View, CA',
            industry: 'Technology',
            skills: ['React', 'Python', 'Machine Learning', 'Leadership'],
            avatar: 'ST',
            bio: 'Passionate about using technology to solve real-world problems. Currently working on AI/ML projects at Google.',
            linkedIn: 'sarah-tadesse',
            mentoring: true,
            achievements: ['Google Excellence Award 2023', 'Published 5 research papers', 'TEDx Speaker']
        },
        {
            id: '2',
            name: 'Michael Kebede',
            graduationYear: 2018,
            university: 'Bahir Dar University',
            degree: 'Business Administration',
            currentRole: 'Product Manager',
            company: 'Microsoft',
            location: 'Seattle, WA',
            industry: 'Technology',
            skills: ['Product Strategy', 'Data Analysis', 'Agile', 'Leadership'],
            avatar: 'MK',
            bio: 'Leading product development for Microsoft Azure. Helping Ethiopian startups scale globally.',
            linkedIn: 'michael-kebede',
            mentoring: true,
            achievements: ['Microsoft MVP 2022', 'Founded 2 startups', 'Angel investor']
        },
        {
            id: '3',
            name: 'Hanan Ahmed',
            graduationYear: 2019,
            university: 'Hawassa University',
            degree: 'Medicine',
            currentRole: 'Medical Researcher',
            company: 'Johns Hopkins',
            location: 'Baltimore, MD',
            industry: 'Healthcare',
            skills: ['Medical Research', 'Data Analysis', 'Public Health', 'Leadership'],
            avatar: 'HA',
            bio: 'Researching infectious diseases and their impact on African communities.',
            mentoring: true,
            achievements: ['WHO Young Researcher Award', '10+ published papers', 'Global health advocate']
        }
    ];

    const mockEvents: AlumniEvent[] = [
        {
            id: '1',
            title: 'Ethiopian Tech Alumni Meetup',
            type: 'networking',
            date: '2024-02-15',
            time: '18:00',
            location: 'San Francisco, CA',
            isVirtual: false,
            organizer: 'Sarah Tadesse',
            attendees: 45,
            maxAttendees: 100,
            description: 'Connect with Ethiopian tech professionals in the Bay Area',
            speakers: ['Sarah Tadesse', 'Michael Kebede'],
            tags: ['Technology', 'Networking', 'Career']
        },
        {
            id: '2',
            title: 'Career Transition Workshop',
            type: 'workshop',
            date: '2024-02-20',
            time: '14:00',
            location: 'Virtual',
            isVirtual: true,
            organizer: 'Alumni Association',
            attendees: 120,
            maxAttendees: 200,
            description: 'Learn strategies for successful career transitions',
            speakers: ['Industry Experts'],
            tags: ['Career', 'Professional Development', 'Workshop']
        }
    ];

    const mockReferrals: JobReferral[] = [
        {
            id: '1',
            title: 'Software Engineer',
            company: 'Google',
            referredBy: 'Sarah Tadesse',
            location: 'Mountain View, CA',
            salary: '$120k - $180k',
            description: 'Join our team building next-generation AI products',
            requirements: ['3+ years experience', 'Python', 'Machine Learning'],
            posted: '2024-01-15',
            deadline: '2024-02-15'
        },
        {
            id: '2',
            title: 'Product Manager',
            company: 'Microsoft',
            referredBy: 'Michael Kebede',
            location: 'Seattle, WA',
            salary: '$130k - $200k',
            description: 'Lead product strategy for Azure services',
            requirements: ['5+ years PM experience', 'Technical background', 'Leadership skills'],
            posted: '2024-01-20',
            deadline: '2024-02-20'
        }
    ];

    React.useEffect(() => {
        setAlumni(mockAlumni);
        setEvents(mockEvents);
        setReferrals(mockReferrals);
    }, []);

    const filteredAlumni = alumni.filter(person => {
        const matchesSearch = person.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            person.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            person.currentRole.toLowerCase().includes(searchQuery.toLowerCase());
        
        if (!matchesSearch) return false;
        if (filters.university !== 'all' && person.university !== filters.university) return false;
        if (filters.industry !== 'all' && person.industry !== filters.industry) return false;
        if (filters.graduationYear !== 'all' && person.graduationYear.toString() !== filters.graduationYear) return false;
        if (filters.mentoring && !person.mentoring) return false;
        
        return true;
    });

    const handleConnect = (alumni: Alumni) => {
        addToast(`Connection request sent to ${alumni.name}`, 'success');
    };

    const handleRequestMentorship = (alumni: Alumni) => {
        addToast(`Mentorship request sent to ${alumni.name}`, 'success');
    };

    const handleJoinEvent = (event: AlumniEvent) => {
        addToast(`Registered for ${event.title}`, 'success');
    };

    const handleApplyReferral = (referral: JobReferral) => {
        addToast(`Applied for ${referral.title} at ${referral.company}`, 'success');
    };

    const getEventTypeColor = (type: string) => {
        switch (type) {
            case 'networking': return 'bg-blue-500/20 text-blue-400';
            case 'workshop': return 'bg-green-500/20 text-green-400';
            case 'webinar': return 'bg-purple-500/20 text-purple-400';
            case 'reunion': return 'bg-yellow-500/20 text-yellow-400';
            case 'career-fair': return 'bg-red-500/20 text-red-400';
            default: return 'bg-gray-500/20 text-gray-400';
        }
    };

    return (
        <div className="min-h-screen bg-black text-white p-4 pb-24">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="text-center mb-6">
                    <h1 className="text-2xl font-bold mb-2">Alumni Network</h1>
                    <p className="text-gray-400">Connect with graduates and expand your professional network</p>
                </div>

                {/* Tabs */}
                <div className="flex bg-gray-800 p-1 rounded-lg mb-6 overflow-x-auto">
                    {[
                        { key: 'directory', label: 'Directory', icon: '👥' },
                        { key: 'events', label: 'Events', icon: '📅' },
                        { key: 'referrals', label: 'Job Referrals', icon: '💼' },
                        { key: 'mentorship', label: 'Mentorship', icon: '🎓' }
                    ].map(tab => (
                        <button
                            key={tab.key}
                            onClick={() => setActiveTab(tab.key as any)}
                            className={`flex-1 py-2 px-3 rounded-md text-xs font-bold transition-all whitespace-nowrap ${
                                activeTab === tab.key ? 'bg-primary text-black' : 'text-gray-400'
                            }`}
                        >
                            <span className="mr-1">{tab.icon}</span>
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* Directory Tab */}
                {activeTab === 'directory' && (
                    <div className="space-y-6">
                        {/* Search and Filters */}
                        <Card>
                            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                                <div className="md:col-span-2">
                                    <input
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        placeholder="Search alumni by name, company, or role..."
                                        className="w-full bg-gray-800 border border-gray-600 rounded px-3 py-2 text-white focus:border-primary outline-none text-sm"
                                    />
                                </div>
                                <select
                                    value={filters.university}
                                    onChange={(e) => setFilters(prev => ({ ...prev, university: e.target.value }))}
                                    className="bg-gray-800 border border-gray-600 rounded px-3 py-2 text-white text-sm"
                                >
                                    <option value="all">All Universities</option>
                                    <option value="Addis Ababa University">Addis Ababa University</option>
                                    <option value="Bahir Dar University">Bahir Dar University</option>
                                    <option value="Hawassa University">Hawassa University</option>
                                </select>
                                <select
                                    value={filters.industry}
                                    onChange={(e) => setFilters(prev => ({ ...prev, industry: e.target.value }))}
                                    className="bg-gray-800 border border-gray-600 rounded px-3 py-2 text-white text-sm"
                                >
                                    <option value="all">All Industries</option>
                                    <option value="Technology">Technology</option>
                                    <option value="Healthcare">Healthcare</option>
                                    <option value="Finance">Finance</option>
                                    <option value="Education">Education</option>
                                </select>
                                <label className="flex items-center gap-2">
                                    <input
                                        type="checkbox"
                                        checked={filters.mentoring}
                                        onChange={(e) => setFilters(prev => ({ ...prev, mentoring: e.target.checked }))}
                                    />
                                    <span className="text-sm">Mentors Only</span>
                                </label>
                            </div>
                        </Card>

                        {/* Alumni Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {filteredAlumni.map(person => (
                                <Card key={person.id} className="hover:border-primary/50 transition-all cursor-pointer"
                                      onClick={() => {
                                          setSelectedAlumni(person);
                                          setShowAlumniModal(true);
                                      }}>
                                    <div className="text-center mb-4">
                                        <div className="w-16 h-16 bg-primary rounded-full mx-auto mb-3 flex items-center justify-center text-black font-bold text-xl">
                                            {person.avatar}
                                        </div>
                                        <h3 className="font-bold">{person.name}</h3>
                                        <p className="text-sm text-gray-400">{person.currentRole}</p>
                                        <p className="text-sm text-gray-500">{person.company}</p>
                                    </div>

                                    <div className="space-y-2 mb-4">
                                        <div className="flex justify-between text-xs">
                                            <span className="text-gray-400">Graduated</span>
                                            <span>{person.graduationYear}</span>
                                        </div>
                                        <div className="flex justify-between text-xs">
                                            <span className="text-gray-400">Location</span>
                                            <span>{person.location}</span>
                                        </div>
                                        {person.mentoring && (
                                            <Badge color="bg-green-500/20 text-green-400">Available for Mentoring</Badge>
                                        )}
                                    </div>

                                    <div className="flex flex-wrap gap-1 mb-4">
                                        {person.skills.slice(0, 3).map(skill => (
                                            <span key={skill} className="bg-blue-500/20 text-blue-300 px-2 py-1 rounded text-xs">
                                                {skill}
                                            </span>
                                        ))}
                                    </div>

                                    <Button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleConnect(person);
                                        }}
                                        variant="outline"
                                        className="w-full !py-1 !text-xs"
                                    >
                                        Connect
                                    </Button>
                                </Card>
                            ))}
                        </div>
                    </div>
                )}

                {/* Events Tab */}
                {activeTab === 'events' && (
                    <div className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {events.map(event => (
                                <Card key={event.id} className="hover:border-primary/50 transition-all cursor-pointer"
                                      onClick={() => {
                                          setSelectedEvent(event);
                                          setShowEventModal(true);
                                      }}>
                                    <div className="flex justify-between items-start mb-3">
                                        <div>
                                            <h3 className="font-bold">{event.title}</h3>
                                            <p className="text-sm text-gray-400">by {event.organizer}</p>
                                        </div>
                                        <Badge color={getEventTypeColor(event.type)}>
                                            {event.type.replace('-', ' ').toUpperCase()}
                                        </Badge>
                                    </div>

                                    <div className="space-y-2 mb-4">
                                        <div className="flex items-center gap-2 text-sm">
                                            <i className="fas fa-calendar text-gray-400"></i>
                                            <span>{new Date(event.date).toLocaleDateString()} at {event.time}</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-sm">
                                            <i className={`fas ${event.isVirtual ? 'fa-video' : 'fa-map-marker-alt'} text-gray-400`}></i>
                                            <span>{event.location}</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-sm">
                                            <i className="fas fa-users text-gray-400"></i>
                                            <span>{event.attendees}/{event.maxAttendees} attendees</span>
                                        </div>
                                    </div>

                                    <p className="text-sm text-gray-300 mb-4">{event.description}</p>

                                    <Button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleJoinEvent(event);
                                        }}
                                        className="w-full !py-1 !text-xs"
                                    >
                                        Register
                                    </Button>
                                </Card>
                            ))}
                        </div>
                    </div>
                )}

                {/* Job Referrals Tab */}
                {activeTab === 'referrals' && (
                    <div className="space-y-4">
                        {referrals.map(referral => (
                            <Card key={referral.id} className="hover:border-primary/50 transition-all">
                                <div className="flex justify-between items-start mb-3">
                                    <div>
                                        <h3 className="font-bold text-lg">{referral.title}</h3>
                                        <p className="text-gray-400">{referral.company}</p>
                                        <p className="text-sm text-gray-500">Referred by {referral.referredBy}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-bold text-primary">{referral.salary}</p>
                                        <p className="text-sm text-gray-400">{referral.location}</p>
                                    </div>
                                </div>

                                <p className="text-sm text-gray-300 mb-3">{referral.description}</p>

                                <div className="mb-4">
                                    <h4 className="font-bold text-sm mb-2">Requirements:</h4>
                                    <ul className="text-sm text-gray-300 space-y-1">
                                        {referral.requirements.map((req, index) => (
                                            <li key={index}>• {req}</li>
                                        ))}
                                    </ul>
                                </div>

                                <div className="flex justify-between items-center">
                                    <div className="text-xs text-gray-400">
                                        <span>Posted: {new Date(referral.posted).toLocaleDateString()}</span>
                                        <span className="ml-4">Deadline: {new Date(referral.deadline).toLocaleDateString()}</span>
                                    </div>
                                    <Button
                                        onClick={() => handleApplyReferral(referral)}
                                        className="!py-1 !px-3 !text-xs"
                                    >
                                        Apply with Referral
                                    </Button>
                                </div>
                            </Card>
                        ))}
                    </div>
                )}

                {/* Mentorship Tab */}
                {activeTab === 'mentorship' && (
                    <div className="space-y-6">
                        <Card className="bg-gradient-to-r from-purple-900/50 to-blue-900/50 border-purple-500/30">
                            <div className="flex items-center gap-4">
                                <div className="text-3xl">🎓</div>
                                <div>
                                    <h3 className="font-bold">Mentorship Program</h3>
                                    <p className="text-sm text-gray-300">
                                        Connect with experienced alumni for career guidance and professional development
                                    </p>
                                </div>
                            </div>
                        </Card>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {alumni.filter(person => person.mentoring).map(mentor => (
                                <Card key={mentor.id} className="hover:border-primary/50 transition-all">
                                    <div className="flex items-center gap-4 mb-4">
                                        <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center text-black font-bold">
                                            {mentor.avatar}
                                        </div>
                                        <div>
                                            <h3 className="font-bold">{mentor.name}</h3>
                                            <p className="text-sm text-gray-400">{mentor.currentRole}</p>
                                            <p className="text-sm text-gray-500">{mentor.company}</p>
                                        </div>
                                    </div>

                                    <p className="text-sm text-gray-300 mb-3">{mentor.bio}</p>

                                    <div className="mb-4">
                                        <h4 className="font-bold text-sm mb-2">Expertise:</h4>
                                        <div className="flex flex-wrap gap-1">
                                            {mentor.skills.map(skill => (
                                                <span key={skill} className="bg-purple-500/20 text-purple-300 px-2 py-1 rounded text-xs">
                                                    {skill}
                                                </span>
                                            ))}
                                        </div>
                                    </div>

                                    <Button
                                        onClick={() => handleRequestMentorship(mentor)}
                                        className="w-full !py-1 !text-xs"
                                    >
                                        Request Mentorship
                                    </Button>
                                </Card>
                            ))}
                        </div>
                    </div>
                )}

                {/* Alumni Detail Modal */}
                <Modal
                    isOpen={showAlumniModal}
                    onClose={() => setShowAlumniModal(false)}
                    title="Alumni Profile"
                >
                    {selectedAlumni && (
                        <div className="space-y-4">
                            <div className="text-center">
                                <div className="w-20 h-20 bg-primary rounded-full mx-auto mb-4 flex items-center justify-center text-black font-bold text-2xl">
                                    {selectedAlumni.avatar}
                                </div>
                                <h3 className="font-bold text-xl">{selectedAlumni.name}</h3>
                                <p className="text-gray-400">{selectedAlumni.currentRole}</p>
                                <p className="text-gray-500">{selectedAlumni.company}</p>
                            </div>

                            <div>
                                <h4 className="font-bold mb-2">About</h4>
                                <p className="text-sm text-gray-300">{selectedAlumni.bio}</p>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <h4 className="font-bold mb-2">Education</h4>
                                    <p className="text-sm">{selectedAlumni.degree}</p>
                                    <p className="text-sm text-gray-400">{selectedAlumni.university}</p>
                                    <p className="text-sm text-gray-400">Class of {selectedAlumni.graduationYear}</p>
                                </div>
                                <div>
                                    <h4 className="font-bold mb-2">Location</h4>
                                    <p className="text-sm">{selectedAlumni.location}</p>
                                    <p className="text-sm text-gray-400">{selectedAlumni.industry}</p>
                                </div>
                            </div>

                            <div>
                                <h4 className="font-bold mb-2">Skills</h4>
                                <div className="flex flex-wrap gap-2">
                                    {selectedAlumni.skills.map(skill => (
                                        <span key={skill} className="bg-blue-500/20 text-blue-300 px-2 py-1 rounded text-xs">
                                            {skill}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <h4 className="font-bold mb-2">Achievements</h4>
                                <ul className="text-sm text-gray-300 space-y-1">
                                    {selectedAlumni.achievements.map((achievement, index) => (
                                        <li key={index}>• {achievement}</li>
                                    ))}
                                </ul>
                            </div>

                            <div className="flex gap-3 pt-4">
                                <Button
                                    onClick={() => handleConnect(selectedAlumni)}
                                    variant="outline"
                                    className="flex-1"
                                >
                                    Connect
                                </Button>
                                {selectedAlumni.mentoring && (
                                    <Button
                                        onClick={() => handleRequestMentorship(selectedAlumni)}
                                        className="flex-1"
                                    >
                                        Request Mentorship
                                    </Button>
                                )}
                            </div>
                        </div>
                    )}
                </Modal>

                {/* Event Detail Modal */}
                <Modal
                    isOpen={showEventModal}
                    onClose={() => setShowEventModal(false)}
                    title="Event Details"
                >
                    {selectedEvent && (
                        <div className="space-y-4">
                            <div>
                                <h3 className="font-bold text-xl mb-2">{selectedEvent.title}</h3>
                                <Badge color={getEventTypeColor(selectedEvent.type)}>
                                    {selectedEvent.type.replace('-', ' ').toUpperCase()}
                                </Badge>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <h4 className="font-bold mb-1">Date & Time</h4>
                                    <p className="text-sm">{new Date(selectedEvent.date).toLocaleDateString()}</p>
                                    <p className="text-sm text-gray-400">{selectedEvent.time}</p>
                                </div>
                                <div>
                                    <h4 className="font-bold mb-1">Location</h4>
                                    <p className="text-sm">{selectedEvent.location}</p>
                                    <p className="text-sm text-gray-400">{selectedEvent.isVirtual ? 'Virtual Event' : 'In-Person'}</p>
                                </div>
                            </div>

                            <div>
                                <h4 className="font-bold mb-2">Description</h4>
                                <p className="text-sm text-gray-300">{selectedEvent.description}</p>
                            </div>

                            <div>
                                <h4 className="font-bold mb-2">Speakers</h4>
                                <div className="flex flex-wrap gap-2">
                                    {selectedEvent.speakers.map(speaker => (
                                        <span key={speaker} className="bg-green-500/20 text-green-300 px-2 py-1 rounded text-xs">
                                            {speaker}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            <div className="flex justify-between items-center pt-4">
                                <span className="text-sm text-gray-400">
                                    {selectedEvent.attendees}/{selectedEvent.maxAttendees} registered
                                </span>
                                <Button
                                    onClick={() => handleJoinEvent(selectedEvent)}
                                    disabled={selectedEvent.attendees >= selectedEvent.maxAttendees}
                                >
                                    {selectedEvent.attendees >= selectedEvent.maxAttendees ? 'Event Full' : 'Register'}
                                </Button>
                            </div>
                        </div>
                    )}
                </Modal>
            </div>
        </div>
    );
};