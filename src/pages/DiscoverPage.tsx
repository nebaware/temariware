import React, { useContext, useState, useEffect } from 'react';
import { StoreContext } from '../contexts/StoreContext';
import { ToastContext } from '../contexts/ToastContext';
import { DISCOVER_USERS } from '../constants';
import { Card } from '../components/common/Card';
import { Avatar } from '../components/common/Avatar';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';
import { api } from '../services/api';
import { UserProfile } from '../types';

export const DiscoverPage: React.FC = () => {
    const { state } = useContext(StoreContext);
    const { addToast } = useContext(ToastContext);
    const [filter, setFilter] = useState<'all' | 'students' | 'mentors'>('all');
    const [connectedIds, setConnectedIds] = useState<string[]>([]);
    const [users, setUsers] = useState<UserProfile[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDiscover = async () => {
            try {
                const data = await api.user.getDiscoverUsers();
                setUsers(data);
            } catch (error) {
                console.error("Discovery failed", error);
            } finally {
                setLoading(false);
            }
        };
        fetchDiscover();
    }, []);

    const handleConnect = (userId: string | number, userName: string) => {
        setConnectedIds([...connectedIds, userId.toString()]);
        addToast(`Connected with ${userName}!`, 'success');
    };

    const filteredUsers = users.filter(u => {
        if (filter === 'all') return true;
        if (filter === 'students') return u.role === 'Student';
        if (filter === 'mentors') return u.role === 'Instructor';
        return true;
    });

    if (loading) return <div className="p-8 text-center animate-pulse text-white">Finding peers and mentors...</div>;

    return (
        <div className="p-4 pb-24 max-w-md mx-auto">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-white">Discover</h2>
                <button className="text-gray-400 hover:text-white">
                    <i className="fas fa-filter"></i>
                </button>
            </div>

            {/* Filters */}
            <div className="flex gap-2 mb-6 overflow-x-auto no-scrollbar">
                {(['all', 'students', 'mentors'] as const).map(f => (
                    <button
                        key={f}
                        onClick={() => setFilter(f)}
                        className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all ${filter === f ? 'bg-primary text-black' : 'bg-white/10 text-white hover:bg-white/20'
                            }`}
                    >
                        {f === 'all' ? 'All' : f === 'students' ? 'Students' : 'Mentors'}
                    </button>
                ))}
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-3 mb-6">
                <Card className="!p-3 text-center">
                    <p className="text-2xl font-bold text-white">{connectedIds.length}</p>
                    <p className="text-xs text-gray-400">Connections</p>
                </Card>
                <Card className="!p-3 text-center">
                    <p className="text-2xl font-bold text-white">{state.user?.views || 0}</p>
                    <p className="text-xs text-gray-400">Profile Views</p>
                </Card>
                <Card className="!p-3 text-center">
                    <p className="text-2xl font-bold text-white">{DISCOVER_USERS.length}</p>
                    <p className="text-xs text-gray-400">Suggested</p>
                </Card>
            </div>

            {/* User Cards */}
            <div className="space-y-4">
                {filteredUsers.map(u => {
                    const isConnected = connectedIds.includes(u.id);
                    return (
                        <Card key={u.id} className="!p-0 overflow-hidden">
                            <div className="h-20 bg-gradient-to-r from-blue-600 to-purple-600"></div>
                            <div className="p-4 -mt-10">
                                <Avatar src={u.avatar} alt={u.name} size="xl" className="border-4 border-[#1e293b] mb-3" verified={u.isVerified} />
                                <div className="flex justify-between items-start mb-3">
                                    <div>
                                        <h3 className="font-bold text-white text-lg">{u.name}</h3>
                                        <p className="text-sm text-gray-400">{u.headline}</p>
                                        <p className="text-xs text-gray-500 mt-1">{u.university}</p>
                                    </div>
                                    <Badge>{u.role}</Badge>
                                </div>

                                {/* Skills */}
                                <div className="flex flex-wrap gap-1 mb-3">
                                    {u.skills.slice(0, 3).map(skill => (
                                        <span key={skill.name} className="text-[10px] bg-primary/20 text-primary px-2 py-1 rounded-full">
                                            {skill.name}
                                        </span>
                                    ))}
                                    {u.skills.length > 3 && (
                                        <span className="text-[10px] bg-white/10 text-gray-400 px-2 py-1 rounded-full">
                                            +{u.skills.length - 3} more
                                        </span>
                                    )}
                                </div>

                                {/* Stats */}
                                <div className="flex gap-4 mb-4 text-xs text-gray-400">
                                    <span><i className="fas fa-eye mr-1"></i> {u.views}</span>
                                    <span><i className="fas fa-users mr-1"></i> {u.connections}</span>
                                    <span><i className="fas fa-project-diagram mr-1"></i> {u.projects.length} projects</span>
                                </div>

                                {/* Actions */}
                                <div className="flex gap-2">
                                    <Button
                                        onClick={() => handleConnect(u.id, u.name)}
                                        disabled={isConnected}
                                        variant={isConnected ? 'outline' : 'primary'}
                                        className="flex-1 !py-2 !text-xs"
                                    >
                                        {isConnected ? (
                                            <><i className="fas fa-check mr-1"></i> Connected</>
                                        ) : (
                                            <><i className="fas fa-user-plus mr-1"></i> Connect</>
                                        )}
                                    </Button>
                                    <button className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-white transition-colors">
                                        <i className="fas fa-comment-alt"></i>
                                    </button>
                                </div>
                            </div>
                        </Card>
                    );
                })}
            </div>
        </div>
    );
};
