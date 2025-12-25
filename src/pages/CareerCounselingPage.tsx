import React, { useState, useContext } from 'react';
import { StoreContext } from '../contexts/StoreContext';
import { ToastContext } from '../contexts/ToastContext';
import { Button } from '../components/common/Button';
import { Card } from '../components/common/Card';
import { generateCareerRoadmap } from '../services/geminiService';

interface CareerAssessment {
    interests: string[];
    strengths: string[];
    goals: string;
    timeline: string;
    experience: string;
}

interface CareerPath {
    title: string;
    description: string;
    steps: string[];
    timeline: string;
    salary: string;
    growth: string;
    skills: string[];
}

export const CareerCounselingPage: React.FC = () => {
    const { state } = useContext(StoreContext);
    const { addToast } = useContext(ToastContext);
    const [activeTab, setActiveTab] = useState<'assessment' | 'analysis' | 'roadmap' | 'resources'>('assessment');
    const [assessment, setAssessment] = useState<CareerAssessment>({
        interests: [],
        strengths: [],
        goals: '',
        timeline: '',
        experience: ''
    });
    const [careerPaths, setCareerPaths] = useState<CareerPath[]>([]);
    const [selectedPath, setSelectedPath] = useState<CareerPath | null>(null);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [aiAdvice, setAiAdvice] = useState('');

    const interestOptions = [
        'Technology', 'Business', 'Healthcare', 'Education', 'Finance', 'Marketing',
        'Design', 'Engineering', 'Research', 'Entrepreneurship', 'Social Impact', 'Arts'
    ];

    const strengthOptions = [
        'Problem Solving', 'Leadership', 'Communication', 'Analytical Thinking', 'Creativity',
        'Technical Skills', 'Project Management', 'Teamwork', 'Innovation', 'Strategic Planning'
    ];

    const mockCareerPaths: CareerPath[] = [
        {
            title: 'Software Engineer',
            description: 'Build applications and systems using modern technologies',
            steps: ['Learn Programming', 'Build Projects', 'Get Internship', 'Junior Developer', 'Senior Engineer'],
            timeline: '2-3 years',
            salary: '80,000 - 150,000 ETB/month',
            growth: 'High demand, excellent growth prospects',
            skills: ['JavaScript', 'React', 'Node.js', 'Databases', 'Cloud Computing']
        },
        {
            title: 'Product Manager',
            description: 'Lead product development and strategy',
            steps: ['Business Analysis', 'Product Courses', 'Associate PM', 'Product Manager', 'Senior PM'],
            timeline: '3-4 years',
            salary: '100,000 - 200,000 ETB/month',
            growth: 'Strategic role with leadership opportunities',
            skills: ['Strategy', 'Analytics', 'User Research', 'Agile', 'Communication']
        },
        {
            title: 'Data Scientist',
            description: 'Extract insights from data to drive business decisions',
            steps: ['Statistics/Math', 'Python/R', 'ML Projects', 'Data Analyst', 'Data Scientist'],
            timeline: '2-4 years',
            salary: '90,000 - 180,000 ETB/month',
            growth: 'High demand in AI/ML era',
            skills: ['Python', 'Statistics', 'Machine Learning', 'SQL', 'Visualization']
        }
    ];

    const handleInterestToggle = (interest: string) => {
        setAssessment(prev => ({
            ...prev,
            interests: prev.interests.includes(interest)
                ? prev.interests.filter(i => i !== interest)
                : [...prev.interests, interest]
        }));
    };

    const handleStrengthToggle = (strength: string) => {
        setAssessment(prev => ({
            ...prev,
            strengths: prev.strengths.includes(strength)
                ? prev.strengths.filter(s => s !== strength)
                : [...prev.strengths, strength]
        }));
    };

    const handleAnalyzeCareer = async () => {
        if (assessment.interests.length === 0 || assessment.strengths.length === 0) {
            addToast('Please complete the assessment first', 'error');
            return;
        }

        setIsAnalyzing(true);
        setActiveTab('analysis');

        // Simulate AI analysis
        setTimeout(() => {
            setCareerPaths(mockCareerPaths);
            setIsAnalyzing(false);
            addToast('Career analysis complete!', 'success');
        }, 3000);
    };

    const handleGenerateRoadmap = async (path: CareerPath) => {
        setSelectedPath(path);
        setActiveTab('roadmap');
        
        if (state.user) {
            const roadmap = await generateCareerRoadmap(state.user);
            setAiAdvice(roadmap);
        }
    };

    return (
        <div className="min-h-screen bg-black text-white p-4 pb-24">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="text-center mb-6">
                    <h1 className="text-2xl font-bold mb-2">AI Career Counseling</h1>
                    <p className="text-gray-400">Get personalized career guidance powered by AI</p>
                </div>

                {/* Tabs */}
                <div className="flex bg-gray-800 p-1 rounded-lg mb-6 overflow-x-auto">
                    {[
                        { key: 'assessment', label: 'Assessment', icon: '📝' },
                        { key: 'analysis', label: 'Analysis', icon: '🔍' },
                        { key: 'roadmap', label: 'Roadmap', icon: '🗺️' },
                        { key: 'resources', label: 'Resources', icon: '📚' }
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

                {/* Assessment Tab */}
                {activeTab === 'assessment' && (
                    <div className="space-y-6">
                        <Card>
                            <h3 className="font-bold mb-4">Career Interests</h3>
                            <p className="text-sm text-gray-400 mb-4">Select areas that interest you (choose 3-5)</p>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                                {interestOptions.map(interest => (
                                    <button
                                        key={interest}
                                        onClick={() => handleInterestToggle(interest)}
                                        className={`p-3 rounded-lg border-2 transition-all text-sm ${
                                            assessment.interests.includes(interest)
                                                ? 'border-primary bg-primary/10 text-primary'
                                                : 'border-gray-600 hover:border-gray-500'
                                        }`}
                                    >
                                        {interest}
                                    </button>
                                ))}
                            </div>
                        </Card>

                        <Card>
                            <h3 className="font-bold mb-4">Your Strengths</h3>
                            <p className="text-sm text-gray-400 mb-4">Select your key strengths (choose 3-5)</p>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                                {strengthOptions.map(strength => (
                                    <button
                                        key={strength}
                                        onClick={() => handleStrengthToggle(strength)}
                                        className={`p-3 rounded-lg border-2 transition-all text-sm ${
                                            assessment.strengths.includes(strength)
                                                ? 'border-green-500 bg-green-500/10 text-green-400'
                                                : 'border-gray-600 hover:border-gray-500'
                                        }`}
                                    >
                                        {strength}
                                    </button>
                                ))}
                            </div>
                        </Card>

                        <Card>
                            <h3 className="font-bold mb-4">Career Goals & Timeline</h3>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-bold text-gray-400 mb-2">
                                        What are your career goals?
                                    </label>
                                    <textarea
                                        value={assessment.goals}
                                        onChange={(e) => setAssessment(prev => ({ ...prev, goals: e.target.value }))}
                                        placeholder="Describe your career aspirations..."
                                        rows={3}
                                        className="w-full bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white focus:border-primary outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-400 mb-2">
                                        Timeline for career change
                                    </label>
                                    <select
                                        value={assessment.timeline}
                                        onChange={(e) => setAssessment(prev => ({ ...prev, timeline: e.target.value }))}
                                        className="w-full bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white focus:border-primary outline-none"
                                    >
                                        <option value="">Select timeline</option>
                                        <option value="6months">6 months</option>
                                        <option value="1year">1 year</option>
                                        <option value="2years">2 years</option>
                                        <option value="3years">3+ years</option>
                                    </select>
                                </div>
                            </div>
                        </Card>

                        <Button
                            onClick={handleAnalyzeCareer}
                            disabled={assessment.interests.length === 0 || assessment.strengths.length === 0}
                            className="w-full"
                        >
                            <i className="fas fa-brain mr-2"></i>
                            Analyze My Career Path
                        </Button>
                    </div>
                )}

                {/* Analysis Tab */}
                {activeTab === 'analysis' && (
                    <div className="space-y-6">
                        {isAnalyzing ? (
                            <Card className="text-center py-12">
                                <div className="animate-spin w-12 h-12 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
                                <h3 className="font-bold mb-2">Analyzing Your Profile</h3>
                                <p className="text-gray-400">AI is processing your interests, strengths, and goals...</p>
                            </Card>
                        ) : careerPaths.length > 0 ? (
                            <>
                                <Card className="bg-gradient-to-r from-blue-900/50 to-purple-900/50 border-blue-500/30">
                                    <div className="flex items-center gap-4">
                                        <div className="text-3xl">🎯</div>
                                        <div>
                                            <h3 className="font-bold">Career Match Results</h3>
                                            <p className="text-sm text-gray-300">
                                                Based on your assessment, here are the best career paths for you
                                            </p>
                                        </div>
                                    </div>
                                </Card>

                                {careerPaths.map((path, index) => (
                                    <Card key={index} className="hover:border-primary/50 transition-all">
                                        <div className="flex justify-between items-start mb-4">
                                            <div>
                                                <h3 className="font-bold text-lg text-primary">{path.title}</h3>
                                                <p className="text-gray-400">{path.description}</p>
                                            </div>
                                            <div className="bg-green-500/20 text-green-400 px-3 py-1 rounded-full text-xs font-bold">
                                                {95 - index * 5}% Match
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                            <div>
                                                <p className="text-xs text-gray-400 mb-1">Expected Salary</p>
                                                <p className="font-bold text-green-400">{path.salary}</p>
                                            </div>
                                            <div>
                                                <p className="text-xs text-gray-400 mb-1">Timeline</p>
                                                <p className="font-bold">{path.timeline}</p>
                                            </div>
                                        </div>

                                        <div className="mb-4">
                                            <p className="text-xs text-gray-400 mb-2">Required Skills</p>
                                            <div className="flex flex-wrap gap-2">
                                                {path.skills.map(skill => (
                                                    <span key={skill} className="bg-blue-500/20 text-blue-300 px-2 py-1 rounded text-xs">
                                                        {skill}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>

                                        <Button
                                            onClick={() => handleGenerateRoadmap(path)}
                                            variant="outline"
                                            className="w-full"
                                        >
                                            Generate Detailed Roadmap
                                        </Button>
                                    </Card>
                                ))}
                            </>
                        ) : (
                            <Card className="text-center py-12">
                                <div className="text-4xl mb-4">📝</div>
                                <h3 className="font-bold mb-2">Complete Assessment First</h3>
                                <p className="text-gray-400">Go to the Assessment tab to analyze your career path</p>
                            </Card>
                        )}
                    </div>
                )}

                {/* Roadmap Tab */}
                {activeTab === 'roadmap' && (
                    <div className="space-y-6">
                        {selectedPath ? (
                            <>
                                <Card className="bg-gradient-to-r from-green-900/50 to-blue-900/50 border-green-500/30">
                                    <h3 className="font-bold text-lg mb-2">{selectedPath.title} Roadmap</h3>
                                    <p className="text-gray-300">{selectedPath.description}</p>
                                </Card>

                                <Card>
                                    <h3 className="font-bold mb-4">Step-by-Step Path</h3>
                                    <div className="space-y-4">
                                        {selectedPath.steps.map((step, index) => (
                                            <div key={index} className="flex items-center gap-4">
                                                <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-black font-bold text-sm">
                                                    {index + 1}
                                                </div>
                                                <div className="flex-1">
                                                    <p className="font-bold">{step}</p>
                                                    <p className="text-xs text-gray-400">
                                                        {index === 0 ? 'Start here' : 
                                                         index === selectedPath.steps.length - 1 ? 'Final goal' : 
                                                         `Step ${index + 1}`}
                                                    </p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </Card>

                                {aiAdvice && (
                                    <Card>
                                        <h3 className="font-bold mb-4 flex items-center gap-2">
                                            <i className="fas fa-robot text-primary"></i>
                                            AI Personalized Advice
                                        </h3>
                                        <div className="bg-blue-900/20 border border-blue-500/30 p-4 rounded-lg">
                                            <p className="text-sm text-blue-300 whitespace-pre-line">{aiAdvice}</p>
                                        </div>
                                    </Card>
                                )}
                            </>
                        ) : (
                            <Card className="text-center py-12">
                                <div className="text-4xl mb-4">🗺️</div>
                                <h3 className="font-bold mb-2">Select a Career Path</h3>
                                <p className="text-gray-400">Choose a career from the Analysis tab to see the roadmap</p>
                            </Card>
                        )}
                    </div>
                )}

                {/* Resources Tab */}
                {activeTab === 'resources' && (
                    <div className="space-y-6">
                        <Card>
                            <h3 className="font-bold mb-4">Learning Resources</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="bg-blue-900/20 border border-blue-500/30 p-4 rounded-lg">
                                    <h4 className="font-bold text-blue-300 mb-2">📚 Courses</h4>
                                    <p className="text-sm text-gray-300">Access curated courses for your career path</p>
                                </div>
                                <div className="bg-green-900/20 border border-green-500/30 p-4 rounded-lg">
                                    <h4 className="font-bold text-green-300 mb-2">🎓 Certifications</h4>
                                    <p className="text-sm text-gray-300">Industry-recognized certifications</p>
                                </div>
                                <div className="bg-purple-900/20 border border-purple-500/30 p-4 rounded-lg">
                                    <h4 className="font-bold text-purple-300 mb-2">👥 Mentorship</h4>
                                    <p className="text-sm text-gray-300">Connect with industry mentors</p>
                                </div>
                                <div className="bg-orange-900/20 border border-orange-500/30 p-4 rounded-lg">
                                    <h4 className="font-bold text-orange-300 mb-2">💼 Jobs</h4>
                                    <p className="text-sm text-gray-300">Relevant job opportunities</p>
                                </div>
                            </div>
                        </Card>
                    </div>
                )}
            </div>
        </div>
    );
};