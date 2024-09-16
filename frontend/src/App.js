import React, { Suspense, useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { CSpinner, useColorModes } from '@coreui/react';
import './scss/style.scss';
import PrivateRouter from './components/PrivateRouter';
import routes from './routes'; // Import routes

// Lazily load the components
const DefaultLayout = React.lazy(() => import('./layout/DefaultLayout'));
const Login = React.lazy(() => import('./views/pages/login/Login'));
const Register = React.lazy(() => import('./views/pages/register/Register'));
const ForgetPassword = React.lazy(() => import('./views/pages/forgetpasswword/ForgetPassword'));
const Page404 = React.lazy(() => import('./views/pages/page404/Page404'));
const Page500 = React.lazy(() => import('./views/pages/page500/Page500'));

const App = () => {
  const { isColorModeSet, setColorMode } = useColorModes('coreui-free-react-admin-template-theme');
  const storedTheme = useSelector((state) => state.theme);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const userId = localStorage.getItem('userId');


  useEffect(() => {
    // Check for authentication status
    const token = localStorage.getItem('token');
    const expirationTime = localStorage.getItem('expirationTime');
    if (token && expirationTime && new Date().getTime() < expirationTime) {
      setIsAuthenticated(true); // User is authenticated
    } else {
      setIsAuthenticated(false); // Token is expired or not found
      localStorage.clear(); // Clear all storage on session expiry
    }

    // Set color theme
    const urlParams = new URLSearchParams(window.location.href.split('?')[1]);
    const theme = urlParams.get('theme') && urlParams.get('theme').match(/^[A-Za-z0-9\s]+/)[0];
    if (theme) {
      setColorMode(theme);
    }

    if (!isColorModeSet()) {
      setColorMode(storedTheme);
    }
  }, [setColorMode, storedTheme]);

  return (
    <Router>
      <Suspense
        fallback={
          <div className="pt-3 text-center">
            <CSpinner color="primary" variant="grow" />
          </div>
        }
      >
        <Routes>
          {/* Public Routes */}
          {!isAuthenticated ? (
            <>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/forgetpassword" element={<ForgetPassword />} />
            </>
          ) : (
            <>
              {/* Redirect to Dashboard if already authenticated */}
              <Route path="/login" element={<Navigate to={`/dashboard/${userId}`} />} />
              <Route path="/register" element={<Navigate to={`/dashboard/${userId}`} />} />
              <Route path="/forgetpassword" element={<Navigate to={`/dashboard/${userId}`} />} />
            </>
          )}

          {/* Protected Routes */}
          <Route element={<PrivateRouter isAuthenticated={isAuthenticated} />}>
            <Route path="/" element={<DefaultLayout />}>
              {routes.map((route, idx) => (
                <Route
                  key={idx}
                  path={route.path}
                  element={<route.element />}
                />
              ))}
            </Route>
          </Route>

          {/* Default Fallback Route */}
          <Route path="*" element={<Login />} />
        </Routes>
      </Suspense>
    </Router>
  );
};

export default App;
