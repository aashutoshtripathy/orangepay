// PrivateRoute.js
import React, { useContext } from 'react';
import { Outlet, Navigate } from 'react-router-dom';
// import { AuthContext } from './AuthContext';
// import { AuthContext } from './AuthContext';

const PrivateRouter = () => {
  // const {isAuthenticated} = useContext(AuthContext);
  return (
    isAuthenticated ? <Outlet/> : <Navigate to={`/`}/>
  );
};

export default PrivateRouter;