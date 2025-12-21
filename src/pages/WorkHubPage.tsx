import React, { useState, useEffect, useContext } from 'react';
import { motion } from 'framer-motion';
import { StoreContext } from '../contexts/StoreContext';
import { ToastContext } from '../contexts/ToastContext';
import { api } from '../services/api';
import { getJobMatchAdvice, generateCareerRoadmap } from '../services/geminiService';
import { Job } from '../types';
import { Card } from '../components/common/Card';
import { Badge } from '../components/common/Badge';
import { Button } from '../components/common/Button';
import { Modal } from '../components/common/Modal';

export const WorkHubPage: React.FC = () => {
    const { state, dispatch } = useContext(StoreContext);
    const { addToast } = useContext(ToastContext);
    const [activeTab, setActiveTab] = useState<'jobs' | 'applications' | 'roadmap'>('jobs');
    const [filter, setFilter] = useState<'all' | 'intern' | 'freelance'>('all');
    const [selectedJob, setSelectedJob] = useState<Job | null>(null);
    const [advice, setAdvice] = useState<string>('');
    const [gettingAdvice, setGettingAdvice] = useState(false);
    const [applyingJob, setApplyingJob] = useState<Job | null>(null);
    const [applicationForm, setApplicationForm] = useState({ coverLetter: '', portfolioLink: '' });
    const [roadmap, setRoadmap] = useState('');
    const [loadingRoadmap, setLoadingRoadmap] = useState(false);

    // API Fetch State
    const [loadingJobs, setLoadingJobs] = useState(false);

    useEffect(() => {
        const fetchJobs = async () => {
            setLoadingJobs(true);
            try {
                // Fetch from Backend API
                const jobs = await api.jobs.getAll(filter);
                dispatch({ type: 'SET_JOBS', payload: jobs });
            } catch (error) {
                addToast("Failed to load jobs", "error");
            } finally {
                setLoadingJobs(false);
            }
        };
        fetchJobs();
    }, [filter]);

    const getAdvice = async (job: Job) => {
        if (!state.user) return;
        setGettingAdvice(true);
        const adviceText = await getJobMatchAdvice(state.user, job);
        setAdvice(adviceText);
        setGettingAdvice(false);
    }

    const handleOpenApplication = (job: Job) => {
        setApplyingJob(job);
        setApplicationForm({ coverLetter: '', portfolioLink: '' });
    }

    const handleSubmitApplication = async () => {
        if (!applyingJob) return;

        // Call Backend API
        await api.jobs.apply(applyingJob.id, applicationForm.coverLetter);

        dispatch({ type: 'APPLY_JOB', payload: applyingJob.id });
        addToast("Application Submitted Successfully!", 'success');
        setApplyingJob(null);
    }

    const handleGenerateRoadmap = async () => {
        if (!state.user) return;
        setLoadingRoadmap(true);
        const res = await generateCareerRoadmap(state.user);
        setRoadmap(res);
        setLoadingRoadmap(false);
    }

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'Applied': return 'border-blue-500 text-blue-500 bg-blue-500/10';
            case 'Interviewing': return 'border-yellow-500 text-yellow-500 bg-yellow-500/10';
            case 'Offer Received': return 'border-green-500 text-green-500 bg-green-500/10';
            case 'Rejected': return 'border-red-500 text-red-500 bg-red-500/10';
            case 'Accepted': return 'border-primary text-primary bg-primary/10';
            default: return 'border-gray-500 text-gray-500 bg-gray-500/10';
        }
    }

    return (
        <div className="pb-32 pt-6 px-4 max-w-md mx-auto">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-white">Find <span className="text-secondary">Work</span></h2>
                <div className="flex bg-[#1e293b] p-1 rounded-lg">
                    <button onClick={() => setActiveTab('jobs')} className={`px-3 py-1.5 rounded-md text-[10px] font-bold transition-all ${activeTab === 'jobs' ? 'bg-white shadow-sm text-primary' : 'text-gray-500'}`}>Jobs</button>
                    <button onClick={() => setActiveTab('applications')} className={`px-3 py-1.5 rounded-md text-[10px] font-bold transition-all ${activeTab === 'applications' ? 'bg-white shadow-sm text-primary' : 'text-gray-500'}`}>Apps</button>
                    <button onClick={() => setActiveTab('roadmap')} className={`px-3 py-1.5 rounded-md text-[10px] font-bold transition-all ${activeTab === 'roadmap' ? 'bg-white shadow-sm text-primary' : 'text-gray-500'}`}>Coach</button>
                </div>
            </div>

            {activeTab === 'jobs' && (
                <div className="space-y-4">
                    <div className="flex gap-2 mb-4">
                        <button onClick={() => setFilter('all')} className={`px-3 py-1 rounded-full text-xs font-bold ${filter === 'all' ? 'bg-white text-black' : 'bg-white/10 text-white'}`}>All</button>
                        <button onClick={() => setFilter('intern')} className={`px-3 py-1 rounded-full text-xs font-bold ${filter === 'intern' ? 'bg-white text-black' : 'bg-white/10 text-white'}`}>Intern</button>
                    </div>

                    {loadingJobs ? (
                        <div className="space-y-3">
                            {[1, 2, 3].map(i => <div key={i} className="h-32 bg-[#1e293b] rounded-3xl animate-pulse"></div>)}
                        </div>
                    ) : (
                        state.jobs.map(job => {
                            const isApplied = state.user?.appliedJobs.some(app => app.jobId === job.id);
                            const isBestMatch = state.user?.department && job.tags.some(tag => tag.toLowerCase().includes(state.user?.department.toLowerCase().split(' ')[0]));

                            return (
                                <Card key={job.id} className={isBestMatch && !isApplied ? 'border-l-4 border-accent' : ''}>
                                    <div className="flex justify-between items-start mb-2">
                                        <div>
                                            <div className="flex items-center gap-2">
                                                <h3 className="font-bold text-white text-lg">{job.title}</h3>
                                                {isBestMatch && !isApplied && <span className="bg-accent/20 text-accent text-[8px] font-bold px-1.5 py-0.5 rounded uppercase tracking-tighter">Best Match</span>}
                                            </div>
                                            <p className="text-sm text-gray-400">{job.company}</p>
                                        </div>
                                        {isApplied ? <Badge color="bg-green-500/20 text-green-500">Applied</Badge> : <Badge>{job.type}</Badge>}
                                    </div>
                                    <div className="flex flex-wrap gap-2 mb-3">
                                        {job.tags.map(t => <span key={t} className="text-[10px] bg-white/5 px-2 py-1 rounded text-gray-300">{t}</span>)}
                                    </div>
                                    <div className="flex justify-between items-center mt-4">
                                        <span className="text-primary font-mono text-sm">{job.salary}</span>
                                        <div className="flex gap-2">
                                            <button onClick={() => { setSelectedJob(job); getAdvice(job); }} className="text-xs text-blue-400 font-bold hover:underline">AI Advice</button>
                                            <Button
                                                onClick={() => handleOpenApplication(job)}
                                                disabled={isApplied}
                                                variant={isApplied ? "outline" : "secondary"}
                                                className="!py-1 !px-3 !text-xs !rounded-lg"
                                            >
                                                {isApplied ? 'View' : 'Apply'}
                                            </Button>
                                        </div>
                                    </div>
                                    {selectedJob?.id === job.id && (
                                        <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} className="overflow-hidden mt-3 bg-blue-500/10 rounded-xl p-3 border border-blue-500/20">
                                            <h4 className="text-xs font-bold text-blue-300 mb-1 flex items-center gap-2"><i className="fas fa-robot"></i> AI Coach Advice</h4>
                                            {gettingAdvice ? <p className="text-xs text-gray-400 animate-pulse">Analyzing match...</p> : <p className="text-xs text-gray-300 whitespace-pre-line">{advice}</p>}
                                        </motion.div>
                                    )}
                                </Card>
                            );
                        })
                    )}

                </div>
            )}

            {activeTab === 'applications' && (
                <div className="space-y-4">
                    {state.user?.appliedJobs.length === 0 ? (
                        <div className="text-center text-gray-500 mt-10">No applications yet.</div>
                    ) : (
                        state.user?.appliedJobs.map(app => {
                            const job = state.jobs.find(j => j.id === app.jobId);
                            if (!job) return null;
                            const statusColorClass = getStatusColor(app.status);

                            return (
                                <Card key={job.id} className="border-l-4" style={{ borderLeftColor: statusColorClass.includes('border-primary') ? '#14F195' : statusColorClass.includes('border-blue') ? '#3b82f6' : statusColorClass.includes('border-yellow') ? '#eab308' : statusColorClass.includes('border-green') ? '#22c55e' : '#ef4444' }}>
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h3 className="font-bold text-white text-sm">{job.title}</h3>
                                            <p className="text-xs text-gray-400">{job.company}</p>
                                            <p className="text-[10px] text-gray-500 mt-1">Applied: {new Date(app.appliedAt).toLocaleDateString()}</p>
                                        </div>
                                        <div className={`px-2 py-1 rounded text-[10px] font-bold border ${statusColorClass}`}>
                                            {app.status}
                                        </div>
                                    </div>
                                    <div className="mt-3 flex justify-between items-center bg-black/20 p-2 rounded-lg">
                                        <span className="text-[10px] text-gray-400">Next Step</span>
                                        <span className="text-[10px] font-bold text-white">
                                            {app.status === 'Applied' ? 'Resume Review' :
                                                app.status === 'Interviewing' ? 'Technical Interview' :
                                                    app.status === 'Offer Received' ? 'Accept Offer' : 'Closed'}
                                        </span>
                                    </div>
                                </Card>
                            );
                        })
                    )}
                </div>
            )}

            {activeTab === 'roadmap' && (
                <div className="space-y-4">
                    <div className="bg-gradient-to-br from-indigo-900 to-purple-900 p-6 rounded-3xl text-white text-center">
                        <i className="fas fa-route text-4xl mb-3 text-white/80"></i>
                        <h3 className="font-bold text-lg mb-2">Career Roadmap</h3>
                        <p className="text-xs text-white/70 mb-4">Get a personalized path based on your profile.</p>
                        <Button onClick={handleGenerateRoadmap} disabled={loadingRoadmap} className="w-full">{loadingRoadmap ? 'Analyzing...' : 'Generate Roadmap'}</Button>
                    </div>

                    {roadmap && (
                        <div className="bg-[#1e293b] p-4 rounded-xl border border-white/10">
                            <h4 className="text-white font-bold mb-3">Your Path</h4>
                            <div className="text-sm text-gray-300 whitespace-pre-line leading-relaxed">
                                {roadmap}
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* Application Modal */}
            <Modal isOpen={!!applyingJob} onClose={() => setApplyingJob(null)} title="Job Application">
                {applyingJob && (
                    <div className="space-y-4">
                        <div className="bg-blue-900/20 border border-blue-500/30 p-3 rounded-xl mb-4">
                            <p className="text-xs text-blue-300">Applying for:</p>
                            <p className="text-sm font-bold text-white">{applyingJob.title} at {applyingJob.company}</p>
                        </div>
                        <div><label className="block text-xs font-bold text-gray-400 mb-1">Full Name</label><input value={state.user?.name} disabled className="w-full bg-black/30 border border-gray-700 rounded-xl px-3 py-2 text-sm text-gray-500 cursor-not-allowed" /></div>
                        <div><label className="block text-xs font-bold text-gray-400 mb-1">Email</label><input value={state.user?.email} disabled className="w-full bg-black/30 border border-gray-700 rounded-xl px-3 py-2 text-sm text-gray-500 cursor-not-allowed" /></div>
                        <div><label className="block text-xs font-bold text-gray-400 mb-1">Cover Letter</label><textarea value={applicationForm.coverLetter} onChange={(e) => setApplicationForm({ ...applicationForm, coverLetter: e.target.value })} placeholder="Why are you a good fit for this role?" className="w-full bg-black/50 border border-gray-600 rounded-xl px-3 py-2 text-sm text-white h-24 focus:border-primary outline-none" /></div>
                        <div><label className="block text-xs font-bold text-gray-400 mb-1">Portfolio / Resume Link</label><div className="relative"><i className="fas fa-link absolute left-3 top-2.5 text-gray-500 text-xs"></i><input value={applicationForm.portfolioLink} onChange={(e) => setApplicationForm({ ...applicationForm, portfolioLink: e.target.value })} placeholder="https://" className="w-full bg-black/50 border border-gray-600 rounded-xl pl-8 pr-3 py-2 text-sm text-white focus:border-primary outline-none" /></div></div>
                        <div className="border-t border-white/10 pt-4 flex gap-3"><Button onClick={() => setApplyingJob(null)} variant="outline" className="flex-1">Cancel</Button><Button onClick={handleSubmitApplication} disabled={!applicationForm.coverLetter} className="flex-1">Submit Application</Button></div>
                    </div>
                )}
            </Modal>
        </div>
    );
}
