import React, { useState, useContext } from 'react';
import { StoreContext } from '../contexts/StoreContext';
import { ToastContext } from '../contexts/ToastContext';
import { Button } from '../components/common/Button';
import { Card } from '../components/common/Card';
import { Badge } from '../components/common/Badge';
import { Modal } from '../components/common/Modal';

interface Startup {
    id: string;
    name: string;
    tagline: string;
    description: string;
    industry: string;
    stage: 'idea' | 'mvp' | 'early' | 'growth' | 'scale';
    fundingGoal: number;
    currentFunding: number;
    equity: number;
    founders: string[];
    location: string;
    logo: string;
    metrics: {
        users?: number;
        revenue?: number;
        growth?: string;
    };
    tags: string[];
}

interface Investor {
    id: string;
    name: string;
    type: 'angel' | 'vc' | 'corporate' | 'government';
    focus: string[];
    minInvestment: number;
    maxInvestment: number;
    portfolio: number;
    location: string;
    avatar: string;
    description: string;
}

interface PitchDeck {
    slides: {
        title: string;
        content: string;
        type: 'problem' | 'solution' | 'market' | 'business' | 'team' | 'financial' | 'ask';
    }[];
}

export const StartupFundingPage: React.FC = () => {
    const { state } = useContext(StoreContext);
    const { addToast } = useContext(ToastContext);
    const [activeTab, setActiveTab] = useState<'discover' | 'my-startup' | 'investors' | 'pitch-deck'>('discover');
    const [startups, setStartups] = useState<Startup[]>([]);
    const [investors, setInvestors] = useState<Investor[]>([]);
    const [selectedStartup, setSelectedStartup] = useState<Startup | null>(null);
    const [selectedInvestor, setSelectedInvestor] = useState<Investor | null>(null);
    const [showStartupModal, setShowStartupModal] = useState(false);
    const [showInvestorModal, setShowInvestorModal] = useState(false);
    const [pitchDeck, setPitchDeck] = useState<PitchDeck>({ slides: [] });

    const mockStartups: Startup[] = [
        {
            id: '1',
            name: 'EthioTech Solutions',
            tagline: 'Bridging the digital divide in rural Ethiopia',
            description: 'Providing affordable internet and digital services to underserved communities',
            industry: 'Technology',
            stage: 'mvp',
            fundingGoal: 500000,
            currentFunding: 150000,
            equity: 15,
            founders: ['Abebe Kebede', 'Sara Tadesse'],
            location: 'Addis Ababa, Ethiopia',
            logo: 'ET',
            metrics: {
                users: 5000,
                revenue: 25000,
                growth: '40% MoM'
            },
            tags: ['EdTech', 'Social Impact', 'Rural Development']
        },
        {
            id: '2',
            name: 'AgriConnect',
            tagline: 'Connecting farmers to markets through technology',
            description: 'Mobile platform linking smallholder farmers directly with buyers',
            industry: 'Agriculture',
            stage: 'early',
            fundingGoal: 300000,
            currentFunding: 80000,
            equity: 20,
            founders: ['Meron Haile', 'Daniel Worku'],
            location: 'Bahir Dar, Ethiopia',
            logo: 'AC',
            metrics: {
                users: 2500,
                revenue: 15000,
                growth: '25% MoM'
            },
            tags: ['AgTech', 'Marketplace', 'Mobile']
        }
    ];

    const mockInvestors: Investor[] = [
        {
            id: '1',
            name: 'Ethiopian Ventures',
            type: 'vc',
            focus: ['Technology', 'Healthcare', 'Education'],
            minInvestment: 50000,
            maxInvestment: 1000000,
            portfolio: 25,
            location: 'Addis Ababa',
            avatar: 'EV',
            description: 'Leading VC fund focused on Ethiopian startups with global potential'
        },
        {
            id: '2',
            name: 'Impact Angels Network',
            type: 'angel',
            focus: ['Social Impact', 'Agriculture', 'FinTech'],
            minInvestment: 10000,
            maxInvestment: 100000,
            portfolio: 40,
            location: 'Pan-African',
            avatar: 'IA',
            description: 'Angel network investing in startups solving African challenges'
        },
        {
            id: '3',
            name: 'Green Growth Fund',
            type: 'corporate',
            focus: ['CleanTech', 'Agriculture', 'Sustainability'],
            minInvestment: 100000,
            maxInvestment: 2000000,
            portfolio: 15,
            location: 'Nairobi',
            avatar: 'GG',
            description: 'Corporate fund investing in sustainable solutions for Africa'
        }
    ];

    React.useEffect(() => {
        setStartups(mockStartups);
        setInvestors(mockInvestors);
    }, []);

    const getStageColor = (stage: string) => {
        switch (stage) {
            case 'idea': return 'bg-gray-500/20 text-gray-400';
            case 'mvp': return 'bg-blue-500/20 text-blue-400';
            case 'early': return 'bg-green-500/20 text-green-400';
            case 'growth': return 'bg-yellow-500/20 text-yellow-400';
            case 'scale': return 'bg-purple-500/20 text-purple-400';
            default: return 'bg-gray-500/20 text-gray-400';
        }
    };

    const getInvestorTypeColor = (type: string) => {
        switch (type) {
            case 'angel': return 'bg-blue-500/20 text-blue-400';
            case 'vc': return 'bg-green-500/20 text-green-400';
            case 'corporate': return 'bg-purple-500/20 text-purple-400';
            case 'government': return 'bg-orange-500/20 text-orange-400';
            default: return 'bg-gray-500/20 text-gray-400';
        }
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(amount);
    };

    const handleConnectInvestor = (investor: Investor) => {
        addToast(`Connection request sent to ${investor.name}`, 'success');
    };

    const handleApplyForFunding = (startup: Startup) => {
        addToast(`Applied for funding to ${startup.name}`, 'success');
    };

    const defaultPitchSlides = [
        { title: 'Problem', content: 'What problem are you solving?', type: 'problem' as const },
        { title: 'Solution', content: 'How do you solve this problem?', type: 'solution' as const },
        { title: 'Market', content: 'What is your target market?', type: 'market' as const },
        { title: 'Business Model', content: 'How do you make money?', type: 'business' as const },
        { title: 'Team', content: 'Who is behind this startup?', type: 'team' as const },
        { title: 'Financials', content: 'What are your projections?', type: 'financial' as const },
        { title: 'Ask', content: 'What are you asking for?', type: 'ask' as const }
    ];

    React.useEffect(() => {
        if (pitchDeck.slides.length === 0) {
            setPitchDeck({ slides: defaultPitchSlides });
        }
    }, []);

    return (
        <div className="min-h-screen bg-black text-white p-4 pb-24">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="text-center mb-6">
                    <h1 className="text-2xl font-bold mb-2">Startup Funding Marketplace</h1>
                    <p className="text-gray-400">Connect startups with investors across Africa</p>
                </div>

                {/* Tabs */}
                <div className="flex bg-gray-800 p-1 rounded-lg mb-6 overflow-x-auto">
                    {[
                        { key: 'discover', label: 'Discover', icon: '🔍' },
                        { key: 'my-startup', label: 'My Startup', icon: '🚀' },
                        { key: 'investors', label: 'Investors', icon: '💰' },
                        { key: 'pitch-deck', label: 'Pitch Deck', icon: '📊' }
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

                {/* Discover Tab */}
                {activeTab === 'discover' && (
                    <div className="space-y-6">
                        <Card className="bg-gradient-to-r from-green-900/50 to-blue-900/50 border-green-500/30">
                            <div className="flex items-center gap-4">
                                <div className="text-3xl">🌍</div>
                                <div>
                                    <h3 className="font-bold">African Startup Ecosystem</h3>
                                    <p className="text-sm text-gray-300">
                                        Discover innovative startups solving real problems across Africa
                                    </p>
                                </div>
                            </div>
                        </Card>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {startups.map(startup => (
                                <Card key={startup.id} className="hover:border-primary/50 transition-all cursor-pointer"
                                      onClick={() => {
                                          setSelectedStartup(startup);
                                          setShowStartupModal(true);
                                      }}>
                                    <div className="flex justify-between items-start mb-3">
                                        <div className="flex items-center gap-3">
                                            <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center text-black font-bold">
                                                {startup.logo}
                                            </div>
                                            <div>
                                                <h3 className="font-bold">{startup.name}</h3>
                                                <p className="text-sm text-gray-400">{startup.tagline}</p>
                                            </div>
                                        </div>
                                        <Badge color={getStageColor(startup.stage)}>
                                            {startup.stage.toUpperCase()}
                                        </Badge>
                                    </div>

                                    <p className="text-sm text-gray-300 mb-3">{startup.description}</p>

                                    <div className="mb-3">
                                        <div className="flex justify-between text-xs text-gray-400 mb-1">
                                            <span>Funding Progress</span>
                                            <span>{Math.round((startup.currentFunding / startup.fundingGoal) * 100)}%</span>
                                        </div>
                                        <div className="w-full bg-gray-700 rounded-full h-2">
                                            <div 
                                                className="bg-primary h-2 rounded-full" 
                                                style={{ width: `${(startup.currentFunding / startup.fundingGoal) * 100}%` }}
                                            ></div>
                                        </div>
                                        <div className="flex justify-between text-xs text-gray-400 mt-1">
                                            <span>{formatCurrency(startup.currentFunding)} raised</span>
                                            <span>{formatCurrency(startup.fundingGoal)} goal</span>
                                        </div>
                                    </div>

                                    <div className="flex flex-wrap gap-1 mb-3">
                                        {startup.tags.map(tag => (
                                            <span key={tag} className="bg-blue-500/20 text-blue-300 px-2 py-1 rounded text-xs">
                                                {tag}
                                            </span>
                                        ))}
                                    </div>

                                    <div className="flex justify-between items-center">
                                        <span className="text-xs text-gray-400">{startup.location}</span>
                                        <Button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleApplyForFunding(startup);
                                            }}
                                            className="!py-1 !px-3 !text-xs"
                                        >
                                            Apply for Funding
                                        </Button>
                                    </div>
                                </Card>
                            ))}
                        </div>
                    </div>
                )}

                {/* My Startup Tab */}
                {activeTab === 'my-startup' && (
                    <div className="space-y-6">
                        <Card>
                            <h3 className="font-bold mb-4">Register Your Startup</h3>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-bold text-gray-400 mb-2">Startup Name</label>
                                    <input
                                        placeholder="Your startup name"
                                        className="w-full bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white focus:border-primary outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-400 mb-2">Tagline</label>
                                    <input
                                        placeholder="One-line description of what you do"
                                        className="w-full bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white focus:border-primary outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-400 mb-2">Industry</label>
                                    <select className="w-full bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white focus:border-primary outline-none">
                                        <option value="">Select industry</option>
                                        <option value="technology">Technology</option>
                                        <option value="healthcare">Healthcare</option>
                                        <option value="education">Education</option>
                                        <option value="agriculture">Agriculture</option>
                                        <option value="fintech">FinTech</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-400 mb-2">Funding Goal (USD)</label>
                                    <input
                                        type="number"
                                        placeholder="500000"
                                        className="w-full bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white focus:border-primary outline-none"
                                    />
                                </div>
                                <Button
                                    onClick={() => addToast('Startup registered successfully!', 'success')}
                                    className="w-full"
                                >
                                    Register Startup
                                </Button>
                            </div>
                        </Card>
                    </div>
                )}

                {/* Investors Tab */}
                {activeTab === 'investors' && (
                    <div className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {investors.map(investor => (
                                <Card key={investor.id} className="hover:border-primary/50 transition-all cursor-pointer"
                                      onClick={() => {
                                          setSelectedInvestor(investor);
                                          setShowInvestorModal(true);
                                      }}>
                                    <div className="flex justify-between items-start mb-3">
                                        <div className="flex items-center gap-3">
                                            <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center text-black font-bold">
                                                {investor.avatar}
                                            </div>
                                            <div>
                                                <h3 className="font-bold">{investor.name}</h3>
                                                <p className="text-sm text-gray-400">{investor.location}</p>
                                            </div>
                                        </div>
                                        <Badge color={getInvestorTypeColor(investor.type)}>
                                            {investor.type.toUpperCase()}
                                        </Badge>
                                    </div>

                                    <p className="text-sm text-gray-300 mb-3">{investor.description}</p>

                                    <div className="mb-3">
                                        <p className="text-xs text-gray-400 mb-1">Focus Areas</p>
                                        <div className="flex flex-wrap gap-1">
                                            {investor.focus.map(area => (
                                                <span key={area} className="bg-green-500/20 text-green-300 px-2 py-1 rounded text-xs">
                                                    {area}
                                                </span>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="flex justify-between items-center text-xs">
                                        <div>
                                            <span className="text-gray-400">Investment Range: </span>
                                            <span className="font-bold">{formatCurrency(investor.minInvestment)} - {formatCurrency(investor.maxInvestment)}</span>
                                        </div>
                                        <Button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleConnectInvestor(investor);
                                            }}
                                            className="!py-1 !px-3 !text-xs"
                                        >
                                            Connect
                                        </Button>
                                    </div>
                                </Card>
                            ))}
                        </div>
                    </div>
                )}

                {/* Pitch Deck Tab */}
                {activeTab === 'pitch-deck' && (
                    <div className="space-y-6">
                        <Card>
                            <h3 className="font-bold mb-4">Pitch Deck Builder</h3>
                            <p className="text-sm text-gray-400 mb-4">
                                Create a compelling pitch deck to attract investors
                            </p>
                            
                            <div className="space-y-4">
                                {pitchDeck.slides.map((slide, index) => (
                                    <div key={index} className="bg-gray-800 p-4 rounded-lg border border-gray-600">
                                        <div className="flex justify-between items-center mb-2">
                                            <h4 className="font-bold">Slide {index + 1}: {slide.title}</h4>
                                            <div className="flex gap-2">
                                                <button className="text-blue-400 hover:text-blue-300">
                                                    <i className="fas fa-edit"></i>
                                                </button>
                                                <button className="text-red-400 hover:text-red-300">
                                                    <i className="fas fa-trash"></i>
                                                </button>
                                            </div>
                                        </div>
                                        <textarea
                                            value={slide.content}
                                            onChange={(e) => {
                                                const newSlides = [...pitchDeck.slides];
                                                newSlides[index].content = e.target.value;
                                                setPitchDeck({ slides: newSlides });
                                            }}
                                            rows={3}
                                            className="w-full bg-gray-700 border border-gray-600 rounded px-3 py-2 text-white focus:border-primary outline-none text-sm"
                                        />
                                    </div>
                                ))}
                            </div>
                            
                            <div className="flex gap-3 mt-4">
                                <Button
                                    onClick={() => addToast('Pitch deck saved!', 'success')}
                                    variant="outline"
                                    className="flex-1"
                                >
                                    Save Draft
                                </Button>
                                <Button
                                    onClick={() => addToast('Pitch deck exported as PDF!', 'success')}
                                    className="flex-1"
                                >
                                    Export PDF
                                </Button>
                            </div>
                        </Card>
                    </div>
                )}

                {/* Startup Detail Modal */}
                <Modal
                    isOpen={showStartupModal}
                    onClose={() => setShowStartupModal(false)}
                    title="Startup Details"
                >
                    {selectedStartup && (
                        <div className="space-y-4">
                            <div className="flex items-center gap-4">
                                <div className="w-16 h-16 bg-primary rounded-lg flex items-center justify-center text-black font-bold text-xl">
                                    {selectedStartup.logo}
                                </div>
                                <div>
                                    <h3 className="font-bold text-lg">{selectedStartup.name}</h3>
                                    <p className="text-gray-400">{selectedStartup.tagline}</p>
                                </div>
                            </div>
                            
                            <div>
                                <h4 className="font-bold mb-2">Description</h4>
                                <p className="text-sm text-gray-300">{selectedStartup.description}</p>
                            </div>
                            
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <h4 className="font-bold mb-2">Metrics</h4>
                                    <div className="space-y-1 text-sm">
                                        {selectedStartup.metrics.users && (
                                            <div>Users: <span className="font-bold">{selectedStartup.metrics.users.toLocaleString()}</span></div>
                                        )}
                                        {selectedStartup.metrics.revenue && (
                                            <div>Revenue: <span className="font-bold">{formatCurrency(selectedStartup.metrics.revenue)}</span></div>
                                        )}
                                        {selectedStartup.metrics.growth && (
                                            <div>Growth: <span className="font-bold text-green-400">{selectedStartup.metrics.growth}</span></div>
                                        )}
                                    </div>
                                </div>
                                <div>
                                    <h4 className="font-bold mb-2">Funding</h4>
                                    <div className="space-y-1 text-sm">
                                        <div>Goal: <span className="font-bold">{formatCurrency(selectedStartup.fundingGoal)}</span></div>
                                        <div>Raised: <span className="font-bold text-green-400">{formatCurrency(selectedStartup.currentFunding)}</span></div>
                                        <div>Equity: <span className="font-bold">{selectedStartup.equity}%</span></div>
                                    </div>
                                </div>
                            </div>
                            
                            <div>
                                <h4 className="font-bold mb-2">Founders</h4>
                                <div className="flex flex-wrap gap-2">
                                    {selectedStartup.founders.map(founder => (
                                        <span key={founder} className="bg-purple-500/20 text-purple-300 px-2 py-1 rounded text-xs">
                                            {founder}
                                        </span>
                                    ))}
                                </div>
                            </div>
                            
                            <Button
                                onClick={() => handleApplyForFunding(selectedStartup)}
                                className="w-full"
                            >
                                Apply for Funding
                            </Button>
                        </div>
                    )}
                </Modal>

                {/* Investor Detail Modal */}
                <Modal
                    isOpen={showInvestorModal}
                    onClose={() => setShowInvestorModal(false)}
                    title="Investor Details"
                >
                    {selectedInvestor && (
                        <div className="space-y-4">
                            <div className="flex items-center gap-4">
                                <div className="w-16 h-16 bg-green-500 rounded-lg flex items-center justify-center text-black font-bold text-xl">
                                    {selectedInvestor.avatar}
                                </div>
                                <div>
                                    <h3 className="font-bold text-lg">{selectedInvestor.name}</h3>
                                    <Badge color={getInvestorTypeColor(selectedInvestor.type)}>
                                        {selectedInvestor.type.toUpperCase()}
                                    </Badge>
                                </div>
                            </div>
                            
                            <div>
                                <h4 className="font-bold mb-2">About</h4>
                                <p className="text-sm text-gray-300">{selectedInvestor.description}</p>
                            </div>
                            
                            <div>
                                <h4 className="font-bold mb-2">Investment Details</h4>
                                <div className="grid grid-cols-2 gap-4 text-sm">
                                    <div>
                                        <span className="text-gray-400">Range: </span>
                                        <span className="font-bold">{formatCurrency(selectedInvestor.minInvestment)} - {formatCurrency(selectedInvestor.maxInvestment)}</span>
                                    </div>
                                    <div>
                                        <span className="text-gray-400">Portfolio: </span>
                                        <span className="font-bold">{selectedInvestor.portfolio} companies</span>
                                    </div>
                                </div>
                            </div>
                            
                            <div>
                                <h4 className="font-bold mb-2">Focus Areas</h4>
                                <div className="flex flex-wrap gap-2">
                                    {selectedInvestor.focus.map(area => (
                                        <span key={area} className="bg-green-500/20 text-green-300 px-2 py-1 rounded text-xs">
                                            {area}
                                        </span>
                                    ))}
                                </div>
                            </div>
                            
                            <Button
                                onClick={() => handleConnectInvestor(selectedInvestor)}
                                className="w-full"
                            >
                                Connect with Investor
                            </Button>
                        </div>
                    )}
                </Modal>
            </div>
        </div>
    );
};