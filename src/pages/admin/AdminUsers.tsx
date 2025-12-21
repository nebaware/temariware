import React, { useState, useContext, useEffect } from 'react';
import { StoreContext } from '../../contexts/StoreContext';
import { Avatar } from '../../components/common/Avatar';
import { Badge } from '../../components/common/Badge';
import { api } from '../../services/api';
import { UserProfile } from '../../types';

export const AdminUsers: React.FC = () => {
    const { state, dispatch } = useContext(StoreContext);
    const [users, setUsers] = useState<UserProfile[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const data = await api.user.getAll();
                setUsers(data);
            } catch (error) {
                console.error("Failed to fetch users", error);
            } finally {
                setLoading(false);
            }
        };
        fetchUsers();
    }, []);

    const toggleBan = async (user: UserProfile) => {
        try {
            if (user.isBanned) {
                await api.user.unbanUser(user.id);
            } else {
                await api.user.banUser(user.id);
            }
            // Refresh list
            const data = await api.user.getAll();
            setUsers(data);
        } catch (error) {
            console.error("Ban toggle failed", error);
        }
    };

    const filteredUsers = users.filter(u => u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase()));

    if (loading) return <div className="p-8 text-center animate-pulse">Loading management portal...</div>;

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-white">User Management</h2>
                <div className="bg-[#1e293b] border border-white/10 rounded-xl px-3 py-2 flex items-center gap-2">
                    <i className="fas fa-search text-gray-400"></i>
                    <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search users..." className="bg-transparent outline-none text-white text-sm" />
                </div>
            </div>

            <div className="bg-[#1e293b] rounded-xl overflow-hidden border border-white/10">
                <table className="w-full text-left text-sm text-gray-400">
                    <thead className="bg-black/30 text-white uppercase text-xs">
                        <tr>
                            <th className="p-4">User</th>
                            <th className="p-4">Role</th>
                            <th className="p-4">University</th>
                            <th className="p-4">Status</th>
                            <th className="p-4">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredUsers.map(user => (
                            <tr key={user.id} className="border-b border-white/5 hover:bg-white/5">
                                <td className="p-4 flex items-center gap-3">
                                    <Avatar src={user.avatar} alt={user.name} size="sm" />
                                    <div>
                                        <p className="text-white font-bold">{user.name}</p>
                                        <p className="text-xs">{user.email}</p>
                                    </div>
                                </td>
                                <td className="p-4"><Badge>{user.role}</Badge></td>
                                <td className="p-4"><span className="text-xs">{user.university}</span></td>
                                <td className="p-4">
                                    {user.isBanned ? <Badge color="bg-red-500/20 text-red-500">Banned</Badge> : <Badge color="bg-green-500/20 text-green-500">Active</Badge>}
                                </td>
                                <td className="p-4">
                                    <button onClick={() => toggleBan(user)} className={`text-xs font-bold ${user.isBanned ? 'text-green-500' : 'text-red-500'} hover:underline`}>
                                        {user.isBanned ? 'Unban' : 'Ban'}
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};
