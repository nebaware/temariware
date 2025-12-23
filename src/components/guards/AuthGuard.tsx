import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { StoreContext } from '../../contexts/StoreContext';

export const AuthGuard: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { state } = useContext(StoreContext);

    if (!state.isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    return <>{children}</>;
};
