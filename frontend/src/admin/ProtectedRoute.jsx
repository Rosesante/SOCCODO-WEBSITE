import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  const accessToken = sessionStorage.getItem('access_token');

  if (!accessToken) {
    return <Navigate to="/admin/login" replace />;
  }

  return children;
};

export default ProtectedRoute;