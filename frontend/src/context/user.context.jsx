import React, { createContext, useState, useEffect } from 'react';
import axios from '../config/axios';

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem('token');

        if (token) {
            axios.get('/users/me', {
                headers: { Authorization: `Bearer ${token}` }
            })
            .then((res) => {
                setUser(res.data); // Save user details
                localStorage.setItem('user', JSON.stringify(res.data)); // Store user in localStorage
            })
            .catch(() => {
                localStorage.removeItem('token'); // Remove invalid token
                localStorage.removeItem('user'); // Remove stored user
                setUser(null);
            });
        } else {
            const storedUser = localStorage.getItem('user');
            if (storedUser) {
                setUser(JSON.parse(storedUser)); // Restore user from localStorage
            }
        }
    }, []);

    return (
        <UserContext.Provider value={{ user, setUser }}>
            {children}
        </UserContext.Provider>
    );
};
