import React, { createContext } from 'react';
import { GlobalState, AppAction, UserApplication, Message, Course, Experience, Education, UserProfile } from '../types';
import { authUtils } from '../utils/auth';
import { MOCK_EKUBS, MOCK_NOTIFICATIONS, MOCK_LIVE_SESSIONS, MOCK_NEWS_FEED, MOCK_STORIES, MOCK_COURSES, MOCK_AUDIT_LOGS, MOCK_VERIFICATIONS, MOCK_REPORTS, DISCOVER_USERS, MOCK_CONVERSATIONS } from '../constants';

export const StoreContext = createContext<{ state: GlobalState, dispatch: React.Dispatch<AppAction> }>({
    state: {
        user: null, isAuthenticated: false, jobs: [], ekubs: [], notifications: [], liveSessions: [], newsFeed: [], stories: [], courses: [],
        auditLogs: [], verificationRequests: [], reports: [], allUsers: [], conversations: []
    },
    dispatch: () => { }
});

const DEFAULT_USER_PROPERTIES: Partial<UserProfile> = {
    bio: '',
    skills: [],
    projects: [],
    avatar: '',
    walletBalance: 0,
    transactions: [],
    activeEkubs: [],
    appliedJobs: [],
    xp: 0,
    level: 1,
    streak: 0,
    dailyClaimed: false,
    enrolledCourses: [],
    createdCourses: []
};

export const loadInitialState = (): GlobalState => {
    // The user's session will be restored via a useEffect in App.tsx, not here.
    return {
        user: null,
        isAuthenticated: false,
        jobs: [], // Start empty, fetch via API
        ekubs: MOCK_EKUBS,
        notifications: MOCK_NOTIFICATIONS,
        liveSessions: MOCK_LIVE_SESSIONS,
        newsFeed: MOCK_NEWS_FEED,
        stories: MOCK_STORIES,
        courses: MOCK_COURSES,
        auditLogs: MOCK_AUDIT_LOGS,
        verificationRequests: MOCK_VERIFICATIONS,
        reports: MOCK_REPORTS,
        allUsers: DISCOVER_USERS,
        conversations: MOCK_CONVERSATIONS
    };
};

