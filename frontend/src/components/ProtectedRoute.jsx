import React, { useContext } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const ProtectedRoute = () => {
    const { user, loading } = useContext(AuthContext);
    const location = useLocation();

    if (loading) {
        return <div className="loading-spinner">Loading...</div>;
    }

    return user ? <Outlet /> : <Navigate to={`/login?redirect=${location.pathname}`} replace />;
};

export default ProtectedRoute;
