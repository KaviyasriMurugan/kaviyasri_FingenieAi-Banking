import React, { createContext, useState,
    useContext, useEffect } from 'react';
import { authAPI } from '../services/api';
 
const AuthContext = createContext();
 
export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
 
    useEffect(() => {
        const token = localStorage.getItem('token');
        const userData = localStorage.getItem('user');
        if (token && userData) {
            setUser(JSON.parse(userData));
        }
        setLoading(false);
    }, []);
 
    const login = async (email, password) => {
        const response = await authAPI.login({ email, password });
        const { token, ...userData } = response.data;
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(userData));
        setUser(userData);
        return userData;
    };
 
    const register = async (email, password, fullName) => {
        const response = await authAPI.register({
            email, password, fullName
        });
        const { token, ...userData } = response.data;
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(userData));
        setUser(userData);
        return userData;
    };
 
    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
    };
 
    return (
        <AuthContext.Provider value={{
            user, login, register, logout, loading
        }}>
            {children}s
        </AuthContext.Provider>
    );
};
 
export const useAuth = () => useContext(AuthContext);
 