export const appReducer = (state: GlobalState, action: AppAction): GlobalState => {
    let newState = state;
    switch (action.type) {
        case 'LOGIN':
            const fullUser = { ...DEFAULT_USER_PROPERTIES, ...action.payload } as UserProfile;
            newState = { ...state, user: fullUser, isAuthenticated: true };
            // Persist user object for convenience, but it's not used for auth checks.
            localStorage.setItem('tm_user', JSON.stringify(fullUser));
            break;
        case 'LOGOUT':
            newState = { ...state, user: null, isAuthenticated: false };
            authUtils.clearAuth();
            break;
        case 'UPDATE_PROFILE':
            newState = {
                ...state,
                user: state.user ? { ...state.user, ...action.payload } : null
            };
            if (newState.user) localStorage.setItem('tm_user', JSON.stringify(newState.user));
            break;
        case 'ADD_PROJECT': if (!state.user) return state; newState = { ...state, user: { ...state.user, projects: [action.payload, ...state.user.projects] } }; break;
        case 'REMOVE_PROJECT': if (!state.user) return state; newState = { ...state, user: { ...state.user, projects: state.user.projects.filter(p => p.id !== action.payload) } }; break;
        case 'ADD_SKILL': if (!state.user) return state; newState = { ...state, user: { ...state.user, skills: [...state.user.skills, action.payload] } }; break;
        case 'REMOVE_SKILL': if (!state.user) return state; newState = { ...state, user: { ...state.user, skills: state.user.skills.filter(s => s.name !== action.payload) } }; break;
        case 'ADD_CERTIFICATION': if (!state.user) return state; newState = { ...state, user: { ...state.user, certifications: [...(state.user.certifications || []), action.payload] } }; break;
        case 'REMOVE_CERTIFICATION': if (!state.user) return state; newState = { ...state, user: { ...state.user, certifications: state.user.certifications?.filter(c => c.id !== action.payload) } }; break;
        case 'ADD_EXPERIENCE': if (!state.user) return state; newState = { ...state, user: { ...state.user, experience: [...(state.user.experience || []), action.payload] } }; break;
        case 'REMOVE_EXPERIENCE': if (!state.user) return state; newState = { ...state, user: { ...state.user, experience: state.user.experience?.filter(e => e.id !== action.payload) } }; break;
        case 'ADD_EDUCATION': if (!state.user) return state; newState = { ...state, user: { ...state.user, educationHistory: [...(state.user.educationHistory || []), action.payload] } }; break;
        case 'REMOVE_EDUCATION': if (!state.user) return state; newState = { ...state, user: { ...state.user, educationHistory: state.user.educationHistory?.filter(e => e.id !== action.payload) } }; break;
        case 'ADD_TRANSACTION': if (!state.user) return state; const newBal = action.payload.type === 'Credit' ? state.user.walletBalance + action.payload.amount : state.user.walletBalance - action.payload.amount; newState = { ...state, user: { ...state.user, walletBalance: newBal, transactions: [action.payload, ...state.user.transactions] } }; if (newState.user) localStorage.setItem('tm_user', JSON.stringify(newState.user)); break;
        case 'APPLY_JOB':
            if (!state.user) return state;
            const alreadyApplied = state.user.appliedJobs.some(app => app.jobId === action.payload);
            if (alreadyApplied) return state;
            const updatedJobs = state.jobs.map(j => j.id === action.payload ? { ...j, applicantsCount: j.applicantsCount + 1 } : j);
            const newApplication: UserApplication = {
                jobId: action.payload,
                status: 'Applied',
                appliedAt: new Date().toISOString()
            };
            newState = { ...state, user: { ...state.user, appliedJobs: [...state.user.appliedJobs, newApplication] }, jobs: updatedJobs };
            if (newState.user) localStorage.setItem('tm_user', JSON.stringify(newState.user));
            break;
        case 'JOIN_EKUB': newState = { ...state, ekubs: state.ekubs.map(e => e.id === action.payload.id ? { ...e, myStatus: 'Active', membersCount: e.membersCount + 1 } : e), user: state.user ? { ...state.user, activeEkubs: [...state.user.activeEkubs, action.payload.id] } : null }; break;
        case 'CREATE_EKUB': newState = { ...state, ekubs: [action.payload, ...state.ekubs], user: state.user ? { ...state.user, activeEkubs: [...state.user.activeEkubs, action.payload.id] } : null }; break;
        case 'CLAIM_DAILY_REWARD': if (!state.user) return state; const bonus = 100 + (state.user.level || 1) * 10; newState = { ...state, user: { ...state.user, walletBalance: state.user.walletBalance + bonus, xp: (state.user.xp || 0) + 50, dailyClaimed: true, streak: (state.user.streak || 0) + 1, transactions: [{ id: `dr-${Date.now()}`, amount: bonus, type: 'Credit', description: 'Daily Reward', date: new Date().toLocaleDateString(), method: 'Wallet', status: 'Completed' }, ...state.user.transactions] } }; if (newState.user) localStorage.setItem('tm_user', JSON.stringify(newState.user)); break;
        case 'CREATE_COURSE': const newCourse = action.payload; const updatedUserCourses = state.user ? { ...state.user, createdCourses: [...(state.user.createdCourses || []), newCourse.id] } : state.user; newState = { ...state, courses: [...state.courses, newCourse], user: updatedUserCourses }; localStorage.setItem('tm_courses', JSON.stringify(newState.courses)); if (newState.user) localStorage.setItem('tm_user', JSON.stringify(newState.user)); break;
        case 'ENROLL_COURSE': if (!state.user) return state; const updatedEnrolled = [...(state.user.enrolledCourses || []), action.payload]; const uniqueEnrolled = [...new Set(updatedEnrolled)]; newState = { ...state, courses: state.courses.map(c => c.id === action.payload ? { ...c, enrolledCount: c.enrolledCount + 1 } : c), user: { ...state.user, enrolledCourses: uniqueEnrolled } }; localStorage.setItem('tm_courses', JSON.stringify(newState.courses)); if (newState.user) localStorage.setItem('tm_user', JSON.stringify(newState.user)); break;
        case 'MARK_NOTIFICATIONS_READ': newState = { ...state, notifications: state.notifications.map(n => ({ ...n, read: true })) }; break;
        case 'VERIFY_USER': newState = { ...state, allUsers: state.allUsers.map(u => u.id === action.payload ? { ...u, isVerified: true } : u), verificationRequests: state.verificationRequests.map(v => v.userId === action.payload ? { ...v, status: 'Approved' } : v), auditLogs: [{ id: `al-${Date.now()}`, adminId: state.user?.id || 'sys', action: 'VERIFY_USER', targetId: action.payload, timestamp: new Date().toISOString(), details: 'User ID verified', ip: '127.0.0.1' }, ...state.auditLogs] }; break;
        case 'BAN_USER': newState = { ...state, allUsers: state.allUsers.map(u => u.id === action.payload ? { ...u, isBanned: !u.isBanned } : u), auditLogs: [{ id: `al-${Date.now()}`, adminId: state.user?.id || 'sys', action: 'BAN_USER', targetId: action.payload, timestamp: new Date().toISOString(), details: 'User ban status toggled', ip: '127.0.0.1' }, ...state.auditLogs] }; break;
        case 'APPROVE_JOB': newState = { ...state, jobs: state.jobs.map(j => j.id === action.payload ? { ...j, status: 'Approved' } : j), auditLogs: [{ id: `al-${Date.now()}`, adminId: state.user?.id || 'sys', action: 'APPROVE_JOB', targetId: action.payload, timestamp: new Date().toISOString(), details: 'Job post approved', ip: '127.0.0.1' }, ...state.auditLogs] }; break;
        case 'REJECT_JOB': newState = { ...state, jobs: state.jobs.filter(j => j.id !== action.payload), auditLogs: [{ id: `al-${Date.now()}`, adminId: state.user?.id || 'sys', action: 'REJECT_JOB', targetId: action.payload, timestamp: new Date().toISOString(), details: 'Job post rejected', ip: '127.0.0.1' }, ...state.auditLogs] }; break;
        case 'RESOLVE_REPORT': newState = { ...state, reports: state.reports.map(r => r.id === action.payload ? { ...r, status: 'Resolved' } : r), auditLogs: [{ id: `al-${Date.now()}`, adminId: state.user?.id || 'sys', action: 'RESOLVE_REPORT', targetId: action.payload, timestamp: new Date().toISOString(), details: 'Report resolved', ip: '127.0.0.1' }, ...state.auditLogs] }; break;
        case 'SEND_MESSAGE':
            const { conversationId, text } = action.payload;
            const sentMsg: Message = { id: `m-${Date.now()}`, senderId: state.user?.id || 'me', text, timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), read: false };
            newState = { ...state, conversations: state.conversations.map(c => c.id === conversationId ? { ...c, lastMessage: text, lastMessageTime: 'Just now', unreadCount: 0, messages: [...c.messages, sentMsg] } : c) };
            break;
        case 'RECEIVE_MESSAGE':
            const { senderId, text: receivedText } = action.payload;
            const receivedMsg: Message = { id: `m-${Date.now()}`, senderId: senderId, text: receivedText, timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), read: false };
            // Find conversation by senderId (either it's the ID or in participants)
            newState = {
                ...state,
                conversations: state.conversations.map(c => {
                    const isPart = c.id === senderId || c.participants.some(p => p.id === senderId);
                    if (isPart) {
                        return {
                            ...c,
                            lastMessage: receivedText,
                            lastMessageTime: 'Just now',
                            unreadCount: c.unreadCount + 1,
                            messages: [...c.messages, receivedMsg]
                        };
                    }
                    return c;
                })
            };
            break;
        case 'SET_JOBS':
            newState = { ...state, jobs: action.payload };
            break;
        case 'SET_EKUBS':
            newState = { ...state, ekubs: action.payload };
            break;
        default: return state;
    }
    return newState;
};
