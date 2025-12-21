import React, { useState, useContext } from 'react';
import { StoreContext } from '../../contexts/StoreContext';
import { VerificationRequest } from '../../types';
import { Button } from '../../components/common/Button';
import { Modal } from '../../components/common/Modal';

export const AdminVerifications: React.FC = () => {
    const { state, dispatch } = useContext(StoreContext);
    const [selectedRequest, setSelectedRequest] = useState<VerificationRequest | null>(null);
    const [rejectReason, setRejectReason] = useState('');
    const pendingRequests = state.verificationRequests.filter(r => r.status === 'Pending');

    const handleReject = () => {
        if (!selectedRequest || !rejectReason) return;
        console.log("Rejected user:", selectedRequest.userId, "Reason:", rejectReason);
        setSelectedRequest(null);
        setRejectReason('');
    };

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold text-white mb-4">Verification Requests</h2>
            {pendingRequests.length === 0 ? (
                <div className="text-center p-12 bg-[#1e293b] rounded-xl border border-white/10 text-gray-400">
                    <i className="fas fa-check-circle text-4xl mb-4 text-green-500"></i>
                    <p>All verifications caught up!</p>
                </div>
            ) : (
                <div className="grid gap-4">
                    {pendingRequests.map(req => (
                        <div key={req.id} className="bg-[#1e293b] p-4 rounded-xl border border-white/10 flex flex-col md:flex-row justify-between items-center gap-4">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400">
                                    <i className="fas fa-user-shield text-xl"></i>
                                </div>
                                <div>
                                    <h3 className="font-bold text-white">{req.userName}</h3>
                                    <p className="text-sm text-gray-400">{req.documentType} • Submitted {req.submittedAt}</p>
                                </div>
                            </div>
                            <div className="flex gap-3">
                                <Button onClick={() => setSelectedRequest(req)} variant="outline" className="!py-2 !text-xs">View Document</Button>
                                <Button onClick={() => dispatch({ type: 'VERIFY_USER', payload: req.userId })} variant="success" className="!py-2 !text-xs">Approve</Button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            <Modal isOpen={!!selectedRequest} onClose={() => setSelectedRequest(null)} title="Verify Identity">
                {selectedRequest && (
                    <div className="space-y-4">
                        <div className="bg-black/50 p-2 rounded-xl">
                            <img src={selectedRequest.documentUrl} alt="ID Document" className="w-full h-64 object-contain rounded-lg" />
                        </div>
                        <div className="grid grid-cols-2 gap-4 text-sm text-gray-300">
                            <div><span className="block text-xs text-gray-500 uppercase font-bold">User Name</span>{selectedRequest.userName}</div>
                            <div><span className="block text-xs text-gray-500 uppercase font-bold">Doc Type</span>{selectedRequest.documentType}</div>
                        </div>
                        <div className="pt-4 border-t border-white/10 flex gap-3">
                            <div className="flex-1">
                                <input value={rejectReason} onChange={e => setRejectReason(e.target.value)} placeholder="Reason for rejection..." className="w-full bg-black/30 border border-red-900/30 rounded-lg px-3 py-2 text-sm text-white focus:border-red-500 outline-none mb-2" />
                                <Button onClick={handleReject} disabled={!rejectReason} variant="danger" className="w-full !py-2">Reject</Button>
                            </div>
                            <div className="flex-1 flex items-end">
                                <Button onClick={() => { dispatch({ type: 'VERIFY_USER', payload: selectedRequest.userId }); setSelectedRequest(null); }} variant="success" className="w-full !py-2">Approve Verification</Button>
                            </div>
                        </div>
                    </div>
                )}
            </Modal>
        </div>
    );
};
