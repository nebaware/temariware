import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { StoreContext } from '../contexts/StoreContext';
import { ToastContext } from '../contexts/ToastContext';
import { Button } from '../components/common/Button';
import { Card } from '../components/common/Card';
import { Modal } from '../components/common/Modal';
import { Avatar } from '../components/common/Avatar';
import { EkubGroup } from '../types';

import { api } from '../services/api';

export const EkubPage: React.FC = () => {
    const { state, dispatch } = useContext(StoreContext);
    const { addToast } = useContext(ToastContext);
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState<'my-ekubs' | 'discover'>('my-ekubs');
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showJoinModal, setShowJoinModal] = useState(false);
    const [selectedEkub, setSelectedEkub] = useState<EkubGroup | null>(null);

    React.useEffect(() => {
        const fetchEkubs = async () => {
            try {
                const groups = await api.ekub.getAll();
                dispatch({ type: 'SET_EKUBS', payload: groups });
            } catch (error) {
                console.error('Failed to fetch ekubs', error);
            }
        };
        fetchEkubs();
    }, [dispatch]);

    // Derived stats from state.ekubs
    const myEkubs = state.ekubs.filter(e => state.user?.activeEkubs?.includes(e.id) || e.myStatus === 'Active');
    const availableEkubs = state.ekubs.filter(e => !state.user?.activeEkubs?.includes(e.id) && e.myStatus !== 'Active');
    const myContributions = state.user?.transactions.filter(t => t.description.includes('Contribution to Ekub')) || [];

    const [newEkub, setNewEkub] = useState({
        name: '',
        contributionAmount: '',
        frequency: 'Monthly' as 'Monthly' | 'Weekly',
        maxMembers: '20'
    });

    const handleCreateEkub = async () => {
        if (!newEkub.name || !newEkub.contributionAmount) {
            addToast('Please fill in all required fields', 'error');
            return;
        }

        try {
            const group = await api.ekub.create({
                ...newEkub,
                contributionAmount: parseFloat(newEkub.contributionAmount),
                maxMembers: parseInt(newEkub.maxMembers)
            });
            dispatch({ type: 'CREATE_EKUB', payload: group });
            addToast('Ekub group created successfully!', 'success');
            setShowCreateModal(false);
            setNewEkub({ name: '', contributionAmount: '', frequency: 'Monthly', maxMembers: '20' });
        } catch (error) {
            addToast('Failed to create Ekub', 'error');
        }
    };

    const handleJoinEkub = async (ekub: EkubGroup) => {
        try {
            const updatedGroup = await api.ekub.join(ekub.id);
            dispatch({ type: 'JOIN_EKUB', payload: updatedGroup });
            addToast(`Joined "${ekub.name}" successfully!`, 'success');
            setShowJoinModal(false);
        } catch (error) {
            addToast('Failed to join Ekub', 'error');
        }
    };

    const handleContribute = async (ekubId: string) => {
        try {
            const res = await api.ekub.contribute(ekubId);
            dispatch({
                type: 'ADD_TRANSACTION',
                payload: {
                    id: `contrib-${Date.now()}`,
                    amount: state.ekubs.find(e => e.id === ekubId)?.contributionAmount || 0,
                    type: 'Debit',
                    description: `Contribution to Ekub`,
                    date: new Date().toLocaleDateString(),
                    method: 'Wallet',
                    status: 'Completed'
                }
            });
            addToast('Contribution successful!', 'success');
            // Re-fetch groups to update pool amount
            const groups = await api.ekub.getAll();
            dispatch({ type: 'SET_EKUBS', payload: groups });
        } catch (error) {
            addToast('Failed to contribute', 'error');
        }
    };

    return (
        <div className="min-h-screen bg-black pb-24">
            {/* Header */}
            <div className="p-6 bg-gradient-to-br from-primary/20 to-blue-600/20 border-b border-white/10">
                <button onClick={() => navigate(-1)} className="text-gray-400 hover:text-white mb-4">
                    <i className="fas fa-arrow-left mr-2"></i> Back
                </button>
                <div>
                    <h1 className="text-3xl font-bold text-white mb-2">Ekub (Equb)</h1>
                    <p className="text-gray-400">Traditional Rotating Savings Groups</p>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="!p-4 bg-gradient-to-br from-primary/20 to-primary/5">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-xs text-gray-400 mb-1">My Active Ekubs</p>
                            <p className="text-2xl font-bold text-white">{myEkubs.filter(e => e.myStatus === 'Active').length}</p>
                        </div>
                        <div className="w-10 h-10 bg-primary/20 rounded-lg flex items-center justify-center">
                            <i className="fas fa-users text-primary"></i>
                        </div>
                    </div>
                </Card>

                <Card className="!p-4 bg-gradient-to-br from-blue-500/20 to-blue-500/5">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-xs text-gray-400 mb-1">Total Contributed</p>
                            <p className="text-2xl font-bold text-white">{myContributions.reduce((sum, c) => sum + c.amount, 0)} ETB</p>
                        </div>
                        <div className="w-10 h-10 bg-blue-500/20 rounded-lg flex items-center justify-center">
                            <i className="fas fa-coins text-blue-400"></i>
                        </div>
                    </div>
                </Card>

                <Card className="!p-4 bg-gradient-to-br from-yellow-500/20 to-yellow-500/5">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-xs text-gray-400 mb-1">Next Payout</p>
                            <p className="text-xl font-bold text-white">2024-12-15</p>
                        </div>
                        <div className="w-10 h-10 bg-yellow-500/20 rounded-lg flex items-center justify-center">
                            <i className="fas fa-calendar text-yellow-400"></i>
                        </div>
                    </div>
                </Card>
            </div>

            {/* Tabs */}
            <div className="px-6 flex gap-4 border-b border-white/10">
                <button
                    onClick={() => setActiveTab('my-ekubs')}
                    className={`pb-3 text-sm font-bold border-b-2 transition-colors ${activeTab === 'my-ekubs' ? 'border-primary text-primary' : 'border-transparent text-gray-500'}`}
                >
                    My Ekubs
                </button>
                <button
                    onClick={() => setActiveTab('discover')}
                    className={`pb-3 text-sm font-bold border-b-2 transition-colors ${activeTab === 'discover' ? 'border-primary text-primary' : 'border-transparent text-gray-500'}`}
                >
                    Discover
                </button>
            </div>

            {/* Content */}
            <div className="p-6">
                {activeTab === 'my-ekubs' ? (
                    <div className="space-y-4">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-white font-bold">My Ekub Groups</h3>
                            <Button onClick={() => setShowCreateModal(true)} variant="primary" className="!py-2 !px-4 !text-sm">
                                <i className="fas fa-plus mr-2"></i> Create Ekub
                            </Button>
                        </div>

                        {myEkubs.map(ekub => (
                            <Card key={ekub.id} className="!p-5">
                                <div className="flex justify-between items-start mb-4">
                                    <div>
                                        <h4 className="text-white font-bold text-lg">{ekub.name}</h4>
                                        <div className="flex gap-2 mt-1">
                                            <span className={`text-xs px-2 py-0.5 rounded font-bold ${ekub.myStatus === 'Active' ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'}`}>
                                                {ekub.myStatus}
                                            </span>
                                            <span className="text-xs px-2 py-0.5 rounded bg-blue-500/20 text-blue-400 font-bold">{ekub.frequency}</span>
                                        </div>
                                    </div>
                                    <button className="text-gray-400 hover:text-white">
                                        <i className="fas fa-ellipsis-v"></i>
                                    </button>
                                </div>

                                <div className="grid grid-cols-2 gap-4 mb-4">
                                    <div>
                                        <p className="text-xs text-gray-400">Contribution</p>
                                        <p className="text-white font-bold">{ekub.contributionAmount} ETB</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-400">Total Pool</p>
                                        <p className="text-white font-bold">{ekub.totalAmount} ETB</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-400">Members</p>
                                        <p className="text-white font-bold">{ekub.membersCount}/{ekub.maxMembers}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-400">Next Payout</p>
                                        <p className="text-white font-bold">{ekub.nextPayoutDate}</p>
                                    </div>
                                </div>

                                <div className="flex gap-2">
                                    <button className="flex-1 py-2 bg-primary/10 text-primary rounded-lg font-bold text-sm hover:bg-primary/20">
                                        <i className="fas fa-money-bill mr-2"></i> Contribute
                                    </button>
                                    <button className="flex-1 py-2 bg-white/5 text-white rounded-lg font-bold text-sm hover:bg-white/10">
                                        <i className="fas fa-info-circle mr-2"></i> Details
                                    </button>
                                </div>
                            </Card>
                        ))}

                        {/* Contribution History */}
                        <div className="mt-8">
                            <h3 className="text-white font-bold mb-4">Contribution History</h3>
                            <Card className="!p-0">
                                <div className="divide-y divide-white/5">
                                    {myContributions.map(contrib => (
                                        <div key={contrib.id} className="p-4 flex justify-between items-center hover:bg-white/5">
                                            <div>
                                                <p className="text-white font-medium text-sm">{contrib.ekubName}</p>
                                                <p className="text-xs text-gray-500">{contrib.date}</p>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-white font-bold">{contrib.amount} ETB</p>
                                                <span className="text-xs text-green-400">
                                                    <i className="fas fa-check-circle mr-1"></i>{contrib.status}
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </Card>
                        </div>
                    </div>
                ) : (
                    <div className="space-y-4">
                        <h3 className="text-white font-bold mb-4">Discover Ekub Groups</h3>
                        {availableEkubs.map(ekub => (
                            <Card key={ekub.id} className="!p-5">
                                <div className="flex justify-between items-start mb-4">
                                    <div>
                                        <h4 className="text-white font-bold text-lg">{ekub.name}</h4>
                                        <span className="text-xs px-2 py-0.5 rounded bg-blue-500/20 text-blue-400 font-bold mt-1 inline-block">{ekub.frequency}</span>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-xs text-gray-400">Spots Left</p>
                                        <p className="text-white font-bold">{ekub.maxMembers - ekub.membersCount}</p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-3 gap-3 mb-4">
                                    <div>
                                        <p className="text-xs text-gray-400">Contribution</p>
                                        <p className="text-white font-bold text-sm">{ekub.contributionAmount} ETB</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-400">Total Pool</p>
                                        <p className="text-white font-bold text-sm">{ekub.totalAmount} ETB</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-400">Members</p>
                                        <p className="text-white font-bold text-sm">{ekub.membersCount}/{ekub.maxMembers}</p>
                                    </div>
                                </div>

                                <Button onClick={() => { setSelectedEkub(ekub); setShowJoinModal(true); }} className="w-full">
                                    <i className="fas fa-user-plus mr-2"></i> Join Ekub
                                </Button>
                            </Card>
                        ))}
                    </div>
                )}
            </div>

            {/* Create Ekub Modal */}
            <Modal isOpen={showCreateModal} onClose={() => setShowCreateModal(false)} title="Create New Ekub">
                <div className="space-y-4">
                    <div>
                        <label className="block text-xs font-bold text-gray-400 mb-2">Ekub Name</label>
                        <input
                            value={newEkub.name}
                            onChange={(e) => setNewEkub({ ...newEkub, name: e.target.value })}
                            placeholder="e.g. CS Students Ekub"
                            className="w-full bg-black/50 border border-gray-700 rounded-xl px-4 py-3 text-sm text-white"
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-gray-400 mb-2">Contribution Amount (ETB)</label>
                        <input
                            type="number"
                            value={newEkub.contributionAmount}
                            onChange={(e) => setNewEkub({ ...newEkub, contributionAmount: e.target.value })}
                            placeholder="e.g. 2000"
                            className="w-full bg-black/50 border border-gray-700 rounded-xl px-4 py-3 text-sm text-white"
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-gray-400 mb-2">Frequency</label>
                        <select
                            value={newEkub.frequency}
                            onChange={(e) => setNewEkub({ ...newEkub, frequency: e.target.value as any })}
                            className="w-full bg-black/50 border border-gray-700 rounded-xl px-4 py-3 text-sm text-white"
                        >
                            <option value="Weekly">Weekly</option>
                            <option value="Monthly">Monthly</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-gray-400 mb-2">Max Members</label>
                        <input
                            type="number"
                            value={newEkub.maxMembers}
                            onChange={(e) => setNewEkub({ ...newEkub, maxMembers: e.target.value })}
                            placeholder="20"
                            className="w-full bg-black/50 border border-gray-700 rounded-xl px-4 py-3 text-sm text-white"
                        />
                    </div>

                    <Button onClick={handleCreateEkub} className="w-full">Create Ekub</Button>
                </div>
            </Modal>

            {/* Join Ekub Modal */}
            <Modal isOpen={showJoinModal} onClose={() => setShowJoinModal(false)} title={`Join ${selectedEkub?.name}`}>
                {selectedEkub && (
                    <div className="space-y-4">
                        <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4">
                            <p className="text-sm text-blue-200">
                                <i className="fas fa-info-circle mr-2"></i>
                                You'll contribute <strong>{selectedEkub.contributionAmount} ETB {selectedEkub.frequency.toLowerCase()}</strong>
                            </p>
                        </div>

                        <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-400">Contribution</span>
                                <span className="text-white font-bold">{selectedEkub.contributionAmount} ETB</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-400">Frequency</span>
                                <span className="text-white font-bold">{selectedEkub.frequency}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-400">Next Payout</span>
                                <span className="text-white font-bold">{selectedEkub.nextPayoutDate}</span>
                            </div>
                        </div>

                        <Button onClick={() => handleJoinEkub(selectedEkub)} className="w-full">Confirm & Join</Button>
                    </div>
                )}
            </Modal>
        </div>
    );
};
