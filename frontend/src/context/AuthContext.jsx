import React, { createContext, useState, useEffect } from 'react';
import api from '../services/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const userInfo = localStorage.getItem('userInfo');
        if (userInfo) {
            setUser(JSON.parse(userInfo));
        }
        setLoading(false);
    }, []);

    const login = async (email, password) => {
        try {
            const { data } = await api.post('/auth/login', { email, password });
            if (data.success) {
                const userData = {
                    _id: data._id,
                    name: data.name,
                    email: data.email,
                    role: data.role,
                    token: data.token
                };
                localStorage.setItem('userInfo', JSON.stringify(userData));
                setUser(userData);
                return { success: true };
            }
        } catch (error) {
            return { 
                success: false, 
                message: error.response?.data?.message || 'Login failed' 
            };
        }
    };

    const register = async (name, email, password, phone) => {
        try {
            const { data } = await api.post('/auth/register', { name, email, password, phone });
            if (data.success) {
                const userData = {
                    _id: data._id,
                    name: data.name,
                    email: data.email,
                    role: data.role,
                    token: data.token
                };
                localStorage.setItem('userInfo', JSON.stringify(userData));
                setUser(userData);
                return { success: true };
            }
        } catch (error) {
            return { 
                success: false, 
                message: error.response?.data?.message || 'Registration failed' 
            };
        }
    };

    const logout = () => {
        localStorage.removeItem('userInfo');
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, register, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => React.useContext(AuthContext);
