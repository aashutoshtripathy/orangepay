import React, { Suspense, useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { CSpinner, useColorModes } from '@coreui/react';
import './scss/style.scss';
import PrivateRouter from './components/PrivateRouter';
import routes from './routes'; 

const DefaultLayout = React.lazy(() => import('./layout/DefaultLayout'));
const Login = React.lazy(() => import('./views/pages/login/Login'));
const Register = React.lazy(() => import('./views/pages/register/Register'));
const ForgetPassword = React.lazy(() => import('./views/pages/forgetpasswword/ForgetPassword'));
// const Page404 = React.lazy(() => import('./views/pages/page404/Page404'));
// const Page500 = React.lazy(() => import('./views/pages/page500/Page500'));

const App = () => {
  const { isColorModeSet, setColorMode } = useColorModes('coreui-free-react-admin-template-theme');
  const storedTheme = useSelector((state) => state.theme);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const userId = localStorage.getItem('userId');
  const navigate = useNavigate();

  const getCookie = (name) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
};


const sessionCookie = getCookie('sessionID'); 



  useEffect(() => {
    const token = localStorage.getItem('token');
    const expirationTime = localStorage.getItem('expirationTime');
    if (token && expirationTime && new Date().getTime() < expirationTime ) {
      setIsAuthenticated(true); 
    } else {
      setIsAuthenticated(false); 
      localStorage.clear(); 
      navigate('/login');
    }

    const urlParams = new URLSearchParams(window.location.href.split('?')[1]);
    const theme = urlParams.get('theme') && urlParams.get('theme').match(/^[A-Za-z0-9\s]+/)[0];
    if (theme) {
      setColorMode(theme);
    }

    if (!isColorModeSet()) {
      setColorMode(storedTheme);
    }
  }, [setColorMode, storedTheme, navigate]);

  return (
    // <Router>
      <Suspense
        fallback={
          <div className="pt-3 text-center">
            <CSpinner color="primary" variant="grow" />
          </div>
        }
      >
        <Routes>
          {!isAuthenticated ? (
            <>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/forgetpassword" element={<ForgetPassword />} />
            </>
          ) : (
            <>
              <Route path="/login" element={<Navigate to={`/dashboard/${userId}`} />} />
              <Route path="/register" element={<Navigate to={`/dashboard/${userId}`} />} />
              <Route path="/forgetpassword" element={<Navigate to={`/dashboard/${userId}`} />} />
            </>
          )}

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

          <Route path="*" element={<Login />} />
        </Routes>
      </Suspense>
  );
};

export default App;
