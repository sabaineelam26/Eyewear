import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const AdminAuthContext = createContext();

// Create a separate API instance for Admin to avoid overriding customer token
export const adminApi = axios.create({
    baseURL: 'http://localhost:5000/api',
    headers: { 'Content-Type': 'application/json' }
});

adminApi.interceptors.request.use((config) => {
    const adminInfo = localStorage.getItem('adminInfo');
    if (adminInfo) {
        const { token } = JSON.parse(adminInfo);
        if (token) config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, (error) => Promise.reject(error));

export const AdminAuthProvider = ({ children }) => {
    const [admin, setAdmin] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const adminInfo = localStorage.getItem('adminInfo');
        if (adminInfo) {
            setAdmin(JSON.parse(adminInfo));
        }
        setLoading(false);
    }, []);

    const loginAdmin = async (email, password) => {
        try {
            const { data } = await adminApi.post('/admin/login', { email, password });
            if (data.success) {
                const adminData = {
                    _id: data.data._id,
                    name: data.data.name,
                    email: data.data.email,
                    role: data.data.role,
                    token: data.token
                };
                localStorage.setItem('adminInfo', JSON.stringify(adminData));
                setAdmin(adminData);
                return { success: true };
            }
        } catch (error) {
            return { success: false, message: error.response?.data?.message || 'Login failed' };
        }
    };

    const logoutAdmin = () => {
        localStorage.removeItem('adminInfo');
        setAdmin(null);
    };

    return (
        <AdminAuthContext.Provider value={{ admin, loading, loginAdmin, logoutAdmin }}>
            {children}
        </AdminAuthContext.Provider>
    );
};
