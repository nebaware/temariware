import React, { useState, useReducer, useEffect } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { DICTIONARY } from './constants';
import { AdminRole } from './types';
import { StoreContext, appReducer, loadInitialState } from './contexts/StoreContext';
import { LanguageContext } from './contexts/LanguageContext';
import { DataSaverContext } from './contexts/DataSaverContext';
import { ToastProvider } from './contexts/ToastContext';
import { authUtils } from './utils/auth';
import { api } from './services/api';
import { socketService } from './services/socket';
import { realTimeService } from './services/realtime';
import { TelegramWebApp } from './utils/telegram';

// Layout Components
import { TopHeader } from './components/layout/TopHeader';
import { BottomNav } from './components/layout/BottomNav';
import { MentorChat } from './components/layout/MentorChat';
import { AdminLayout } from './components/layout/AdminLayout';

// Guards
import { AuthGuard } from './components/guards/AuthGuard';
import { AdminGuard } from './components/guards/AdminGuard';

// Pages
import { HomePage } from './pages/HomePage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { DiscoverPage } from './pages/DiscoverPage';
import { WorkHubPage } from './pages/WorkHubPage';
import { GebetaPage } from './pages/GebetaPage';
import { CreateCoursePage } from './pages/CreateCoursePage';
import { WalletPage } from './pages/WalletPage';
import { ProfilePage } from './pages/ProfilePage';
import { EditProfilePage } from './pages/EditProfilePage';
import { ResumeBuilderPage } from './pages/ResumeBuilderPage';
import { ProjectWorkspace } from './pages/ProjectWorkspace';
import { LiveClassRoom } from './pages/LiveClassRoom';
import { MessagesPage } from './pages/MessagesPage';
import { EkubPage } from './pages/EkubPage';
import { MicroJobsPage } from './pages/MicroJobsPage';
import { CampusPage } from './pages/CampusPage';
import { SettingsPage } from './pages/SettingsPage';
import { SubscriptionPage } from './pages/SubscriptionPage';

// Components
import { NotificationCenter } from './components/NotificationCenter';
import { NotificationProvider } from './contexts/NotificationContext';

// Admin Pages
import { AdminOverview } from './pages/admin/AdminOverview';
import { AdminUsers } from './pages/admin/AdminUsers';
import { AdminVerifications } from './pages/admin/AdminVerifications';
import { AdminJobs } from './pages/admin/AdminJobs';
import { AdminFinance } from './pages/admin/AdminFinance';
import { AdminLogs } from './pages/admin/AdminLogs';

