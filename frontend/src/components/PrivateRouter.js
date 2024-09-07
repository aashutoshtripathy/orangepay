// PrivateRouter.js
import React from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import Cookies from 'js-cookie';



// utils/cookies.js

export const getCookie = (name) => {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
};


const PrivateRouter = () => {
  // Check if the token is present in localStorage
  // const token = getCookie('accessToken');
  const token = sessionStorage.getItem('session');
  // const token = Cookies.get('accessToken');
  // console.log('Token from cookie:', token);



  
  // If there's no token, redirect to the login page
  if (!token) {
    return <Navigate to="/login" replace/>;
  }

  // Render the child routes if authenticated
  return <Outlet />;
};

export default PrivateRouter;
