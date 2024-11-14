import React, { Suspense, useEffect, useState , startTransition } from 'react';
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
  const [loading, setLoading] = useState(true);

  const userId = localStorage.getItem('userId');
  const navigate = useNavigate();

  const getCookie = (name) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
};


const sessionCookie = getCookie('sessionID'); 


const handleLogout = () => {
  setIsAuthenticated(false);
  localStorage.clear();
  sessionStorage.clear();
  document.cookie = "sessionID=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
  document.cookie = "auth_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
  navigate('/login', { replace: true });
};



useEffect(() => {
  const token = localStorage.getItem('token');
  const expirationTime = localStorage.getItem('expirationTime');

  if (token && expirationTime && new Date().getTime() < expirationTime) {
    // If the token is valid and not expired, set isAuthenticated to true
    // startTransition(() => {
      setIsAuthenticated(true);
    // });
  } else {
    // If the token is invalid or expired, logout the user
    handleLogout();
  }

  // Set color mode from URL or stored theme
  const urlParams = new URLSearchParams(window.location.href.split('?')[1]);
  const theme = urlParams.get('theme') && urlParams.get('theme').match(/^[A-Za-z0-9\s]+/)[0];
  if (theme) {
    setColorMode(theme);
  }

  if (!isColorModeSet()) {
    setColorMode(storedTheme);
  }

  // Set loading to false after checking authentication
  setLoading(false);
}, [setColorMode, storedTheme]);





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
        {/* {!isAuthenticated ? (
          <> */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgetpassword" element={<ForgetPassword />} />
          {/* </>
        ) : (
          <>
            <Route path="/login" element={<Navigate to={`/dashboard/${userId}`} />} />
            <Route path="/register" element={<Navigate to={`/dashboard/${userId}`} />} />
            <Route path="/forgetpassword" element={<Navigate to={`/dashboard/${userId}`} />} />
          </> */}
        {/* )} */}

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
      // </Router>
  );
};

export default App;