const App: React.FC = () => {
    const [state, dispatch] = useReducer(appReducer, {}, loadInitialState);
    const [lang, setLang] = useState<'en' | 'am'>('en');
    const t = (key: string) => DICTIONARY[key]?.[lang] || key;

    useEffect(() => {
        // Initialize Telegram WebApp if available
        if (TelegramWebApp.isAvailable()) {
            TelegramWebApp.init();
            const telegramUser = TelegramWebApp.getUser();
            if (telegramUser) {
                console.log('Telegram user:', telegramUser);
            }
        }

        // Normalize URL for HashRouter: redirect /path to /#/path
        // This ensures assets load correctly from the root even if the user enters a subpath
        if (window.location.pathname !== '/' && window.location.pathname !== '/index.html') {
            const hash = window.location.hash || '#/';
            window.location.replace('/' + hash);
            return;
        }

        const restoreSession = async () => {
            const decodedToken = authUtils.verifyToken();
            if (decodedToken) {
                try {
                    const user = await api.user.getMe();
                    dispatch({ type: 'LOGIN', payload: user });
                    socketService.connect(user.id);
                    realTimeService.connect(user.id.toString());
                } catch (error) {
                    console.error("Session restore failed", error);
                    dispatch({ type: 'LOGOUT' });
                    socketService.disconnect();
                }
            }
        };

        restoreSession();
        authUtils.setupAutoLogout(dispatch);

        return () => {
            socketService.disconnect();
            realTimeService.disconnect();
        };
    }, []);

    return (
        <StoreContext.Provider value={{ state, dispatch }}>
            <LanguageContext.Provider value={{ lang, toggleLang: () => setLang(l => l === 'en' ? 'am' : 'en'), t }}>
                <DataSaverContext.Provider value={{ dataSaver: false, toggleDataSaver: () => { } }}>
                    <NotificationProvider>
                        <ToastProvider>
                            <HashRouter>
                                <div className="min-h-screen bg-black text-gray-100 font-sans pb-safe selection:bg-primary selection:text-black">
                                    {/* Notification Center - Only show when authenticated */}
                                    {state.isAuthenticated && (
                                        <div className="fixed top-4 right-4 z-50">
                                            <NotificationCenter />
                                        </div>
                                    )}
                                    <Routes>
                                        {/* Public Routes */}
                                        <Route path="/login" element={<LoginPage />} />
                                        <Route path="/register" element={<RegisterPage />} />

                                        {/* Admin Routes */}
                                        <Route path="/admin" element={<AdminGuard roles={[AdminRole.SUPER_ADMIN, AdminRole.MODERATOR]}><AdminLayout><AdminOverview /></AdminLayout></AdminGuard>} />
                                        <Route path="/admin/users" element={<AdminGuard roles={[AdminRole.SUPER_ADMIN, AdminRole.VERIFICATION]}><AdminLayout><AdminUsers /></AdminLayout></AdminGuard>} />
                                        <Route path="/admin/verifications" element={<AdminGuard roles={[AdminRole.SUPER_ADMIN, AdminRole.VERIFICATION]}><AdminLayout><AdminVerifications /></AdminLayout></AdminGuard>} />
                                        <Route path="/admin/jobs" element={<AdminGuard roles={[AdminRole.SUPER_ADMIN, AdminRole.MODERATOR]}><AdminLayout><AdminJobs /></AdminLayout></AdminGuard>} />
                                        <Route path="/admin/finance" element={<AdminGuard roles={[AdminRole.SUPER_ADMIN, AdminRole.FINANCE]}><AdminLayout><AdminFinance /></AdminLayout></AdminGuard>} />
                                        <Route path="/admin/logs" element={<AdminGuard roles={[AdminRole.SUPER_ADMIN]}><AdminLayout><AdminLogs /></AdminLayout></AdminGuard>} />

                                        {/* Protected User Routes */}
                                        <Route path="/" element={<AuthGuard><HomePage /></AuthGuard>} />
                                        <Route path="/discover" element={<AuthGuard><DiscoverPage /></AuthGuard>} />
                                        <Route path="/work" element={<AuthGuard><WorkHubPage /></AuthGuard>} />
                                        <Route path="/gebeta" element={<AuthGuard><GebetaPage /></AuthGuard>} />
                                        <Route path="/create-course" element={<AuthGuard><CreateCoursePage /></AuthGuard>} />
                                        <Route path="/wallet" element={<AuthGuard><WalletPage /></AuthGuard>} />
                                        <Route path="/profile" element={<AuthGuard><ProfilePage /></AuthGuard>} />
                                        <Route path="/edit-profile" element={<AuthGuard><EditProfilePage /></AuthGuard>} />
                                        <Route path="/resume-builder" element={<AuthGuard><ResumeBuilderPage /></AuthGuard>} />
                                        <Route path="/workspace/:id" element={<AuthGuard><ProjectWorkspace /></AuthGuard>} />
                                        <Route path="/live/:id" element={<AuthGuard><LiveClassRoom /></AuthGuard>} />
                                        <Route path="/messages" element={<AuthGuard><MessagesPage /></AuthGuard>} />
                                        <Route path="/ekub" element={<AuthGuard><EkubPage /></AuthGuard>} />
                                        <Route path="/micro-jobs" element={<AuthGuard><MicroJobsPage /></AuthGuard>} />
                                        <Route path="/campus" element={<AuthGuard><CampusPage /></AuthGuard>} />
                                        <Route path="/settings" element={<AuthGuard><SettingsPage /></AuthGuard>} />
                                        <Route path="/subscription" element={<AuthGuard><SubscriptionPage /></AuthGuard>} />

                                        {/* Fallback */}
                                        <Route path="*" element={<Navigate to="/" />} />
                                    </Routes>
                                    {state.isAuthenticated && <MentorChat />}
                                    {!window.location.hash.includes('admin') && state.isAuthenticated && <BottomNav />}
                                </div>
                            </HashRouter>
                        </ToastProvider>
                    </NotificationProvider>
                </DataSaverContext.Provider>
            </LanguageContext.Provider>
        </StoreContext.Provider>
    );
}

export default App;
