import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { StoreContext } from '../../contexts/StoreContext';
import { ToastContext } from '../../contexts/ToastContext';

export const TopHeader: React.FC<{ title: string }> = ({ title }) => {
    const { dispatch } = useContext(StoreContext);
    const { addToast } = useContext(ToastContext);
    const navigate = useNavigate();

    const handleLogout = () => {
        if (window.confirm('Are you sure you want to logout?')) {
            // Clear all authentication data
            dispatch({ type: 'LOGOUT' });
            addToast('Logged out successfully', 'success');
            navigate('/login');
        }
    };

    return (
        <div className="flex justify-between items-center p-4 bg-[#0a0f1e] border-b border-white/10">
            <h1 className="text-xl font-bold text-white">{title}</h1>
            <button
                onClick={handleLogout}
                className="text-gray-400 hover:text-red-500 transition-colors group"
                title="Logout"
            >
                <i className="fas fa-sign-out-alt group-hover:scale-110 transition-transform"></i>
            </button>
        </div>
    );
};
