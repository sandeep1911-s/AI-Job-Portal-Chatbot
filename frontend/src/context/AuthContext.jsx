import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export function useAuth() {
    return useContext(AuthContext);
}

export function AuthProvider({ children }) {
    const [token, setToken] = useState(localStorage.getItem('token'));
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            try {
                setUser(JSON.parse(storedUser));
            } catch (e) {
                localStorage.removeItem('user');
            }
        }
        setLoading(false);
    }, []);

    const login = (authData) => {
        localStorage.setItem('token', authData.access_token);
        const userData = {
            id: authData.user_id,
            username: authData.username,
            role: authData.role,
            is_approved: authData.is_approved,
        };
        localStorage.setItem('user', JSON.stringify(userData));
        setToken(authData.access_token);
        setUser(userData);
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setToken(null);
        setUser(null);
    };

    const isUser = user?.role === 'user';
    const isProvider = user?.role === 'provider';
    const isAdmin = user?.role === 'admin';

    const value = {
        token, user, loading, login, logout,
        isUser, isProvider, isAdmin,
        userId: user?.id,
        role: user?.role,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
