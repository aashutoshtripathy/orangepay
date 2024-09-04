// PrivateRouter.js
import React from 'react';
import { Outlet, Navigate } from 'react-router-dom';

const PrivateRouter = () => {
  // Check if the token is present in localStorage
  const token = localStorage.getItem('token');
  
  // If there's no token, redirect to the login page
  if (!token) {
    return <Navigate to="/login" replace/>;
  }

  // Render the child routes if authenticated
  return <Outlet />;
};

export default PrivateRouter;
