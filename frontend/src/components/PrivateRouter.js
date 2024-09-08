import React from 'react';
import { Outlet, Navigate } from 'react-router-dom';

const PrivateRouter = () => {
  // Check if the token is present in sessionStorage or localStorage
  const token = sessionStorage.getItem('session') || localStorage.getItem('token');

  // Redirect to login if not authenticated
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // Render the child routes if authenticated
  return <Outlet />;
};

export default PrivateRouter;
