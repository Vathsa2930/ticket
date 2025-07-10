import React, { createContext, useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

const AuthContext = createContext();

export default AuthContext;

export const AuthProvider = ({ children }) => {
    const [authTokens, setAuthTokens] = useState(() => localStorage.getItem('authTokens') ? JSON.parse(localStorage.getItem('authTokens')) : null);
    const [user, setUser] = useState(() => localStorage.getItem('authTokens') ? jwtDecode(JSON.parse(localStorage.getItem('authTokens')).access) : null);
    const [loading, setLoading] = useState(true);

    const navigate = useNavigate();

    const loginUser = async (e) => {
        e.preventDefault();
        try {
            const response = await api.post('token/', {
                username: e.target.username.value,
                password: e.target.password.value
            });
            const data = response.data;
            setAuthTokens(data);
            setUser(jwtDecode(data.access));
            localStorage.setItem('authTokens', JSON.stringify(data));
            navigate('/');
        } catch (error) {
            alert('Something went wrong!');
        }
    };

    const registerUser = async (e) => {
        e.preventDefault();
        try {
            await api.post('users/register/', {
                username: e.target.username.value,
                password: e.target.password.value,
                email: e.target.email.value,
                is_customer: true
            });
            navigate('/login');
        } catch (error) {
            if (error.response && error.response.data) {
                // Extract and display the specific error message from the backend
                const errorData = error.response.data;
                const errorMessage = Object.keys(errorData).map(key => `${key}: ${errorData[key].join(', ')}`).join('\n');
                alert(errorMessage);
            } else {
                alert('Something went wrong! Please check your connection and try again.');
            }
        }
    };

    const logoutUser = () => {
        setAuthTokens(null);
        setUser(null);
        localStorage.removeItem('authTokens');
        navigate('/login');
    };

    useEffect(() => {
        if (authTokens) {
            setUser(jwtDecode(authTokens.access));
        }
        setLoading(false);
    }, [authTokens]);

    const contextData = {
        user: user,
        authTokens: authTokens,
        loginUser: loginUser,
        logoutUser: logoutUser,
        registerUser: registerUser,
    };

    return (
        <AuthContext.Provider value={contextData}>
            {loading ? null : children}
        </AuthContext.Provider>
    );
};
