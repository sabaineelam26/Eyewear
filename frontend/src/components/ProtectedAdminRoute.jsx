import React, { useContext } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { AdminAuthContext } from '../context/AdminAuthContext';

const ProtectedAdminRoute = () => {
    const { admin, loading } = useContext(AdminAuthContext);

    if (loading) return <div className="loading-spinner">Loading admin...</div>;

    return admin && admin.role === 'admin' ? <Outlet /> : <Navigate to="/admin/login" replace />;
};

export default ProtectedAdminRoute;
