import { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

export function AuthProvider({ children }){
    const [token, setToken] = useState(() => localStorage.getItem('token') || '');
    const [user, setUser] = useState(null); // Placeholder for user details

    const login = (token) => {
        localStorage.setItem('token', token);
        setToken(token);
    }

    const logout = () => {
        localStorage.removeItem('token');
        setToken('');
        setUser(null);
    };

    const isLoggedIn = !!token;

    return (
        <AuthContext.Provider value={{ token, login, logout, isLoggedIn, user }}>
            {children}
        </AuthContext.Provider>
    );
}