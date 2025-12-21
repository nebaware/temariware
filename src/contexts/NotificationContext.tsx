import React, { createContext, useState, useEffect, ReactNode, useContext } from 'react';
import type { Notification } from '../types';
import { socketService } from '../services/socket';
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

    // Socket.io Real-Time Listeners
    useEffect(() => {
        if (!state.isAuthenticated) return;

        // Job application updates
        socketService.on('job:application:update', (data: any) => {
            addNotification({
                type: 'Job',
                title: 'Application Update',
                message: `Your application for "${data.jobTitle}" is now ${data.status}`,
                time: new Date().toLocaleTimeString()
            });
        });

        // Ekub payout announcements
        socketService.on('ekub:payout', (data: any) => {
            addNotification({
                type: 'Ekub',
                title: '🎉 Ekub Payout!',
                message: `${data.winnerName} won ${data.amount} ETB in "${data.ekubName}"`,
                time: new Date().toLocaleTimeString()
            });
        });

        // New messages
        socketService.on('message:new', (data: any) => {
            addNotification({
                type: 'System',
                title: 'New Message',
                message: `${data.senderName}: ${data.preview}`,
                time: new Date().toLocaleTimeString()
            });
        });

        // Wallet transactions
        socketService.on('wallet:transaction', (data: any) => {
            addNotification({
                type: 'Wallet',
                title: 'Transaction Complete',
                message: `${data.type}: ${data.amount} ETB`,
                time: new Date().toLocaleTimeString()
            });
        });

        // Browser notifications (if permitted)
        if ('Notification' in window && Notification.permission === 'default') {
            Notification.requestPermission();
        }

        return () => {
            socketService.off('job:application:update');
            socketService.off('ekub:payout');
            socketService.off('message:new');
            socketService.off('wallet:transaction');
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
