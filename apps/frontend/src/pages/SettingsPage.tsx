import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { StoreContext } from '../contexts/StoreContext';
import { ToastContext } from '../contexts/ToastContext';
import { LanguageContext } from '../contexts/LanguageContext';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';

export const SettingsPage: React.FC = () => {
    const { state, dispatch } = useContext(StoreContext);
    const { addToast } = useContext(ToastContext);
    const { lang, toggleLang } = useContext(LanguageContext);
    const navigate = useNavigate();

    const [notifications, setNotifications] = useState(true);
    const [emailAlerts, setEmailAlerts] = useState(false);
    const [dataSaver, setDataSaver] = useState(false);
    const [darkMode] = useState(true);

    const handleSave = () => {
        addToast('Settings saved successfully!', 'success');
    };

    const handleLogout = () => {
        if (window.confirm('Are you sure you want to logout?')) {
            dispatch({ type: 'LOGOUT' });
            navigate('/login');
        }
    };

    return (
        <div className="min-h-screen bg-black pb-24">
            {/* Header */}
            <div className="p-6 bg-gradient-to-br from-gray-700/20 to-gray-900/20 border-b border-white/10">
                <button onClick={() => navigate(-1)} className="text-gray-400 hover:text-white mb-4">
                    <i className="fas fa-arrow-left mr-2"></i> Back
                </button>
                <div>
                    <h1 className="text-3xl font-bold text-white mb-2">Settings</h1>
                    <p className="text-gray-400">Manage your account preferences</p>
                </div>
            </div>

            <div className="p-6 space-y-4">
                {/* Account Section */}
                <div>
                    <h3 className="text-white font-bold mb-3">Account</h3>
                    <Card className="!p-4 space-y-4">
                        <div className="flex justify-between items-center">
                            <div>
                                <p className="text-white font-medium">Email</p>
                                <p className="text-xs text-gray-400">{state.user?.email}</p>
                            </div>
                            <button className="text-primary text-sm">Change</button>
                        </div>

                        <div className="flex justify-between items-center">
                            <div>
                                <p className="text-white font-medium">Password</p>
                                <p className="text-xs text-gray-400">••••••••</p>
                            </div>
                            <button className="text-primary text-sm">Change</button>
                        </div>

                        <div className="flex justify-between items-center">
                            <div>
                                <p className="text-white font-medium">Two-Factor Authentication</p>
                                <p className="text-xs text-gray-400">
                                    {state.user?.is2FAEnabled ? 'Enabled' : 'Not enabled'}
                                </p>
                            </div>
                            <button className="text-primary text-sm">
                                {state.user?.is2FAEnabled ? 'Disable' : 'Enable'}
                            </button>
                        </div>
                    </Card>
                </div>

                {/* Notifications */}
                <div>
                    <h3 className="text-white font-bold mb-3">Notifications</h3>
                    <Card className="!p-4 space-y-4">
                        <div className="flex justify-between items-center">
                            <div>
                                <p className="text-white font-medium">Push Notifications</p>
                                <p className="text-xs text-gray-400">Job updates, messages, etc.</p>
                            </div>
                            <button
                                onClick={() => setNotifications(!notifications)}
                                className={`w-12 h-6 rounded-full transition-colors ${notifications ? 'bg-primary' : 'bg-gray-700'}`}
                            >
                                <div className={`w-5 h-5 bg-white rounded-full transition-transform ${notifications ? 'translate-x-6' : 'translate-x-0.5'}`}></div>
                            </button>
                        </div>

                        <div className="flex justify-between items-center">
                            <div>
                                <p className="text-white font-medium">Email Alerts</p>
                                <p className="text-xs text-gray-400">Important updates via email</p>
                            </div>
                            <button
                                onClick={() => setEmailAlerts(!emailAlerts)}
                                className={`w-12 h-6 rounded-full transition-colors ${emailAlerts ? 'bg-primary' : 'bg-gray-700'}`}
                            >
                                <div className={`w-5 h-5 bg-white rounded-full transition-transform ${emailAlerts ? 'translate-x-6' : 'translate-x-0.5'}`}></div>
                            </button>
                        </div>
                    </Card>
                </div>

                {/* Preferences */}
                <div>
                    <h3 className="text-white font-bold mb-3">Preferences</h3>
                    <Card className="!p-4 space-y-4">
                        <div className="flex justify-between items-center">
                            <div>
                                <p className="text-white font-medium">Language</p>
                                <p className="text-xs text-gray-400">{lang === 'en' ? 'English' : 'አማርኛ'}</p>
                            </div>
                            <button onClick={toggleLang} className="text-primary text-sm">
                                Switch to {lang === 'en' ? 'አማርኛ' : 'English'}
                            </button>
                        </div>

                        <div className="flex justify-between items-center">
                            <div>
                                <p className="text-white font-medium">Dark Mode</p>
                                <p className="text-xs text-gray-400">Always enabled</p>
                            </div>
                            <div className={`w-12 h-6 rounded-full bg-primary`}>
                                <div className={`w-5 h-5 bg-white rounded-full translate-x-6`}></div>
                            </div>
                        </div>

                        <div className="flex justify-between items-center">
                            <div>
                                <p className="text-white font-medium">Data Saver Mode</p>
                                <p className="text-xs text-gray-400">Reduce data usage</p>
                            </div>
                            <button
                                onClick={() => setDataSaver(!dataSaver)}
                                className={`w-12 h-6 rounded-full transition-colors ${dataSaver ? 'bg-primary' : 'bg-gray-700'}`}
                            >
                                <div className={`w-5 h-5 bg-white rounded-full transition-transform ${dataSaver ? 'translate-x-6' : 'translate-x-0.5'}`}></div>
                            </button>
                        </div>
                    </Card>
                </div>

                {/* Privacy & Security */}
                <div>
                    <h3 className="text-white font-bold mb-3">Privacy & Security</h3>
                    <Card className="!p-4 space-y-3">
                        <button className="w-full text-left flex justify-between items-center">
                            <span className="text-white">Blocked Users</span>
                            <i className="fas fa-chevron-right text-gray-500"></i>
                        </button>
                        <button className="w-full text-left flex justify-between items-center">
                            <span className="text-white">Privacy Policy</span>
                            <i className="fas fa-chevron-right text-gray-500"></i>
                        </button>
                        <button className="w-full text-left flex justify-between items-center">
                            <span className="text-white">Terms of Service</span>
                            <i className="fas fa-chevron-right text-gray-500"></i>
                        </button>
                    </Card>
                </div>

                {/* About */}
                <div>
                    <h3 className="text-white font-bold mb-3">About</h3>
                    <Card className="!p-4 space-y-3">
                        <div className="flex justify-between">
                            <span className="text-gray-400">Version</span>
                            <span className="text-white">1.0.0</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-400">Platform</span>
                            <span className="text-white">TemariWare</span>
                        </div>
                        <button className="w-full text-left flex justify-between items-center">
                            <span className="text-white">Help & Support</span>
                            <i className="fas fa-chevron-right text-gray-500"></i>
                        </button>
                    </Card>
                </div>

                {/* Action Buttons */}
                <div className="space-y-3 pt-4">
                    <Button onClick={handleSave} className="w-full">
                        <i className="fas fa-save mr-2"></i> Save Settings
                    </Button>
                    <button
                        onClick={handleLogout}
                        className="w-full py-3 bg-red-500/10 text-red-400 rounded-xl font-bold hover:bg-red-500/20"
                    >
                        <i className="fas fa-sign-out-alt mr-2"></i> Logout
                    </button>
                </div>
            </div>
        </div>
    );
};
