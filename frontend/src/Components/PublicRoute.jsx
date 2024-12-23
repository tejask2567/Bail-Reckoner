// src/components/PublicRoute.jsx
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from "./context/AuthContext"

const PublicRoute = ({ children }) => {
  const { isAuthenticated, user } = useAuth();
  const location = useLocation();

  // If user is authenticated, redirect them to their role-specific dashboard
  if (isAuthenticated) {
    const roleRedirects = {
      user: '/dashboard',
      lawyer: '/lawyer-dashboard',
      judge: '/judge-dashboard',
      police: '/police-dashboard'
    };

    const redirectPath = roleRedirects[user.role] || '/';
    return <Navigate to={redirectPath} replace />;
  }

  return children;
};

export default PublicRoute;