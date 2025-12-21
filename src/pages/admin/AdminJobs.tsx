import React, { useContext, useEffect, useState } from 'react';
import { StoreContext } from '../../contexts/StoreContext';
import { Badge } from '../../components/common/Badge';
import { api } from '../../services/api';
import { Job } from '../../types';

export const AdminJobs: React.FC = () => {
    const { state, dispatch } = useContext(StoreContext);
    const [jobs, setJobs] = useState<Job[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchJobs = async () => {
        try {
            const data = await api.jobs.getAll('all');
            setJobs(data);
        } catch (error) {
            console.error("Failed to fetch jobs", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchJobs();
    }, []);

    const handleModerate = async (id: number, status: 'Approved' | 'Rejected') => {
        try {
            await api.jobs.moderate(id, status);
            fetchJobs(); // Refresh
        } catch (error) {
            console.error("Moderation failed", error);
        }
    };

    if (loading) return <div className="p-8 text-center animate-pulse">Loading jobs...</div>;

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold text-white mb-4">Job Moderation</h2>
            <div className="bg-[#1e293b] rounded-xl overflow-hidden border border-white/10">
                <table className="w-full text-left text-sm text-gray-400">
                    <thead className="bg-black/30 text-white uppercase text-xs">
                        <tr>
                            <th className="p-4">Job Title</th>
                            <th className="p-4">Company</th>
                            <th className="p-4">Salary</th>
                            <th className="p-4">Status</th>
                            <th className="p-4">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {jobs.map(job => (
                            <tr key={job.id} className="border-b border-white/5 hover:bg-white/5">
                                <td className="p-4">
                                    <p className="text-white font-bold">{job.title}</p>
                                    <p className="text-xs">{job.type}</p>
                                </td>
                                <td className="p-4">{job.company}</td>
                                <td className="p-4 text-white font-mono">{job.salary}</td>
                                <td className="p-4">
                                    <Badge color={job.status === 'Approved' ? 'bg-green-500/20 text-green-500' : job.status === 'Rejected' ? 'bg-red-500/20 text-red-500' : 'bg-yellow-500/20 text-yellow-500'}>
                                        {job.status || 'Pending'}
                                    </Badge>
                                </td>
                                <td className="p-4 flex gap-2">
                                    <button onClick={() => handleModerate(job.id, 'Approved')} className="w-8 h-8 rounded bg-green-500/20 text-green-500 flex items-center justify-center hover:bg-green-500 hover:text-white transition-colors" title="Approve"><i className="fas fa-check"></i></button>
                                    <button onClick={() => handleModerate(job.id, 'Rejected')} className="w-8 h-8 rounded bg-red-500/20 text-red-500 flex items-center justify-center hover:bg-red-500 hover:text-white transition-colors" title="Reject"><i className="fas fa-times"></i></button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};
