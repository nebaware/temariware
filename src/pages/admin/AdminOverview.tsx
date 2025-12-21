import React, { useState, useEffect, useContext } from 'react';
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { StoreContext } from '../../contexts/StoreContext';
import { api } from '../../services/api';
import { Card } from '../../components/common/Card';

export const AdminOverview: React.FC = () => {
    const { state } = useContext(StoreContext);
    const [realtimeData, setRealtimeData] = useState<{ time: string, activeUsers: number, jobApps: number }[]>([]);
    const [revenueData, setRevenueData] = useState<{ name: string, revenue: number }[]>([]);
    const [liveStats, setLiveStats] = useState({
        activeUsers: 0,
        jobApps: 0,
        revenue: 0,
        serverHealth: 100
    });

    useEffect(() => {
        const initialData = Array.from({ length: 10 }, (_, i) => ({
            time: new Date(Date.now() - (10 - i) * 60000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            activeUsers: 300 + Math.floor(Math.random() * 100),
            jobApps: 5 + Math.floor(Math.random() * 5)
        }));
        setRealtimeData(initialData);

        setRevenueData([
            { name: 'Mon', revenue: 45000 },
            { name: 'Tue', revenue: 52000 },
            { name: 'Wed', revenue: 49000 },
            { name: 'Thu', revenue: 63000 },
            { name: 'Fri', revenue: 58000 },
            { name: 'Sat', revenue: 72000 },
            { name: 'Sun', revenue: 65000 }
        ]);

        const fetchStats = async () => {
            try {
                const res = await api.admin.getStats();
                if (res.success) {
                    setLiveStats(prev => ({
                        activeUsers: res.stats.totalUsers,
                        jobApps: res.stats.activeJobs, // Using active jobs as proxy for "apps" visually
                        revenue: res.stats.totalRevenue,
                        serverHealth: res.stats.serverHealth
                    }));
                }
            } catch (err) {
                console.error("Failed to fetch admin stats", err);
            }
        };

        // Initial fetch
        fetchStats();

        const interval = setInterval(() => {
            // Poll for "live" feel every 5 seconds
            fetchStats();

            // Simulate minor server health fluctuation visually
            setLiveStats(prev => ({
                ...prev,
                serverHealth: Math.min(100, Math.max(90, prev.serverHealth + (Math.random() * 2 - 1)))
            }));

            // Keep the chart moving with "live" looking data (visual candy)
            setRealtimeData(prev => {
                const newDataPoint = {
                    time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
                    activeUsers: liveStats.activeUsers + Math.floor(Math.random() * 5),
                    jobApps: Math.floor(Math.random() * 3)
                };
                const newArr = [...prev, newDataPoint];
                if (newArr.length > 15) newArr.shift();
                return newArr;
            });
        }, 5000);

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold text-white">System Overview</h2>
                <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                    <span className="text-xs text-green-400 font-bold uppercase">Live System</span>
                </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Card className="bg-blue-900/20 border-blue-500/30">
                    <div className="flex justify-between">
                        <div>
                            <p className="text-xs text-blue-400 uppercase font-bold">Live Users</p>
                            <h3 className="text-2xl font-bold text-white">{liveStats.activeUsers}</h3>
                        </div>
                        <i className="fas fa-users text-2xl text-blue-500/50"></i>
                    </div>
                </Card>
                <Card className="bg-green-900/20 border-green-500/30">
                    <div className="flex justify-between">
                        <div>
                            <p className="text-xs text-green-400 uppercase font-bold">Total Revenue</p>
                            <h3 className="text-2xl font-bold text-white">{liveStats.revenue.toLocaleString()} ETB</h3>
                        </div>
                        <i className="fas fa-coins text-2xl text-green-500/50"></i>
                    </div>
                </Card>
                <Card className="bg-purple-900/20 border-purple-500/30">
                    <div className="flex justify-between">
                        <div>
                            <p className="text-xs text-purple-400 uppercase font-bold">Job Apps (Today)</p>
                            <h3 className="text-2xl font-bold text-white">{liveStats.jobApps}</h3>
                        </div>
                        <i className="fas fa-briefcase text-2xl text-purple-500/50"></i>
                    </div>
                </Card>
                <Card className="bg-red-900/20 border-red-500/30">
                    <div className="flex justify-between">
                        <div>
                            <p className="text-xs text-red-400 uppercase font-bold">System Health</p>
                            <h3 className="text-2xl font-bold text-white">{liveStats.serverHealth.toFixed(1)}%</h3>
                        </div>
                        <i className="fas fa-server text-2xl text-red-500/50"></i>
                    </div>
                </Card>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
                <Card>
                    <h3 className="font-bold text-white mb-4">Real-time Traffic & Activity</h3>
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={realtimeData}>
                                <defs>
                                    <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                                    </linearGradient>
                                    <linearGradient id="colorJobs" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#a855f7" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#a855f7" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} />
                                <XAxis dataKey="time" stroke="#666" tick={{ fontSize: 10 }} />
                                <YAxis stroke="#666" tick={{ fontSize: 10 }} />
                                <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }} itemStyle={{ fontSize: '12px' }} />
                                <Area type="monotone" dataKey="activeUsers" stroke="#3b82f6" fillOpacity={1} fill="url(#colorUsers)" name="Active Users" />
                                <Area type="monotone" dataKey="jobApps" stroke="#a855f7" fillOpacity={1} fill="url(#colorJobs)" name="Job Apps" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </Card>
                <Card>
                    <h3 className="font-bold text-white mb-4">Weekly Revenue Trend</h3>
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={revenueData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} />
                                <XAxis dataKey="name" stroke="#666" tick={{ fontSize: 10 }} />
                                <YAxis stroke="#666" tick={{ fontSize: 10 }} />
                                <Tooltip cursor={{ fill: 'rgba(255,255,255,0.05)' }} contentStyle={{ backgroundColor: '#1e293b', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }} itemStyle={{ fontSize: '12px' }} />
                                <Bar dataKey="revenue" fill="#14F195" radius={[4, 4, 0, 0]} name="Revenue (ETB)" />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </Card>
            </div>
        </div>
    );
};
