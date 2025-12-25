import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { StoreContext } from '../contexts/StoreContext';
import { ToastContext } from '../contexts/ToastContext';
import { api } from '../services/api';
import { UNIVERSITIES } from '../constants';
import { Button } from '../components/common/Button';

export const RegisterPage: React.FC = () => {
    const { dispatch } = useContext(StoreContext);
    const { addToast } = useContext(ToastContext);
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        university: UNIVERSITIES[0],
        customUniversity: '',
        department: '',
        batch: '',
        idFile: null as File | null
    });
    const [passwordStrength, setPasswordStrength] = useState(0);
    const [emailValid, setEmailValid] = useState(true);
    const [passwordsMatch, setPasswordsMatch] = useState(true);

    const validateEmail = (email: string) => {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        setEmailValid(re.test(email));
    };

    const checkStrength = (pass: string) => {
        let s = 0;
        if (pass.length > 5) s++;
        if (pass.length > 9) s++;
        if (/[A-Z]/.test(pass)) s++;
        if (/[0-9]/.test(pass)) s++;
        setPasswordStrength(s);
    };

    const checkPasswordsMatch = (password: string, confirm: string) => {
        setPasswordsMatch(password === confirm);
    };

    const handleRegister = async () => {
        // Validation
        if (!formData.name || !formData.email || !formData.password) {
            addToast('Please fill in all required fields', 'error');
            return;
        }

        if (!emailValid) {
            addToast('Please enter a valid email address', 'error');
            return;
        }

        if (passwordStrength < 2) {
            addToast('Password is too weak. Use uppercase, numbers, and at least 6 characters', 'error');
            return;
        }

        if (!passwordsMatch) {
            addToast('Passwords do not match', 'error');
            return;
        }

        setLoading(true);
        try {
            const registrationData = {
                name: formData.name,
                email: formData.email,
                password: formData.password,
                university: formData.university === "Other (Please specify)" ? formData.customUniversity : formData.university,
                department: formData.department,
                batch: formData.batch,
            };

            const { user, token } = await api.auth.register(registrationData);

            // Store token
            localStorage.setItem('tm_token', token);
            
            // Dispatch login action
            dispatch({ type: 'LOGIN', payload: user });

            addToast(`Welcome to TemariWare, ${user.name}!`, 'success');
            navigate('/');
        } catch (error: any) {
            console.error('Registration error:', error);
            const errorMessage = error.message || 'Failed to create account. Please try again.';
            addToast(errorMessage, 'error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-6 bg-black bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-gray-900 via-[#000] to-[#000]">
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none"></div>
            <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="w-full max-w-md bg-[#1e293b]/50 backdrop-blur-xl p-8 rounded-3xl shadow-2xl border border-white/10 relative z-10"
            >
                <div className="text-center mb-8">
                    <div className="w-20 h-20 bg-gradient-to-tr from-primary to-blue-600 rounded-2xl mx-auto flex items-center justify-center text-black text-3xl font-bold shadow-[0_0_30px_rgba(20,241,149,0.3)] mb-4">
                        <i className="fas fa-user-plus"></i>
                    </div>
                    <h1 className="text-3xl font-bold text-white mb-2">Create Account</h1>
                    <p className="text-gray-400 text-sm">Join the TemariWare Student Ecosystem</p>
                </div>

                <div className="flex justify-between items-center mb-6">
                    <div className="flex-1 h-1 rounded-full bg-primary"></div>
                    <div className={`flex-1 h-1 rounded-full mx-2 ${step >= 2 ? 'bg-primary' : 'bg-gray-700'}`}></div>
                    <span className="text-xs font-bold text-gray-400 ml-2">Step {step}/2</span>
                </div>

                {step === 1 ? (
                    <div className="space-y-4">
                        <div>
                            <label className="block text-xs font-bold text-gray-400 mb-2 uppercase tracking-wider">Full Name *</label>
                            <input
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                className="w-full bg-black/50 border border-gray-700 rounded-xl px-4 py-3 text-sm text-white focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                                placeholder="e.g. Abebe Kebede"
                                autoComplete="name"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-gray-400 mb-2 uppercase tracking-wider">Email *</label>
                            <input
                                type="email"
                                value={formData.email}
                                onChange={(e) => { setFormData({ ...formData, email: e.target.value }); validateEmail(e.target.value); }}
                                className={`w-full bg-black/50 border ${emailValid ? 'border-gray-700' : 'border-red-500'} rounded-xl px-4 py-3 text-sm text-white focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all`}
                                placeholder="student@university.edu.et"
                                autoComplete="email"
                            />
                            {!emailValid && formData.email && (
                                <p className="text-xs text-red-400 mt-1"><i className="fas fa-exclamation-circle mr-1"></i>Invalid email format</p>
                            )}
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-gray-400 mb-2 uppercase tracking-wider">Password *</label>
                            <input
                                type="password"
                                value={formData.password}
                                onChange={(e) => {
                                    setFormData({ ...formData, password: e.target.value });
                                    checkStrength(e.target.value);
                                    checkPasswordsMatch(e.target.value, formData.confirmPassword);
                                }}
                                className="w-full bg-black/50 border border-gray-700 rounded-xl px-4 py-3 text-sm text-white focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                                placeholder="Create a strong password"
                                autoComplete="new-password"
                            />
                            <div className="flex gap-1 mt-2 h-1">
                                {[1, 2, 3, 4].map(i => (
                                    <div key={i} className={`flex-1 rounded-full transition-all ${i <= passwordStrength ? 'bg-primary' : 'bg-gray-700'}`}></div>
                                ))}
                            </div>
                            <p className="text-[10px] text-gray-400 mt-1">
                                {['Weak', 'Fair', 'Good', 'Strong'][passwordStrength - 1] || 'Use uppercase, numbers, and 6+ characters'}
                            </p>
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-gray-400 mb-2 uppercase tracking-wider">Confirm Password *</label>
                            <input
                                type="password"
                                value={formData.confirmPassword}
                                onChange={(e) => {
                                    setFormData({ ...formData, confirmPassword: e.target.value });
                                    checkPasswordsMatch(formData.password, e.target.value);
                                }}
                                className={`w-full bg-black/50 border ${passwordsMatch ? 'border-gray-700' : 'border-red-500'} rounded-xl px-4 py-3 text-sm text-white focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all`}
                                placeholder="Confirm your password"
                                autoComplete="new-password"
                            />
                            {!passwordsMatch && formData.confirmPassword && (
                                <p className="text-xs text-red-400 mt-1"><i className="fas fa-exclamation-circle mr-1"></i>Passwords do not match</p>
                            )}
                        </div>

                        <Button
                            onClick={() => setStep(2)}
                            className="w-full !mt-6"
                            disabled={!formData.email || !emailValid || passwordStrength < 2 || !passwordsMatch || !formData.name}
                        >
                            Next Step <i className="fas fa-arrow-right ml-2"></i>
                        </Button>

                        <p className="text-center text-xs text-gray-500 mt-4">
                            Already have an account?{' '}
                            <button
                                type="button"
                                onClick={() => navigate('/login')}
                                className="text-primary font-bold hover:underline focus:outline-none"
                            >
                                Login
                            </button>
                        </p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        <div className="bg-blue-500/10 p-4 rounded-xl border border-blue-500/20 text-blue-200 text-xs">
                            <i className="fas fa-info-circle mr-2"></i>
                            Complete your profile to unlock all features
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-gray-400 mb-2 uppercase tracking-wider">University *</label>
                            <select
                                value={formData.university}
                                onChange={(e) => setFormData({ ...formData, university: e.target.value, customUniversity: '' })}
                                className="w-full bg-black/50 border border-gray-700 rounded-xl px-4 py-3 text-sm text-white focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                            >
                                {UNIVERSITIES.map(u => <option key={u} value={u}>{u}</option>)}
                            </select>
                        </div>

                        {/* Custom University Input - shows when "Other" is selected */}
                        {formData.university === "Other (Please specify)" && (
                            <div>
                                <label className="block text-xs font-bold text-gray-400 mb-2 uppercase tracking-wider">
                                    Enter Your University/College Name *
                                </label>
                                <input
                                    value={formData.customUniversity}
                                    onChange={(e) => setFormData({ ...formData, customUniversity: e.target.value })}
                                    className="w-full bg-black/50 border border-gray-700 rounded-xl px-4 py-3 text-sm text-white focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                                    placeholder="e.g. Your University or College Name"
                                    required
                                />
                            </div>
                        )}

                        <div>
                            <label className="block text-xs font-bold text-gray-400 mb-2 uppercase tracking-wider">Department</label>
                            <input
                                value={formData.department}
                                onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                                className="w-full bg-black/50 border border-gray-700 rounded-xl px-4 py-3 text-sm text-white focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                                placeholder="e.g. Computer Science"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-gray-400 mb-2 uppercase tracking-wider">Batch/Year</label>
                            <input
                                value={formData.batch}
                                onChange={(e) => setFormData({ ...formData, batch: e.target.value })}
                                className="w-full bg-black/50 border border-gray-700 rounded-xl px-4 py-3 text-sm text-white focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
                                placeholder="e.g. 2024"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-gray-400 mb-2 uppercase tracking-wider">University ID (Optional)</label>
                            <div className="border-2 border-dashed border-gray-600 hover:border-primary rounded-xl p-6 text-center cursor-pointer transition-colors group relative">
                                <i className="fas fa-id-card text-3xl text-gray-400 group-hover:text-primary mb-2"></i>
                                <p className="text-sm text-white font-bold">Upload ID</p>
                                <p className="text-xs text-gray-500">Unlock verified features</p>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => setFormData({ ...formData, idFile: e.target.files?.[0] || null })}
                                    className="absolute inset-0 opacity-0 cursor-pointer"
                                />
                                {formData.idFile && (
                                    <p className="text-xs text-primary mt-2"><i className="fas fa-check-circle mr-1"></i>{formData.idFile.name}</p>
                                )}
                            </div>
                        </div>

                        <div className="flex gap-3 pt-4">
                            <Button variant="outline" onClick={() => setStep(1)} className="flex-1">
                                <i className="fas fa-arrow-left mr-2"></i> Back
                            </Button>
                            <Button onClick={handleRegister} className="flex-1" disabled={loading}>
                                {loading ? <i className="fas fa-circle-notch fa-spin"></i> : <>Create Account <i className="fas fa-check ml-2"></i></>}
                            </Button>
                        </div>
                    </div>
                )}
            </motion.div>
        </div>
    );
};
