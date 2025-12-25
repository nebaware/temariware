import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { StoreContext } from '../contexts/StoreContext';
import { ToastContext } from '../contexts/ToastContext';
import { Button } from '../components/common/Button';
import { Card } from '../components/common/Card';
import { Modal } from '../components/common/Modal';

interface PortfolioTemplate {
    id: string;
    name: string;
    description: string;
    preview: string;
    category: 'tech' | 'business' | 'creative' | 'academic';
}

export const AdvancedPortfolioPage: React.FC = () => {
    const navigate = useNavigate();
    const { state } = useContext(StoreContext);
    const { addToast } = useContext(ToastContext);
    const [activeTab, setActiveTab] = useState<'templates' | 'builder' | 'preview'>('templates');
    const [selectedTemplate, setSelectedTemplate] = useState<PortfolioTemplate | null>(null);
    const [showAISuggestions, setShowAISuggestions] = useState(false);
    const [portfolioData, setPortfolioData] = useState({
        theme: 'modern',
        sections: ['about', 'skills', 'projects', 'experience', 'education'],
        customSections: [] as string[]
    });

    const templates: PortfolioTemplate[] = [
        {
            id: 'modern-tech',
            name: 'Modern Tech',
            description: 'Clean, minimalist design perfect for developers',
            preview: '🖥️',
            category: 'tech'
        },
        {
            id: 'creative-showcase',
            name: 'Creative Showcase',
            description: 'Visual-heavy layout for designers and artists',
            preview: '🎨',
            category: 'creative'
        },
        {
            id: 'business-pro',
            name: 'Business Professional',
            description: 'Corporate-friendly design for business roles',
            preview: '💼',
            category: 'business'
        },
        {
            id: 'academic-research',
            name: 'Academic Research',
            description: 'Publication-focused layout for researchers',
            preview: '📚',
            category: 'academic'
        }
    ];

    const aiSuggestions = [
        'Add a "Certifications" section to showcase your verified skills',
        'Include a "Volunteer Work" section to demonstrate community involvement',
        'Consider adding a "Publications" section for your research papers',
        'Add a "Languages" section highlighting your multilingual abilities',
        'Include a "Awards & Recognition" section for achievements'
    ];

    const handleTemplateSelect = (template: PortfolioTemplate) => {
        setSelectedTemplate(template);
        setPortfolioData(prev => ({ ...prev, theme: template.id }));
        addToast(`Selected ${template.name} template`, 'success');
    };

    const handleAddCustomSection = () => {
        const sectionName = prompt('Enter custom section name:');
        if (sectionName) {
            setPortfolioData(prev => ({
                ...prev,
                customSections: [...prev.customSections, sectionName]
            }));
            addToast(`Added "${sectionName}" section`, 'success');
        }
    };

    const handleExportPortfolio = (format: 'pdf' | 'html' | 'json') => {
        addToast(`Exporting portfolio as ${format.toUpperCase()}...`, 'info');
        // Simulate export
        setTimeout(() => {
            addToast(`Portfolio exported successfully!`, 'success');
        }, 2000);
    };

    const handlePublishPortfolio = () => {
        const portfolioUrl = `https://temariware.onrender.com/portfolio/${state.user?.id}`;
        navigator.clipboard.writeText(portfolioUrl);
        addToast('Portfolio published! URL copied to clipboard', 'success');
    };

    return (
        <div className="min-h-screen bg-black text-white p-4 pb-24">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h1 className="text-2xl font-bold">Advanced Portfolio Builder</h1>
                        <p className="text-gray-400">Create a professional portfolio with AI assistance</p>
                    </div>
                    <Button onClick={() => navigate('/profile')} variant="outline">
                        <i className="fas fa-arrow-left mr-2"></i>Back
                    </Button>
                </div>

                {/* Tabs */}
                <div className="flex bg-gray-800 p-1 rounded-lg mb-6">
                    <button
                        onClick={() => setActiveTab('templates')}
                        className={`flex-1 py-2 px-4 rounded-md text-sm font-bold transition-all ${
                            activeTab === 'templates' ? 'bg-primary text-black' : 'text-gray-400'
                        }`}
                    >
                        Templates
                    </button>
                    <button
                        onClick={() => setActiveTab('builder')}
                        className={`flex-1 py-2 px-4 rounded-md text-sm font-bold transition-all ${
                            activeTab === 'builder' ? 'bg-primary text-black' : 'text-gray-400'
                        }`}
                    >
                        Builder
                    </button>
                    <button
                        onClick={() => setActiveTab('preview')}
                        className={`flex-1 py-2 px-4 rounded-md text-sm font-bold transition-all ${
                            activeTab === 'preview' ? 'bg-primary text-black' : 'text-gray-400'
                        }`}
                    >
                        Preview
                    </button>
                </div>

                {/* Templates Tab */}
                {activeTab === 'templates' && (
                    <div className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {templates.map(template => (
                                <Card
                                    key={template.id}
                                    className={`cursor-pointer transition-all hover:border-primary ${
                                        selectedTemplate?.id === template.id ? 'border-primary bg-primary/10' : ''
                                    }`}
                                    onClick={() => handleTemplateSelect(template)}
                                >
                                    <div className="text-center mb-4">
                                        <div className="text-4xl mb-2">{template.preview}</div>
                                        <h3 className="font-bold text-lg">{template.name}</h3>
                                        <p className="text-sm text-gray-400">{template.description}</p>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-xs bg-gray-700 px-2 py-1 rounded capitalize">
                                            {template.category}
                                        </span>
                                        {selectedTemplate?.id === template.id && (
                                            <i className="fas fa-check-circle text-primary"></i>
                                        )}
                                    </div>
                                </Card>
                            ))}
                        </div>
                    </div>
                )}

                {/* Builder Tab */}
                {activeTab === 'builder' && (
                    <div className="space-y-6">
                        {/* AI Suggestions */}
                        <Card>
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="font-bold">AI Portfolio Suggestions</h3>
                                <Button
                                    onClick={() => setShowAISuggestions(!showAISuggestions)}
                                    variant="outline"
                                    className="!py-1 !px-3 !text-xs"
                                >
                                    <i className="fas fa-robot mr-1"></i>
                                    {showAISuggestions ? 'Hide' : 'Show'} AI Tips
                                </Button>
                            </div>
                            {showAISuggestions && (
                                <div className="space-y-2">
                                    {aiSuggestions.map((suggestion, index) => (
                                        <div key={index} className="bg-blue-900/20 border border-blue-500/30 p-3 rounded-lg">
                                            <p className="text-sm text-blue-300">{suggestion}</p>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </Card>

                        {/* Section Manager */}
                        <Card>
                            <h3 className="font-bold mb-4">Portfolio Sections</h3>
                            <div className="space-y-3">
                                {portfolioData.sections.map(section => (
                                    <div key={section} className="flex justify-between items-center bg-gray-800 p-3 rounded-lg">
                                        <div className="flex items-center gap-3">
                                            <i className="fas fa-grip-vertical text-gray-500"></i>
                                            <span className="capitalize">{section}</span>
                                        </div>
                                        <div className="flex gap-2">
                                            <button className="text-blue-400 hover:text-blue-300">
                                                <i className="fas fa-edit"></i>
                                            </button>
                                            <button className="text-red-400 hover:text-red-300">
                                                <i className="fas fa-trash"></i>
                                            </button>
                                        </div>
                                    </div>
                                ))}
                                {portfolioData.customSections.map(section => (
                                    <div key={section} className="flex justify-between items-center bg-purple-900/20 border border-purple-500/30 p-3 rounded-lg">
                                        <div className="flex items-center gap-3">
                                            <i className="fas fa-grip-vertical text-gray-500"></i>
                                            <span>{section}</span>
                                            <span className="text-xs bg-purple-500/20 text-purple-300 px-2 py-1 rounded">Custom</span>
                                        </div>
                                        <div className="flex gap-2">
                                            <button className="text-blue-400 hover:text-blue-300">
                                                <i className="fas fa-edit"></i>
                                            </button>
                                            <button className="text-red-400 hover:text-red-300">
                                                <i className="fas fa-trash"></i>
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <Button onClick={handleAddCustomSection} variant="outline" className="w-full mt-4">
                                <i className="fas fa-plus mr-2"></i>Add Custom Section
                            </Button>
                        </Card>

                        {/* Theme Customization */}
                        <Card>
                            <h3 className="font-bold mb-4">Theme Customization</h3>
                            <div className="grid grid-cols-3 gap-3">
                                {['modern', 'classic', 'minimal', 'colorful', 'dark', 'light'].map(theme => (
                                    <button
                                        key={theme}
                                        onClick={() => setPortfolioData(prev => ({ ...prev, theme }))}
                                        className={`p-3 rounded-lg border-2 transition-all capitalize ${
                                            portfolioData.theme === theme
                                                ? 'border-primary bg-primary/10'
                                                : 'border-gray-600 hover:border-gray-500'
                                        }`}
                                    >
                                        {theme}
                                    </button>
                                ))}
                            </div>
                        </Card>
                    </div>
                )}

                {/* Preview Tab */}
                {activeTab === 'preview' && (
                    <div className="space-y-6">
                        <Card>
                            <div className="text-center mb-6">
                                <h3 className="text-xl font-bold mb-2">Portfolio Preview</h3>
                                <p className="text-gray-400">This is how your portfolio will look</p>
                            </div>
                            
                            {/* Mock Portfolio Preview */}
                            <div className="bg-gray-900 p-6 rounded-lg border">
                                <div className="text-center mb-6">
                                    <div className="w-20 h-20 bg-primary rounded-full mx-auto mb-4 flex items-center justify-center text-black font-bold text-2xl">
                                        {state.user?.name?.charAt(0) || 'U'}
                                    </div>
                                    <h2 className="text-2xl font-bold">{state.user?.name || 'Your Name'}</h2>
                                    <p className="text-gray-400">{state.user?.headline || 'Your Professional Title'}</p>
                                </div>
                                
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <h3 className="font-bold mb-3">About</h3>
                                        <p className="text-sm text-gray-300">{state.user?.bio || 'Your professional bio will appear here...'}</p>
                                    </div>
                                    <div>
                                        <h3 className="font-bold mb-3">Skills</h3>
                                        <div className="flex flex-wrap gap-2">
                                            {(state.user?.skills || ['React', 'Node.js', 'Python']).map(skill => (
                                                <span key={skill} className="bg-primary/20 text-primary px-2 py-1 rounded text-xs">
                                                    {skill}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </Card>

                        {/* Export Options */}
                        <Card>
                            <h3 className="font-bold mb-4">Export & Share</h3>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
                                <Button onClick={() => handleExportPortfolio('pdf')} variant="outline">
                                    <i className="fas fa-file-pdf mr-2"></i>PDF
                                </Button>
                                <Button onClick={() => handleExportPortfolio('html')} variant="outline">
                                    <i className="fas fa-code mr-2"></i>HTML
                                </Button>
                                <Button onClick={() => handleExportPortfolio('json')} variant="outline">
                                    <i className="fas fa-download mr-2"></i>JSON
                                </Button>
                                <Button onClick={handlePublishPortfolio} variant="primary">
                                    <i className="fas fa-share mr-2"></i>Publish
                                </Button>
                            </div>
                            <p className="text-xs text-gray-400">
                                Published portfolios get a public URL that you can share with employers
                            </p>
                        </Card>
                    </div>
                )}
            </div>
        </div>
    );
};