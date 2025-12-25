import React, { useState, useContext } from 'react';
import { StoreContext } from '../contexts/StoreContext';
import { ToastContext } from '../contexts/ToastContext';
import { Button } from '../components/common/Button';
import { Card } from '../components/common/Card';
import { Badge } from '../components/common/Badge';
import { Modal } from '../components/common/Modal';

interface GlobalJob {
    id: string;
    title: string;
    company: string;
    location: string;
    country: string;
    type: 'remote' | 'hybrid' | 'onsite';
    salary: {
        min: number;
        max: number;
        currency: string;
    };
    experience: string;
    skills: string[];
    description: string;
    benefits: string[];
    visaSponsorship: boolean;
    relocationAssistance: boolean;
    timeZone?: string;
    applicationDeadline: string;
    featured: boolean;
}

interface Country {
    code: string;
    name: string;
    flag: string;
    jobCount: number;
}

export const InternationalJobsPage: React.FC = () => {
    const { state } = useContext(StoreContext);
    const { addToast } = useContext(ToastContext);
    const [activeTab, setActiveTab] = useState<'browse' | 'remote' | 'visa' | 'relocation'>('browse');
    const [jobs, setJobs] = useState<GlobalJob[]>([]);
    const [selectedJob, setSelectedJob] = useState<GlobalJob | null>(null);
    const [showJobModal, setShowJobModal] = useState(false);
    const [filters, setFilters] = useState({
        country: 'all',
        type: 'all',
        visaSponsorship: false,
        salaryMin: 0
    });

    const countries: Country[] = [
        { code: 'US', name: 'United States', flag: '🇺🇸', jobCount: 1250 },
        { code: 'CA', name: 'Canada', flag: '🇨🇦', jobCount: 450 },
        { code: 'GB', name: 'United Kingdom', flag: '🇬🇧', jobCount: 380 },
        { code: 'DE', name: 'Germany', flag: '🇩🇪', jobCount: 320 },
        { code: 'AU', name: 'Australia', flag: '🇦🇺', jobCount: 280 },
        { code: 'SG', name: 'Singapore', flag: '🇸🇬', jobCount: 190 },
        { code: 'AE', name: 'UAE', flag: '🇦🇪', jobCount: 150 },
        { code: 'NL', name: 'Netherlands', flag: '🇳🇱', jobCount: 140 }
    ];

    const mockJobs: GlobalJob[] = [
        {
            id: '1',
            title: 'Senior Software Engineer',
            company: 'TechGlobal Inc.',
            location: 'San Francisco, CA',
            country: 'US',
            type: 'hybrid',
            salary: { min: 120000, max: 180000, currency: 'USD' },
            experience: '3-5 years',
            skills: ['React', 'Node.js', 'TypeScript', 'AWS'],
            description: 'Join our team building next-generation web applications',
            benefits: ['Health Insurance', '401k', 'Stock Options', 'Flexible Hours'],
            visaSponsorship: true,
            relocationAssistance: true,
            timeZone: 'PST',
            applicationDeadline: '2024-02-15',
            featured: true
        },
        {
            id: '2',
            title: 'DevOps Engineer',
            company: 'CloudFirst Solutions',
            location: 'Remote',
            country: 'CA',
            type: 'remote',
            salary: { min: 80000, max: 120000, currency: 'CAD' },
            experience: '2-4 years',
            skills: ['Docker', 'Kubernetes', 'AWS', 'Terraform'],
            description: 'Remote-first company seeking DevOps expertise',
            benefits: ['Remote Work', 'Health Benefits', 'Learning Budget'],
            visaSponsorship: false,
            relocationAssistance: false,
            timeZone: 'EST',
            applicationDeadline: '2024-02-20',
            featured: false
        },
        {
            id: '3',
            title: 'Product Manager',
            company: 'Innovation Labs',
            location: 'London, UK',
            country: 'GB',
            type: 'onsite',
            salary: { min: 60000, max: 90000, currency: 'GBP' },
            experience: '4-6 years',
            skills: ['Product Strategy', 'Analytics', 'Agile', 'User Research'],
            description: 'Lead product development for fintech solutions',
            benefits: ['Pension', 'Health Insurance', 'Visa Sponsorship'],
            visaSponsorship: true,
            relocationAssistance: true,
            applicationDeadline: '2024-02-25',
            featured: true
        }
    ];

    React.useEffect(() => {
        setJobs(mockJobs);
    }, []);

    const filteredJobs = jobs.filter(job => {
        if (filters.country !== 'all' && job.country !== filters.country) return false;
        if (filters.type !== 'all' && job.type !== filters.type) return false;
        if (filters.visaSponsorship && !job.visaSponsorship) return false;
        if (job.salary.min < filters.salaryMin) return false;
        return true;
    });

    const getTypeColor = (type: string) => {
        switch (type) {
            case 'remote': return 'bg-green-500/20 text-green-400';
            case 'hybrid': return 'bg-blue-500/20 text-blue-400';
            case 'onsite': return 'bg-orange-500/20 text-orange-400';
            default: return 'bg-gray-500/20 text-gray-400';
        }
    };

    const formatSalary = (salary: GlobalJob['salary']) => {
        const formatter = new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: salary.currency,
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        });
        return `${formatter.format(salary.min)} - ${formatter.format(salary.max)}`;
    };

    const handleApplyJob = (job: GlobalJob) => {
        addToast(`Applied to ${job.title} at ${job.company}`, 'success');
    };

    const handleSaveJob = (job: GlobalJob) => {
        addToast(`Saved ${job.title} to your list`, 'success');
    };

    return (
        <div className="min-h-screen bg-black text-white p-4 pb-24">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="text-center mb-6">
                    <h1 className="text-2xl font-bold mb-2">International Job Marketplace</h1>
                    <p className="text-gray-400">Discover global opportunities and remote work positions</p>
                </div>

                {/* Tabs */}
                <div className="flex bg-gray-800 p-1 rounded-lg mb-6 overflow-x-auto">
                    {[
                        { key: 'browse', label: 'Browse Jobs', icon: '🌍' },
                        { key: 'remote', label: 'Remote Only', icon: '💻' },
                        { key: 'visa', label: 'Visa Sponsor', icon: '✈️' },
                        { key: 'relocation', label: 'Relocation', icon: '📦' }
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

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                    {/* Filters Sidebar */}
                    <div className="lg:col-span-1">
                        <Card>
                            <h3 className="font-bold mb-4">Filters</h3>
                            
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-bold text-gray-400 mb-2">Country</label>
                                    <select
                                        value={filters.country}
                                        onChange={(e) => setFilters(prev => ({ ...prev, country: e.target.value }))}
                                        className="w-full bg-gray-800 border border-gray-600 rounded px-3 py-2 text-white focus:border-primary outline-none text-sm"
                                    >
                                        <option value="all">All Countries</option>
                                        {countries.map(country => (
                                            <option key={country.code} value={country.code}>
                                                {country.flag} {country.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-bold text-gray-400 mb-2">Work Type</label>
                                    <select
                                        value={filters.type}
                                        onChange={(e) => setFilters(prev => ({ ...prev, type: e.target.value }))}
                                        className="w-full bg-gray-800 border border-gray-600 rounded px-3 py-2 text-white focus:border-primary outline-none text-sm"
                                    >
                                        <option value="all">All Types</option>
                                        <option value="remote">Remote</option>
                                        <option value="hybrid">Hybrid</option>
                                        <option value="onsite">On-site</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="flex items-center gap-2">
                                        <input
                                            type="checkbox"
                                            checked={filters.visaSponsorship}
                                            onChange={(e) => setFilters(prev => ({ ...prev, visaSponsorship: e.target.checked }))}
                                            className="rounded"
                                        />
                                        <span className="text-sm">Visa Sponsorship</span>
                                    </label>
                                </div>

                                <div>
                                    <label className="block text-sm font-bold text-gray-400 mb-2">
                                        Min Salary (USD)
                                    </label>
                                    <input
                                        type="range"
                                        min="0"
                                        max="200000"
                                        step="10000"
                                        value={filters.salaryMin}
                                        onChange={(e) => setFilters(prev => ({ ...prev, salaryMin: parseInt(e.target.value) }))}
                                        className="w-full"
                                    />
                                    <div className="text-xs text-gray-400 mt-1">
                                        ${filters.salaryMin.toLocaleString()}+
                                    </div>
                                </div>
                            </div>
                        </Card>

                        {/* Country Stats */}
                        <Card className="mt-4">
                            <h3 className="font-bold mb-4">Top Countries</h3>
                            <div className="space-y-2">
                                {countries.slice(0, 5).map(country => (
                                    <div key={country.code} className="flex justify-between items-center">
                                        <span className="text-sm">{country.flag} {country.name}</span>
                                        <span className="text-xs text-gray-400">{country.jobCount}</span>
                                    </div>
                                ))}
                            </div>
                        </Card>
                    </div>

                    {/* Jobs List */}
                    <div className="lg:col-span-3">
                        {/* Stats Bar */}
                        <div className="flex justify-between items-center mb-4">
                            <p className="text-sm text-gray-400">
                                {filteredJobs.length} jobs found
                            </p>
                            <select className="bg-gray-800 border border-gray-600 rounded px-3 py-1 text-white text-sm">
                                <option>Most Recent</option>
                                <option>Highest Salary</option>
                                <option>Most Relevant</option>
                            </select>
                        </div>

                        <div className="space-y-4">
                            {filteredJobs.map(job => (
                                <Card key={job.id} className={`hover:border-primary/50 transition-all cursor-pointer ${
                                    job.featured ? 'border-l-4 border-l-yellow-500' : ''
                                }`}
                                onClick={() => {
                                    setSelectedJob(job);
                                    setShowJobModal(true);
                                }}>
                                    <div className="flex justify-between items-start mb-3">
                                        <div>
                                            <div className="flex items-center gap-2 mb-1">
                                                <h3 className="font-bold text-lg">{job.title}</h3>
                                                {job.featured && (
                                                    <Badge color="bg-yellow-500/20 text-yellow-400">Featured</Badge>
                                                )}
                                            </div>
                                            <p className="text-gray-400">{job.company}</p>
                                            <p className="text-sm text-gray-500">
                                                {countries.find(c => c.code === job.country)?.flag} {job.location}
                                            </p>
                                        </div>
                                        <div className="text-right">
                                            <Badge color={getTypeColor(job.type)}>
                                                {job.type.toUpperCase()}
                                            </Badge>
                                            <p className="text-sm font-bold text-primary mt-1">
                                                {formatSalary(job.salary)}
                                            </p>
                                        </div>
                                    </div>

                                    <p className="text-sm text-gray-300 mb-3">{job.description}</p>

                                    <div className="flex flex-wrap gap-2 mb-3">
                                        {job.skills.slice(0, 4).map(skill => (
                                            <span key={skill} className="bg-blue-500/20 text-blue-300 px-2 py-1 rounded text-xs">
                                                {skill}
                                            </span>
                                        ))}
                                        {job.skills.length > 4 && (
                                            <span className="text-xs text-gray-400">+{job.skills.length - 4} more</span>
                                        )}
                                    </div>

                                    <div className="flex justify-between items-center">
                                        <div className="flex gap-4 text-xs text-gray-400">
                                            <span>{job.experience}</span>
                                            {job.visaSponsorship && <span className="text-green-400">✓ Visa</span>}
                                            {job.relocationAssistance && <span className="text-blue-400">✓ Relocation</span>}
                                        </div>
                                        <div className="flex gap-2">
                                            <Button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleSaveJob(job);
                                                }}
                                                variant="outline"
                                                className="!py-1 !px-3 !text-xs"
                                            >
                                                <i className="fas fa-bookmark mr-1"></i>Save
                                            </Button>
                                            <Button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleApplyJob(job);
                                                }}
                                                className="!py-1 !px-3 !text-xs"
                                            >
                                                Apply Now
                                            </Button>
                                        </div>
                                    </div>
                                </Card>
                            ))}
                        </div>

                        {filteredJobs.length === 0 && (
                            <Card className="text-center py-12">
                                <div className="text-4xl mb-4">🔍</div>
                                <h3 className="font-bold mb-2">No Jobs Found</h3>
                                <p className="text-gray-400">Try adjusting your filters to see more opportunities</p>
                            </Card>
                        )}
                    </div>
                </div>

                {/* Job Detail Modal */}
                <Modal
                    isOpen={showJobModal}
                    onClose={() => setShowJobModal(false)}
                    title="Job Details"
                >
                    {selectedJob && (
                        <div className="space-y-4">
                            <div>
                                <div className="flex items-center gap-2 mb-2">
                                    <h3 className="font-bold text-xl">{selectedJob.title}</h3>
                                    {selectedJob.featured && (
                                        <Badge color="bg-yellow-500/20 text-yellow-400">Featured</Badge>
                                    )}
                                </div>
                                <p className="text-gray-400 text-lg">{selectedJob.company}</p>
                                <p className="text-sm text-gray-500">
                                    {countries.find(c => c.code === selectedJob.country)?.flag} {selectedJob.location}
                                </p>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <p className="text-sm text-gray-400">Salary</p>
                                    <p className="font-bold text-primary">{formatSalary(selectedJob.salary)}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-400">Experience</p>
                                    <p className="font-bold">{selectedJob.experience}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-400">Work Type</p>
                                    <Badge color={getTypeColor(selectedJob.type)}>
                                        {selectedJob.type.toUpperCase()}
                                    </Badge>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-400">Deadline</p>
                                    <p className="font-bold">{new Date(selectedJob.applicationDeadline).toLocaleDateString()}</p>
                                </div>
                            </div>

                            <div>
                                <h4 className="font-bold mb-2">Description</h4>
                                <p className="text-sm text-gray-300">{selectedJob.description}</p>
                            </div>

                            <div>
                                <h4 className="font-bold mb-2">Required Skills</h4>
                                <div className="flex flex-wrap gap-2">
                                    {selectedJob.skills.map(skill => (
                                        <span key={skill} className="bg-blue-500/20 text-blue-300 px-2 py-1 rounded text-xs">
                                            {skill}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <h4 className="font-bold mb-2">Benefits</h4>
                                <ul className="text-sm text-gray-300 space-y-1">
                                    {selectedJob.benefits.map((benefit, index) => (
                                        <li key={index}>• {benefit}</li>
                                    ))}
                                </ul>
                            </div>

                            <div className="flex gap-3 pt-4">
                                <Button
                                    onClick={() => handleSaveJob(selectedJob)}
                                    variant="outline"
                                    className="flex-1"
                                >
                                    <i className="fas fa-bookmark mr-2"></i>Save Job
                                </Button>
                                <Button
                                    onClick={() => handleApplyJob(selectedJob)}
                                    className="flex-1"
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