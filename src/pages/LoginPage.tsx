import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { StoreContext } from '../contexts/StoreContext';
import { ToastContext } from '../contexts/ToastContext';
import { api } from '../services/api';
import { UserRole } from '../types';
import { Button } from '../components/common/Button';

export const LoginPage: React.FC = () => {
    const { dispatch } = useContext(StoreContext);
    const navigate = useNavigate();
    const { addToast } = useContext(ToastContext);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [error, setError] = useState('');

    const handleCredentialsSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (!formData.email || !formData.password) {
            setError('Please enter email and password');
            return;
        }

        setLoading(true);
        try {
            // Store token immediately
            const mockToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZW1haWwiOiJkZW1vQHRlbWFyaXdhcmUuY29tIiwicm9sZSI6IlNUVURFTlQiLCJleHAiOjk5OTk5OTk5OTl9.test';
            localStorage.setItem('tm_token', mockToken);
            
            // Create user immediately
            const user = {
                id: 1,
                name: formData.email.split('@')[0],
                email: formData.email,
                university: 'TemariWare University',
                role: UserRole.STUDENT,
                isVerified: true,
                walletBalance: 1250,
                xp: 120,
                level: 1,
                streak: 5,
                dailyClaimed: false,
                skills: [],
                projects: [],
                transactions: [],
                appliedJobs: [],
                activeEkubs: [],
                enrolledCourses: [],
                createdCourses: []
            };

            dispatch({ type: 'LOGIN', payload: user });
            addToast(`Welcome back, ${user.name}!`, 'success');
            navigate('/');
        } catch (err: any) {
            setError('Login failed. Try demo@temariware.com / demo123');
            addToast("Login Failed", "error");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-6 bg-black bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-gray-900 via-[#000] to-[#000]">
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none"></div>
            <div className="w-full max-w-md bg-[#1e293b]/50 backdrop-blur-xl p-8 rounded-3xl shadow-2xl border border-white/10 relative z-10">
                <div className="text-center mb-8">
                    <div className="w-20 h-20 bg-gradient-to-tr from-primary to-blue-600 rounded-2xl mx-auto flex items-center justify-center text-black text-3xl font-bold shadow-[0_0_30px_rgba(20,241,149,0.3)] mb-4 animate-float">
                        <i className="fas fa-graduation-cap"></i>
                    </div>
                    <h1 className="text-3xl font-bold text-white mb-2">Welcome Back</h1>
                    <p className="text-gray-400 text-sm">TemariWare Student Ecosystem</p>
                </div>
                <form onSubmit={handleCredentialsSubmit} className="space-y-4">
                    <div>
                        <label className="block text-xs font-bold text-gray-400 mb-2 uppercase tracking-wider">Email</label>
                        <div className="relative">
                            <i className="fas fa-envelope absolute left-4 top-3.5 text-gray-500"></i>
                            <input
                                type="email"
                                value={formData.email}
                                onChange={e => setFormData({ ...formData, email: e.target.value })}
                                className="w-full bg-black/50 border border-gray-700 rounded-xl pl-10 pr-4 py-3 text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all text-white"
                                placeholder="student@university.edu.et"
                                autoComplete="email"
                                required
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-gray-400 mb-2 uppercase tracking-wider">Password</label>
                        <div className="relative">
                            <i className="fas fa-lock absolute left-4 top-3.5 text-gray-500"></i>
                            <input
                                type="password"
                                value={formData.password}
                                onChange={e => setFormData({ ...formData, password: e.target.value })}
                                className="w-full bg-black/50 border border-gray-700 rounded-xl pl-10 pr-4 py-3 text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all text-white"
                                placeholder="••••••••"
                                autoComplete="current-password"
                                required
                            />
                        </div>
                    </div>
                    {error && <p className="text-red-500 text-xs font-bold bg-red-500/10 p-2 rounded-lg text-center">{error}</p>}

                    <Button type="submit" disabled={loading} className="w-full !mt-6 text-lg">
                        {loading ? <i className="fas fa-circle-notch fa-spin"></i> : 'Login to Ecosystem'}
                    </Button>
                    <p className="text-center text-xs text-gray-500 mt-6">
                        Don't have an account?{' '}
                        <button
                            type="button"
                            onClick={() => navigate('/register')}
                            className="text-primary font-bold hover:underline focus:outline-none"
                        >
                            Create Account
                        </button>
                    </p>
                </form>
            </div>
        </div>
    );
};
