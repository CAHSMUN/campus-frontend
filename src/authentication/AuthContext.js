import React, { useContext, createContext, useState } from 'react';
import jwt from 'jsonwebtoken';

const AuthContext = createContext();

export function useAuthContext() {
    return useContext(AuthContext);
}

export function AuthProvider({ children }) {

    const [currentUser, setCurrentUser] = useState(sessionStorage.getItem('token'));

    function updateCurrentUser(userToken) {
        setCurrentUser(userToken);
        if(userToken === '') {
            // delete session token (logged out)
            sessionStorage.removeItem('token');
        } else {
            // store user (logged in)
            sessionStorage.setItem('token', userToken);
        }
    }

    function getUserData() {
        const decoded = jwt.decode(String(currentUser));
        return decoded;
    }

    function logOut() {
        return sessionStorage.removeItem('token');
    }

    const value = {
        updateCurrentUser,
        getUserData,
        logOut,
        currentUser
    }

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    )
}