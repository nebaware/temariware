import React, { useContext, useState } from 'react';
import { NotificationContext } from '../contexts/NotificationContext';

export const NotificationCenter: React.FC = () => {
    const { notifications, unreadCount, markAsRead, markAllAsRead, clearNotification } = useContext(NotificationContext);
    const [isOpen, setIsOpen] = useState(false);

    const getIcon = (type: string) => {
        switch (type) {
            case 'Job': return 'fa-briefcase text-blue-400';
            case 'Wallet': return 'fa-wallet text-green-400';
            case 'Ekub': return 'fa-users text-yellow-400';
            case 'System': return 'fa-info-circle text-gray-400';
            default: return 'fa-bell text-gray-400';
        }
    };

    return (
        <div className="relative">
            {/* Notification Bell */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="relative p-2 text-gray-400 hover:text-white transition-colors"
            >
                <i className="fas fa-bell text-xl"></i>
                {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center animate-pulse">
                        {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                )}
            </button>

            {/* Dropdown */}
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)}></div>

                    {/* Panel */}
                    <div className="absolute right-0 mt-2 w-80 bg-[#1e293b] border border-white/10 rounded-xl shadow-2xl z-50 overflow-hidden">
                            {/* Header */}
                            <div className="p-4 border-b border-white/10 flex justify-between items-center">
                                <div>
                                    <h3 className="text-white font-bold">Notifications</h3>
                                    <p className="text-xs text-gray-400">{unreadCount} unread</p>
                                </div>
                                {unreadCount > 0 && (
                                    <button
                                        onClick={markAllAsRead}
                                        className="text-xs text-primary hover:underline"
                                    >
                                        Mark all read
                                    </button>
                                )}
                            </div>

                            {/* Notifications List */}
                            <div className="max-h-96 overflow-y-auto">
                                {notifications.length === 0 ? (
                                    <div className="p-8 text-center">
                                        <i className="fas fa-bell-slash text-4xl text-gray-600 mb-2"></i>
                                        <p className="text-gray-400 text-sm">No notifications</p>
                                    </div>
                                ) : (
                                    notifications.map(notification => (
                                        <div
                                            key={notification.id}
                                            className={`p-4 border-b border-white/5 hover:bg-white/5 cursor-pointer transition-colors ${!notification.read ? 'bg-primary/5' : ''}`}
                                            onClick={() => {
                                                markAsRead(notification.id);
                                            }}
                                        >
                                            <div className="flex items-start gap-3">
                                                <div className={`w-10 h-10 rounded-full bg-black/50 flex items-center justify-center flex-shrink-0`}>
                                                    <i className={`fas ${getIcon(notification.type)}`}></i>
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-start justify-between gap-2">
                                                        <h4 className="text-white text-sm font-bold">{notification.title}</h4>
                                                        {!notification.read && (
                                                            <div className="w-2 h-2 bg-primary rounded-full flex-shrink-0"></div>
                                                        )}
                                                    </div>
                                                    <p className="text-xs text-gray-400 line-clamp-2 mt-1">{notification.message}</p>
                                                    <div className="flex items-center justify-between mt-2">
                                                        <span className="text-[10px] text-gray-500">{notification.time}</span>
                                                        <button
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                clearNotification(notification.id);
                                                            }}
                                                            className="text-gray-500 hover:text-red-400 text-xs"
                                                        >
                                                            <i className="fas fa-times"></i>
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>

                            {/* Footer */}
                            {notifications.length > 0 && (
                                <div className="p-3 border-t border-white/10 text-center">
                                    <button className="text-xs text-gray-400 hover:text-primary">
                                        View All Notifications
                                    </button>
                                </div>
                            )}
                        </div>
                    </>
                )}
        </div>
    );
};
