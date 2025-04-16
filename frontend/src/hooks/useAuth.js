import { useState, useEffect } from 'react';
import authService from '../services/authService';

const useAuth = () => {
    const [user, setUser ] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Function to log in the user
    const login = async (email, password) => {
        try {
            const response = await authService.login(email, password);
            setUser (response.user); // Assuming the response contains user data
        } catch (err) {
            setError(err.message);
        }
    };

    // Function to log out the user
    const logout = () => {
        authService.logout();
        setUser (null);
    };

    // Function to check if the user is authenticated
    const isAuthenticated = () => {
        return authService.isAuthenticated();
    };

    // Function to get the current user
    const getCurrentUser  = async () => {
        try {
            const currentUser  = await authService.getCurrentUser ();
            setUser (currentUser );
        } catch (err) {
            setError(err.message);
        }
    };

    // Effect to check authentication status on mount
    useEffect(() => {
        const checkAuth = async () => {
            if (isAuthenticated()) {
                await getCurrentUser ();
            }
            setLoading(false);
        };

        checkAuth();
    }, []);

    return {
        user,
        loading,
        error,
        login,
        logout,
        isAuthenticated,
    };
};

export default useAuth;
