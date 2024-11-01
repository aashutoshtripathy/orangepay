import React from 'react';
import { Outlet, Navigate } from 'react-router-dom';

const PrivateRouter = () => {
  const token = sessionStorage.getItem('session') || localStorage.getItem('token');

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

export default PrivateRouter;
