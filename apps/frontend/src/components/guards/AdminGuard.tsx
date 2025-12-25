import React, { useContext } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { StoreContext } from '../../contexts/StoreContext';
import { UserRole, AdminRole } from '../../types';

export const AdminGuard: React.FC<{ children: React.ReactNode, roles?: AdminRole[] }> = ({ children, roles }) => {
    const { state } = useContext(StoreContext);
    const location = useLocation();
    if (!state.isAuthenticated || state.user?.role !== UserRole.ADMIN) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }
    if (roles && state.user.adminRole && !roles.includes(state.user.adminRole)) {
        return <div className="p-8 text-center text-red-500">Access Denied: Insufficient Permissions</div>;
    }
    return <>{children}</>;
};
