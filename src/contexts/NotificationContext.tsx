import React, { createContext, useState, useEffect, ReactNode, useContext } from 'react';
import type { Notification } from '../types';
import { StoreContext } from './StoreContext';

interface NotificationContextType {
    notifications: Notification[];
    unreadCount: number;
    addNotification: (notification: Omit<Notification, 'id' | 'read'>) => void;
    markAsRead: (id: string) => void;
    markAllAsRead: () => void;
    clearNotification: (id: string) => void;
}

export const NotificationContext = createContext<NotificationContextType>({
    notifications: [],
    unreadCount: 0,
    addNotification: () => { },
    markAsRead: () => { },
    markAllAsRead: () => { },
    clearNotification: () => { }
});

export const NotificationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const { state } = useContext(StoreContext);
    const [notifications, setNotifications] = useState<Notification[]>(() => {
        const saved = localStorage.getItem('tm_notifications');
        return saved ? JSON.parse(saved) : [];
    });

    const unreadCount = notifications.filter(n => !n.read).length;

    useEffect(() => {
        localStorage.setItem('tm_notifications', JSON.stringify(notifications));
    }, [notifications]);

    // Mock Socket.io Real-Time Listeners (disabled to prevent errors)
    useEffect(() => {
        if (!state.isAuthenticated) return;

        // Mock implementation - no actual socket listeners
        // All socket functionality disabled to prevent errors

        return () => {
            // Mock cleanup
        };
    }, [state.isAuthenticated]);

    const addNotification = (notification: Omit<Notification, 'id' | 'read'>) => {
        const newNotification: Notification = {
            ...notification,
            id: Date.now().toString(),
            read: false
        };
        setNotifications(prev => [newNotification, ...prev].slice(0, 50)); // Keep last 50
    };

    const markAsRead = (id: string) => {
        setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
    };

    const markAllAsRead = () => {
        setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    };

    const clearNotification = (id: string) => {
        setNotifications(prev => prev.filter(n => n.id !== id));
    };

    return (
        <NotificationContext.Provider value={{
            notifications,
            unreadCount,
            addNotification,
            markAsRead,
            markAllAsRead,
            clearNotification
        }}>
            {children}
        </NotificationContext.Provider>
    );
};
