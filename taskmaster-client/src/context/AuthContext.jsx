/**
 * AuthContext: Provides authentication state and functions (login, logout)
 * to the entire React app using React Context.
 */
import { createContext, useState } from 'react';

// Create a new context object to share auth state across components
export const AuthContext = createContext();

/**
 * AuthProvider which wraps around the app to provide auth-related data and actions.
 * @param {React.ReactNode} props.children - The nested components that will consume the context
 * @returns {JSX.Element} Auth context provider wrapping the children
 */
export function AuthProvider({ children }){
    const [token, setToken] = useState(() => localStorage.getItem('token') || '');
    const [user, setUser] = useState(null); // Placeholder for user details

    /**
     * Login function: saves token to both state and localStorage
     * @param {string} token - The JWT token returned after successful login
     */
    const login = (token) => {
        localStorage.setItem('token', token);
        setToken(token);
    }

    /**
     * Logout function: removes token and user info
     */
    const logout = () => {
        localStorage.removeItem('token');
        setToken('');
        setUser(null);
    };

    const isLoggedIn = !!token;

    // Provide these values to all nested components
    return (
        <AuthContext.Provider value={{ token, login, logout, isLoggedIn, user }}>
            {children}
        </AuthContext.Provider>
    );
}