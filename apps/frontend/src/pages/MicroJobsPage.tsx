import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { StoreContext } from '../contexts/StoreContext';
import { ToastContext } from '../contexts/ToastContext';
import { Button } from '../components/common/Button';
import { Card } from '../components/common/Card';
import { Avatar } from '../components/common/Avatar';

interface MicroJob {
    id: string;
    title: string;
    description: string;
    category: 'Data Entry' | 'Graphics' | 'Writing' | 'Translation' | 'Social Media' | 'Other';
    budget: number;
    duration: string; // e.g. "30 min", "1 hour"
    poster: string;
    posterAvatar: string;
    postedAt: string;
    status: 'Open' | 'In Progress' | 'Completed';
}

import { api } from '../services/api';

export const MicroJobsPage: React.FC = () => {
    const { state, dispatch } = useContext(StoreContext);
    const { addToast } = useContext(ToastContext);
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState<'browse' | 'my-jobs'>('browse');
    const [category, setCategory] = useState<string>('All');
    const [loading, setLoading] = useState(false);

    React.useEffect(() => {
        const fetchJobs = async () => {
            setLoading(true);
            try {
                const jobs = await api.jobs.getAll('Micro-task');
                dispatch({ type: 'SET_JOBS', payload: jobs });
            } catch (err) {
                console.error('Failed to fetch micro-jobs', err);
            } finally {
                setLoading(false);
            }
        };
        fetchJobs();
    }, [dispatch]);

    const microJobs = state.jobs.filter(j => j.type === 'Micro-task');

    const handleApply = async (job: any) => {
        try {
            await api.jobs.apply(job.id, '');
            dispatch({ type: 'APPLY_JOB', payload: job.id });
            addToast(`Applied to "${job.title}"!`, 'success');
        } catch (err) {
            addToast('Failed to apply for job', 'error');
        }
    };

    const categories = ['All', 'Data Entry', 'Graphics', 'Writing', 'Translation', 'Social Media', 'Other'];
    const filteredJobs = category === 'All'
        ? state.jobs.filter(j => j.type === 'Micro-task')
        : state.jobs.filter(j => j.type === 'Micro-task' && j.tags?.includes(category));

    return (
        <div className="min-h-screen bg-black pb-24">
            {/* Header */}
            <div className="p-6 bg-gradient-to-br from-blue-600/20 to-purple-600/20 border-b border-white/10">
                <button onClick={() => navigate(-1)} className="text-gray-400 hover:text-white mb-4">
                    <i className="fas fa-arrow-left mr-2"></i> Back
                </button>
                <div>
                    <h1 className="text-3xl font-bold text-white mb-2">Micro-jobs</h1>
                    <p className="text-gray-400">Quick tasks • Fast payment • Under 1 hour</p>
                </div>
            </div>

            {/* Stats */}
            <div className="p-6 grid grid-cols-3 gap-3">
                <Card className="!p-3 text-center">
                    <p className="text-2xl font-bold text-white">{microJobs.length}</p>
                    <p className="text-xs text-gray-400">Available</p>
                </Card>
                <Card className="!p-3 text-center">
                    <p className="text-2xl font-bold text-primary">50-500</p>
                    <p className="text-xs text-gray-400">ETB Range</p>
                </Card>
                <Card className="!p-3 text-center">
                    <p className="text-2xl font-bold text-blue-400">&lt; 1h</p>
                    <p className="text-xs text-gray-400">Time Limit</p>
                </Card>
            </div>

            {/* Category Filter */}
            <div className="px-6 pb-4">
                <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                    {categories.map(cat => (
                        <button
                            key={cat}
                            onClick={() => setCategory(cat)}
                            className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-colors ${category === cat
                                ? 'bg-primary text-black'
                                : 'bg-white/5 text-gray-400 hover:bg-white/10'
                                }`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>
            </div>

            {/* Tabs */}
            <div className="px-6 flex gap-4 border-b border-white/10">
                <button
                    onClick={() => setActiveTab('browse')}
                    className={`pb-3 text-sm font-bold border-b-2 transition-colors ${activeTab === 'browse' ? 'border-primary text-primary' : 'border-transparent text-gray-500'}`}
                >
                    Browse Jobs
                </button>
                <button
                    onClick={() => setActiveTab('my-jobs')}
                    className={`pb-3 text-sm font-bold border-b-2 transition-colors ${activeTab === 'my-jobs' ? 'border-primary text-primary' : 'border-transparent text-gray-500'}`}
                >
                    My Jobs
                </button>
            </div>

            {/* Content */}
            <div className="p-6 space-y-4">
                {activeTab === 'browse' ? (
                    <>
                        {filteredJobs.map(job => (
                            <Card key={job.id} className="!p-5">
                                <div className="flex items-start justify-between mb-3">
                                    <div className="flex items-start gap-3">
                                        <Avatar src={job.posterAvatar} size="sm" />
                                        <div>
                                            <h4 className="text-white font-bold">{job.title}</h4>
                                            <p className="text-xs text-gray-400">{job.poster} • {job.postedAt}</p>
                                        </div>
                                    </div>
                                    <span className={`text-xs px-2 py-1 rounded font-bold ${job.category === 'Graphics' ? 'bg-blue-500/20 text-blue-400' :
                                        job.category === 'Writing' ? 'bg-purple-500/20 text-purple-400' :
                                            job.category === 'Data Entry' ? 'bg-green-500/20 text-green-400' :
                                                'bg-yellow-500/20 text-yellow-400'
                                        }`}>
                                        {job.category}
                                    </span>
                                </div>

                                <p className="text-sm text-gray-300 mb-4">{job.description}</p>

                                <div className="flex items-center justify-between">
                                    <div className="flex gap-4">
                                        <div>
                                            <p className="text-xs text-gray-400">Budget</p>
                                            <p className="text-lg font-bold text-primary">{job.budget} ETB</p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-400">Duration</p>
                                            <p className="text-sm font-bold text-white">{job.duration}</p>
                                        </div>
                                    </div>
                                    <Button onClick={() => handleApply(job)} variant="primary" className="!py-2 !px-4 !text-sm">
                                        <i className="fas fa-bolt mr-2"></i> Quick Apply
                                    </Button>
                                </div>
                            </Card>
                        ))}
                    </>
                ) : (
                    <div className="text-center py-12">
                        <i className="fas fa-briefcase text-4xl text-gray-600 mb-3"></i>
                        <p className="text-gray-400">No active micro-jobs yet</p>
                        <p className="text-xs text-gray-500 mt-1">Apply to jobs to see them here</p>
                    </div>
                )}
            </div>
        </div>
    );
};
