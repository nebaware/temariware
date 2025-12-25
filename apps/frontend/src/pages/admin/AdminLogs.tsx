import React, { useContext } from 'react';
import { StoreContext } from '../../contexts/StoreContext';
import { Badge } from '../../components/common/Badge';

export const AdminLogs: React.FC = () => {
    const { state } = useContext(StoreContext);
    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold text-white mb-4">Audit Logs</h2>
            <div className="bg-[#1e293b] rounded-xl overflow-hidden border border-white/10">
                <table className="w-full text-left text-sm text-gray-400">
                    <thead className="bg-black/30 text-white uppercase text-xs">
                        <tr>
                            <th className="p-4">Time</th>
                            <th className="p-4">Admin</th>
                            <th className="p-4">Action</th>
                            <th className="p-4">Details</th>
                            <th className="p-4">IP</th>
                        </tr>
                    </thead>
                    <tbody>
                        {state.auditLogs.map(log => (
                            <tr key={log.id} className="border-b border-white/5 hover:bg-white/5">
                                <td className="p-4">{log.timestamp}</td>
                                <td className="p-4">{log.adminId}</td>
                                <td className="p-4"><Badge color="bg-blue-500/20 text-blue-400">{log.action}</Badge></td>
                                <td className="p-4">{log.details}</td>
                                <td className="p-4 font-mono text-xs">{log.ip}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};
