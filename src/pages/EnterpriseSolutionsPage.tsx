import React, { useState, useContext } from 'react';
import { StoreContext } from '../contexts/StoreContext';
import { ToastContext } from '../contexts/ToastContext';
import { Button } from '../components/common/Button';
import { Card } from '../components/common/Card';
import { Badge } from '../components/common/Badge';
import { Modal } from '../components/common/Modal';

interface Enterprise {
    id: string;
    name: string;
    industry: string;
    size: string;
    location: string;
    logo: string;
    description: string;
    partnership: 'recruiting' | 'training' | 'incubation' | 'full';
    benefits: string[];
    openPositions: number;
    trainingPrograms: number;
    studentsHired: number;
}

interface CorporateProgram {
    id: string;
    title: string;
    company: string;
    type: 'internship' | 'graduate' | 'training' | 'scholarship';
    duration: string;
    stipend?: string;
    requirements: string[];
    description: string;
    applicationDeadline: string;
    startDate: string;
    spots: number;
    applied: number;
}

interface Partnership {
    id: string;
    company: string;
    type: 'university' | 'corporate' | 'government' | 'ngo';
    focus: string[];
    established: string;
    students: number;
    projects: number;
    description: string;
    benefits: string[];
}

export const EnterpriseSolutionsPage: React.FC = () => {
    const { state } = useContext(StoreContext);
    const { addToast } = useContext(ToastContext);
    const [activeTab, setActiveTab] = useState<'overview' | 'partners' | 'programs' | 'analytics' | 'solutions'>('overview');
    const [enterprises, setEnterprises] = useState<Enterprise[]>([]);
    const [programs, setPrograms] = useState<CorporateProgram[]>([]);
    const [partnerships, setPartnerships] = useState<Partnership[]>([]);
    const [selectedEnterprise, setSelectedEnterprise] = useState<Enterprise | null>(null);
    const [selectedProgram, setSelectedProgram] = useState<CorporateProgram | null>(null);
    const [showEnterpriseModal, setShowEnterpriseModal] = useState(false);
    const [showProgramModal, setShowProgramModal] = useState(false);

    const mockEnterprises: Enterprise[] = [
        {
            id: '1',
            name: 'Ethiopian Airlines',
            industry: 'Aviation',
            size: '10,000+ employees',
            location: 'Addis Ababa, Ethiopia',
            logo: 'EA',
            description: 'Africa\'s largest airline group, connecting Ethiopia to the world',
            partnership: 'full',
            benefits: ['Internship Programs', 'Graduate Schemes', 'Training Partnerships', 'Scholarship Programs'],
            openPositions: 45,
            trainingPrograms: 8,
            studentsHired: 120
        },
        {
            id: '2',
            name: 'Commercial Bank of Ethiopia',
            industry: 'Banking & Finance',
            size: '5,000+ employees',
            location: 'Addis Ababa, Ethiopia',
            logo: 'CBE',
            description: 'Ethiopia\'s largest commercial bank driving financial inclusion',
            partnership: 'recruiting',
            benefits: ['Graduate Programs', 'Fintech Innovation Lab', 'Digital Banking Training'],
            openPositions: 30,
            trainingPrograms: 5,
            studentsHired: 85
        },
        {
            id: '3',
            name: 'Ethio Telecom',
            industry: 'Telecommunications',
            size: '8,000+ employees',
            location: 'Addis Ababa, Ethiopia',
            logo: 'ET',
            description: 'Leading telecommunications provider in Ethiopia',
            partnership: 'training',
            benefits: ['Tech Training Programs', 'Network Engineering Courses', 'Digital Skills Development'],
            openPositions: 25,
            trainingPrograms: 12,
            studentsHired: 95
        },
        {
            id: '4',
            name: 'Microsoft Ethiopia',
            industry: 'Technology',
            size: '200+ employees',
            location: 'Addis Ababa, Ethiopia',
            logo: 'MS',
            description: 'Global technology leader with local Ethiopian operations',
            partnership: 'incubation',
            benefits: ['Startup Incubation', 'Cloud Training', 'AI/ML Workshops', 'Certification Programs'],
            openPositions: 15,
            trainingPrograms: 20,
            studentsHired: 40
        }
    ];

    const mockPrograms: CorporateProgram[] = [
        {
            id: '1',
            title: 'Aviation Technology Graduate Program',
            company: 'Ethiopian Airlines',
            type: 'graduate',
            duration: '18 months',
            stipend: '15,000 ETB/month',
            requirements: ['Engineering Degree', 'GPA 3.5+', 'English Proficiency'],
            description: 'Comprehensive program covering aviation technology, maintenance, and operations',
            applicationDeadline: '2024-03-15',
            startDate: '2024-07-01',
            spots: 20,
            applied: 145
        },
        {
            id: '2',
            title: 'Digital Banking Internship',
            company: 'Commercial Bank of Ethiopia',
            type: 'internship',
            duration: '6 months',
            stipend: '8,000 ETB/month',
            requirements: ['Computer Science/IT Degree', 'Programming Skills', 'Financial Interest'],
            description: 'Work on digital banking solutions and fintech innovations',
            applicationDeadline: '2024-02-28',
            startDate: '2024-06-01',
            spots: 15,
            applied: 89
        },
        {
            id: '3',
            title: 'Cloud Computing Scholarship',
            company: 'Microsoft Ethiopia',
            type: 'scholarship',
            duration: '12 months',
            stipend: 'Full tuition + 10,000 ETB/month',
            requirements: ['STEM Background', 'Academic Excellence', 'Leadership Potential'],
            description: 'Full scholarship for cloud computing and AI specialization',
            applicationDeadline: '2024-04-30',
            startDate: '2024-09-01',
            spots: 10,
            applied: 234
        }
    ];

    const mockPartnerships: Partnership[] = [
        {
            id: '1',
            company: 'Addis Ababa University',
            type: 'university',
            focus: ['Research Collaboration', 'Student Exchange', 'Joint Programs'],
            established: '2020',
            students: 2500,
            projects: 45,
            description: 'Strategic partnership for research and academic excellence',
            benefits: ['Research Funding', 'Faculty Exchange', 'Student Scholarships']
        },
        {
            id: '2',
            company: 'World Bank Group',
            type: 'ngo',
            focus: ['Digital Skills', 'Entrepreneurship', 'Financial Inclusion'],
            established: '2019',
            students: 1200,
            projects: 12,
            description: 'Supporting digital transformation and entrepreneurship in Ethiopia',
            benefits: ['Funding Programs', 'Technical Assistance', 'Global Network Access']
        }
    ];

    React.useEffect(() => {
        setEnterprises(mockEnterprises);
        setPrograms(mockPrograms);
        setPartnerships(mockPartnerships);
    }, []);

    const getPartnershipColor = (type: string) => {
        switch (type) {
            case 'recruiting': return 'bg-blue-500/20 text-blue-400';
            case 'training': return 'bg-green-500/20 text-green-400';
            case 'incubation': return 'bg-purple-500/20 text-purple-400';
            case 'full': return 'bg-yellow-500/20 text-yellow-400';
            default: return 'bg-gray-500/20 text-gray-400';
        }
    };

    const getProgramTypeColor = (type: string) => {
        switch (type) {
            case 'internship': return 'bg-blue-500/20 text-blue-400';
            case 'graduate': return 'bg-green-500/20 text-green-400';
            case 'training': return 'bg-purple-500/20 text-purple-400';
            case 'scholarship': return 'bg-yellow-500/20 text-yellow-400';
            default: return 'bg-gray-500/20 text-gray-400';
        }
    };

    const handleApplyProgram = (program: CorporateProgram) => {
        addToast(`Applied to ${program.title} at ${program.company}`, 'success');
    };

    const handleContactEnterprise = (enterprise: Enterprise) => {
        addToast(`Contact request sent to ${enterprise.name}`, 'success');
    };

    return (
        <div className="min-h-screen bg-black text-white p-4 pb-24">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="text-center mb-6">
                    <h1 className="text-2xl font-bold mb-2">Enterprise Solutions</h1>
                    <p className="text-gray-400">Corporate partnerships and B2B solutions for talent development</p>
                </div>

                {/* Tabs */}
                <div className="flex bg-gray-800 p-1 rounded-lg mb-6 overflow-x-auto">
                    {[
                        { key: 'overview', label: 'Overview', icon: '📊' },
                        { key: 'partners', label: 'Partners', icon: '🤝' },
                        { key: 'programs', label: 'Programs', icon: '🎓' },
                        { key: 'analytics', label: 'Analytics', icon: '📈' },
                        { key: 'solutions', label: 'Solutions', icon: '💼' }
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

                {/* Overview Tab */}
                {activeTab === 'overview' && (
                    <div className="space-y-6">
                        {/* Stats Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                            <Card className="text-center">
                                <div className="text-2xl font-bold text-primary mb-1">50+</div>
                                <div className="text-sm text-gray-400">Enterprise Partners</div>
                            </Card>
                            <Card className="text-center">
                                <div className="text-2xl font-bold text-green-400 mb-1">2,500+</div>
                                <div className="text-sm text-gray-400">Students Placed</div>
                            </Card>
                            <Card className="text-center">
                                <div className="text-2xl font-bold text-blue-400 mb-1">150+</div>
                                <div className="text-sm text-gray-400">Active Programs</div>
                            </Card>
                            <Card className="text-center">
                                <div className="text-2xl font-bold text-purple-400 mb-1">95%</div>
                                <div className="text-sm text-gray-400">Success Rate</div>
                            </Card>
                        </div>

                        {/* Featured Partnerships */}
                        <Card className="bg-gradient-to-r from-blue-900/50 to-purple-900/50 border-blue-500/30">
                            <div className="flex items-center gap-4">
                                <div className="text-3xl">🏢</div>
                                <div>
                                    <h3 className="font-bold">Enterprise Partnerships</h3>
                                    <p className="text-sm text-gray-300">
                                        Connecting students with leading Ethiopian and international companies
                                    </p>
                                </div>
                            </div>
                        </Card>

                        {/* Recent Activity */}
                        <Card>
                            <h3 className="font-bold mb-4">Recent Activity</h3>
                            <div className="space-y-3">
                                <div className="flex items-center gap-3 p-3 bg-gray-800 rounded-lg">
                                    <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                                    <div>
                                        <p className="text-sm font-bold">New Partnership Signed</p>
                                        <p className="text-xs text-gray-400">Ethiopian Airlines expanded their graduate program</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 p-3 bg-gray-800 rounded-lg">
                                    <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                                    <div>
                                        <p className="text-sm font-bold">Program Launch</p>
                                        <p className="text-xs text-gray-400">Microsoft Ethiopia launched AI/ML scholarship program</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 p-3 bg-gray-800 rounded-lg">
                                    <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                                    <div>
                                        <p className="text-sm font-bold">Student Placement</p>
                                        <p className="text-xs text-gray-400">25 students placed at Commercial Bank of Ethiopia</p>
                                    </div>
                                </div>
                            </div>
                        </Card>
                    </div>
                )}

                {/* Partners Tab */}
                {activeTab === 'partners' && (
                    <div className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {enterprises.map(enterprise => (
                                <Card key={enterprise.id} className="hover:border-primary/50 transition-all cursor-pointer"
                                      onClick={() => {
                                          setSelectedEnterprise(enterprise);
                                          setShowEnterpriseModal(true);
                                      }}>
                                    <div className="flex justify-between items-start mb-3">
                                        <div className="flex items-center gap-3">
                                            <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center text-black font-bold">
                                                {enterprise.logo}
                                            </div>
                                            <div>
                                                <h3 className="font-bold">{enterprise.name}</h3>
                                                <p className="text-sm text-gray-400">{enterprise.industry}</p>
                                                <p className="text-xs text-gray-500">{enterprise.size}</p>
                                            </div>
                                        </div>
                                        <Badge color={getPartnershipColor(enterprise.partnership)}>
                                            {enterprise.partnership.toUpperCase()}
                                        </Badge>
                                    </div>

                                    <p className="text-sm text-gray-300 mb-3">{enterprise.description}</p>

                                    <div className="grid grid-cols-3 gap-4 mb-3 text-center">
                                        <div>
                                            <div className="text-lg font-bold text-primary">{enterprise.openPositions}</div>
                                            <div className="text-xs text-gray-400">Open Positions</div>
                                        </div>
                                        <div>
                                            <div className="text-lg font-bold text-green-400">{enterprise.trainingPrograms}</div>
                                            <div className="text-xs text-gray-400">Programs</div>
                                        </div>
                                        <div>
                                            <div className="text-lg font-bold text-blue-400">{enterprise.studentsHired}</div>
                                            <div className="text-xs text-gray-400">Students Hired</div>
                                        </div>
                                    </div>

                                    <Button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleContactEnterprise(enterprise);
                                        }}
                                        variant="outline"
                                        className="w-full !py-1 !text-xs"
                                    >
                                        Contact Partner
                                    </Button>
                                </Card>
                            ))}
                        </div>
                    </div>
                )}

                {/* Programs Tab */}
                {activeTab === 'programs' && (
                    <div className="space-y-4">
                        {programs.map(program => (
                            <Card key={program.id} className="hover:border-primary/50 transition-all cursor-pointer"
                                  onClick={() => {
                                      setSelectedProgram(program);
                                      setShowProgramModal(true);
                                  }}>
                                <div className="flex justify-between items-start mb-3">
                                    <div>
                                        <h3 className="font-bold text-lg">{program.title}</h3>
                                        <p className="text-gray-400">{program.company}</p>
                                        <p className="text-sm text-gray-500">{program.duration}</p>
                                    </div>
                                    <div className="text-right">
                                        <Badge color={getProgramTypeColor(program.type)}>
                                            {program.type.toUpperCase()}
                                        </Badge>
                                        {program.stipend && (
                                            <p className="text-sm font-bold text-primary mt-1">{program.stipend}</p>
                                        )}
                                    </div>
                                </div>

                                <p className="text-sm text-gray-300 mb-3">{program.description}</p>

                                <div className="mb-3">
                                    <h4 className="font-bold text-sm mb-2">Requirements:</h4>
                                    <div className="flex flex-wrap gap-2">
                                        {program.requirements.map(req => (
                                            <span key={req} className="bg-blue-500/20 text-blue-300 px-2 py-1 rounded text-xs">
                                                {req}
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                <div className="flex justify-between items-center">
                                    <div className="text-xs text-gray-400">
                                        <span>Deadline: {new Date(program.applicationDeadline).toLocaleDateString()}</span>
                                        <span className="ml-4">{program.applied}/{program.spots} applied</span>
                                    </div>
                                    <Button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleApplyProgram(program);
                                        }}
                                        className="!py-1 !px-3 !text-xs"
                                    >
                                        Apply Now
                                    </Button>
                                </div>
                            </Card>
                        ))}
                    </div>
                )}

                {/* Analytics Tab */}
                {activeTab === 'analytics' && (
                    <div className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <Card>
                                <h3 className="font-bold mb-4">Partnership Growth</h3>
                                <div className="space-y-3">
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm">2024</span>
                                        <div className="flex-1 mx-3 bg-gray-700 rounded-full h-2">
                                            <div className="bg-primary h-2 rounded-full" style={{ width: '85%' }}></div>
                                        </div>
                                        <span className="text-sm font-bold">50 partners</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm">2023</span>
                                        <div className="flex-1 mx-3 bg-gray-700 rounded-full h-2">
                                            <div className="bg-blue-400 h-2 rounded-full" style={{ width: '65%' }}></div>
                                        </div>
                                        <span className="text-sm font-bold">35 partners</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm">2022</span>
                                        <div className="flex-1 mx-3 bg-gray-700 rounded-full h-2">
                                            <div className="bg-green-400 h-2 rounded-full" style={{ width: '45%' }}></div>
                                        </div>
                                        <span className="text-sm font-bold">22 partners</span>
                                    </div>
                                </div>
                            </Card>

                            <Card>
                                <h3 className="font-bold mb-4">Student Placements by Industry</h3>
                                <div className="space-y-3">
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm">Technology</span>
                                        <span className="text-sm font-bold text-primary">35%</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm">Banking & Finance</span>
                                        <span className="text-sm font-bold text-green-400">25%</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm">Aviation</span>
                                        <span className="text-sm font-bold text-blue-400">20%</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm">Telecommunications</span>
                                        <span className="text-sm font-bold text-purple-400">15%</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm">Other</span>
                                        <span className="text-sm font-bold text-gray-400">5%</span>
                                    </div>
                                </div>
                            </Card>
                        </div>

                        <Card>
                            <h3 className="font-bold mb-4">Success Metrics</h3>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div className="text-center">
                                    <div className="text-3xl font-bold text-primary mb-2">95%</div>
                                    <div className="text-sm text-gray-400">Program Completion Rate</div>
                                </div>
                                <div className="text-center">
                                    <div className="text-3xl font-bold text-green-400 mb-2">88%</div>
                                    <div className="text-sm text-gray-400">Job Placement Rate</div>
                                </div>
                                <div className="text-center">
                                    <div className="text-3xl font-bold text-blue-400 mb-2">92%</div>
                                    <div className="text-sm text-gray-400">Partner Satisfaction</div>
                                </div>
                            </div>
                        </Card>
                    </div>
                )}

                {/* Solutions Tab */}
                {activeTab === 'solutions' && (
                    <div className="space-y-6">
                        <Card>
                            <h3 className="font-bold mb-4">Enterprise Solutions</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="bg-blue-900/20 border border-blue-500/30 p-4 rounded-lg">
                                    <h4 className="font-bold text-blue-300 mb-2">🎯 Talent Acquisition</h4>
                                    <p className="text-sm text-gray-300 mb-3">Access pre-screened, skilled graduates ready for immediate impact</p>
                                    <ul className="text-xs text-gray-400 space-y-1">
                                        <li>• Customized recruitment pipelines</li>
                                        <li>• Skills-based candidate matching</li>
                                        <li>• Reduced hiring time and costs</li>
                                    </ul>
                                </div>
                                
                                <div className="bg-green-900/20 border border-green-500/30 p-4 rounded-lg">
                                    <h4 className="font-bold text-green-300 mb-2">📚 Corporate Training</h4>
                                    <p className="text-sm text-gray-300 mb-3">Upskill your workforce with industry-relevant training programs</p>
                                    <ul className="text-xs text-gray-400 space-y-1">
                                        <li>• Custom curriculum development</li>
                                        <li>• Expert instructor network</li>
                                        <li>• Certification and assessment</li>
                                    </ul>
                                </div>
                                
                                <div className="bg-purple-900/20 border border-purple-500/30 p-4 rounded-lg">
                                    <h4 className="font-bold text-purple-300 mb-2">🚀 Innovation Labs</h4>
                                    <p className="text-sm text-gray-300 mb-3">Collaborate on R&D projects with top university talent</p>
                                    <ul className="text-xs text-gray-400 space-y-1">
                                        <li>• Student project partnerships</li>
                                        <li>• Research collaboration</li>
                                        <li>• Innovation challenges</li>
                                    </ul>
                                </div>
                                
                                <div className="bg-yellow-900/20 border border-yellow-500/30 p-4 rounded-lg">
                                    <h4 className="font-bold text-yellow-300 mb-2">🤝 Strategic Partnerships</h4>
                                    <p className="text-sm text-gray-300 mb-3">Long-term partnerships for sustainable talent development</p>
                                    <ul className="text-xs text-gray-400 space-y-1">
                                        <li>• Graduate program development</li>
                                        <li>• Scholarship sponsorships</li>
                                        <li>• Brand visibility on platform</li>
                                    </ul>
                                </div>
                            </div>
                        </Card>

                        <Card>
                            <h3 className="font-bold mb-4">Get Started</h3>
                            <p className="text-gray-300 mb-4">
                                Ready to partner with TemariWare? Contact our enterprise team to discuss custom solutions for your organization.
                            </p>
                            <div className="flex gap-3">
                                <Button className="flex-1">
                                    Schedule Consultation
                                </Button>
                                <Button variant="outline" className="flex-1">
                                    Download Brochure
                                </Button>
                            </div>
                        </Card>
                    </div>
                )}

                {/* Enterprise Detail Modal */}
                <Modal
                    isOpen={showEnterpriseModal}
                    onClose={() => setShowEnterpriseModal(false)}
                    title="Enterprise Partner"
                >
                    {selectedEnterprise && (
                        <div className="space-y-4">
                            <div className="flex items-center gap-4">
                                <div className="w-16 h-16 bg-primary rounded-lg flex items-center justify-center text-black font-bold text-xl">
                                    {selectedEnterprise.logo}
                                </div>
                                <div>
                                    <h3 className="font-bold text-xl">{selectedEnterprise.name}</h3>
                                    <p className="text-gray-400">{selectedEnterprise.industry}</p>
                                    <p className="text-sm text-gray-500">{selectedEnterprise.size}</p>
                                </div>
                            </div>

                            <div>
                                <h4 className="font-bold mb-2">About</h4>
                                <p className="text-sm text-gray-300">{selectedEnterprise.description}</p>
                            </div>

                            <div>
                                <h4 className="font-bold mb-2">Partnership Benefits</h4>
                                <ul className="text-sm text-gray-300 space-y-1">
                                    {selectedEnterprise.benefits.map((benefit, index) => (
                                        <li key={index}>• {benefit}</li>
                                    ))}
                                </ul>
                            </div>

                            <div className="grid grid-cols-3 gap-4 text-center">
                                <div>
                                    <div className="text-lg font-bold text-primary">{selectedEnterprise.openPositions}</div>
                                    <div className="text-xs text-gray-400">Open Positions</div>
                                </div>
                                <div>
                                    <div className="text-lg font-bold text-green-400">{selectedEnterprise.trainingPrograms}</div>
                                    <div className="text-xs text-gray-400">Training Programs</div>
                                </div>
                                <div>
                                    <div className="text-lg font-bold text-blue-400">{selectedEnterprise.studentsHired}</div>
                                    <div className="text-xs text-gray-400">Students Hired</div>
                                </div>
                            </div>

                            <Button
                                onClick={() => handleContactEnterprise(selectedEnterprise)}
                                className="w-full"
                            >
                                Contact Partner
                            </Button>
                        </div>
                    )}
                </Modal>

                {/* Program Detail Modal */}
                <Modal
                    isOpen={showProgramModal}
                    onClose={() => setShowProgramModal(false)}
                    title="Program Details"
                >
                    {selectedProgram && (
                        <div className="space-y-4">
                            <div>
                                <h3 className="font-bold text-xl mb-2">{selectedProgram.title}</h3>
                                <p className="text-gray-400">{selectedProgram.company}</p>
                                <Badge color={getProgramTypeColor(selectedProgram.type)}>
                                    {selectedProgram.type.toUpperCase()}
                                </Badge>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <h4 className="font-bold mb-1">Duration</h4>
                                    <p className="text-sm">{selectedProgram.duration}</p>
                                </div>
                                <div>
                                    <h4 className="font-bold mb-1">Stipend</h4>
                                    <p className="text-sm text-primary">{selectedProgram.stipend || 'Not specified'}</p>
                                </div>
                                <div>
                                    <h4 className="font-bold mb-1">Start Date</h4>
                                    <p className="text-sm">{new Date(selectedProgram.startDate).toLocaleDateString()}</p>
                                </div>
                                <div>
                                    <h4 className="font-bold mb-1">Application Deadline</h4>
                                    <p className="text-sm">{new Date(selectedProgram.applicationDeadline).toLocaleDateString()}</p>
                                </div>
                            </div>

                            <div>
                                <h4 className="font-bold mb-2">Description</h4>
                                <p className="text-sm text-gray-300">{selectedProgram.description}</p>
                            </div>

                            <div>
                                <h4 className="font-bold mb-2">Requirements</h4>
                                <div className="flex flex-wrap gap-2">
                                    {selectedProgram.requirements.map(req => (
                                        <span key={req} className="bg-blue-500/20 text-blue-300 px-2 py-1 rounded text-xs">
                                            {req}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            <div className="flex justify-between items-center pt-4">
                                <span className="text-sm text-gray-400">
                                    {selectedProgram.applied}/{selectedProgram.spots} applications
                                </span>
                                <Button
                                    onClick={() => handleApplyProgram(selectedProgram)}
                                >
                                    Apply Now
                                </Button>
                            </div>
                        </div>
                    )}
                </Modal>
            </div>
        </div>
    );
};