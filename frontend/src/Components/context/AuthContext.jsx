// src/context/AuthContext.jsx
import React from 'react';
import axiosInstance from "../../api/axios"

const AuthContext = React.createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = React.useState(() => {
    // Check if user data exists in localStorage on initial load
    const userRole = localStorage.getItem('userRole');
    const accessToken = localStorage.getItem('accessToken');
    if (userRole && accessToken) {
      return { role: userRole };
    }
    return null;
  });

  const login = (userData, tokens) => {
    setUser(userData);
    localStorage.setItem('accessToken', tokens.access_token);
    localStorage.setItem('refreshToken', tokens.refresh_token);
    localStorage.setItem('userRole', userData.role);
    axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${tokens.access_token}`;
  };

  const logout = () => {
    setUser(null);
    localStorage.clear();
    delete axiosInstance.defaults.headers.common['Authorization'];
  };

  const value = {
    user,
    login,
    logout,
    isAuthenticated: !!user
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = React.useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};