import React, { Suspense, useEffect , useState } from 'react'
import { HashRouter, Route, BrowserRouter as Router, Routes } from 'react-router-dom'
import { useSelector } from 'react-redux'

import { CSpinner, useColorModes } from '@coreui/react'
import './scss/style.scss'
import Dashboard from './views/dashboard/Dashboard'
import ForgetPassword from './views/pages/forgetpasswword/ForgetPassword'
import routes from './routes'
import PrivateRouter from './components/PrivateRouter'

// Containers
const DefaultLayout = React.lazy(() => import('./layout/DefaultLayout'))

// Pages
const Login = React.lazy(() => import('./views/pages/login/Login'))
const Profile = React.lazy(() => import('./views/pages/profile/Profile'))
const Register = React.lazy(() => import('./views/pages/register/Register'))
const Page404 = React.lazy(() => import('./views/pages/page404/Page404'))
const Page500 = React.lazy(() => import('./views/pages/page500/Page500'))

const App = () => {
  const { isColorModeSet, setColorMode } = useColorModes('coreui-free-react-admin-template-theme')
  const storedTheme = useSelector((state) => state.theme)
  const [isAuthenticated, setIsAuthenticated] = useState(false);


  useEffect(() => {

    const token = localStorage.getItem('token');
    const expirationTime = localStorage.getItem('expirationTime');
    if (token && expirationTime && new Date().getTime() < expirationTime) {
      setIsAuthenticated(true);  // User is authenticated
    } else {
      // Token is expired or not found
      setIsAuthenticated(false);
      localStorage.clear()  // Clear all storage on session expiry
    }
    



    const urlParams = new URLSearchParams(window.location.href.split('?')[1])
    const theme = urlParams.get('theme') && urlParams.get('theme').match(/^[A-Za-z0-9\s]+/)[0]
    if (theme) {
      setColorMode(theme)
    }


    if (isColorModeSet()) {
      return
    }

    setColorMode(storedTheme)

    
  }, [setIsAuthenticated]) // eslint-disable-line react-hooks/exhaustive-deps

  // useEffect(() => {
  //   // Check if a token exists in localStorage
  //   const token = localStorage.getItem('token');
  //   if (token) {
  //     setIsAuthenticated(true);
  //   }
  // }, []);


  // const isAuthenticated = true;

  return (
    // <HashRouter>
    <Router>
      <Suspense
        fallback={
          <div className="pt-3 text-center">
            <CSpinner color="primary" variant="grow" />
          </div>
        }
      >

        <Routes>
          {/* Dynamically render routes from router.js */}
          {/* <Route exact path="/" name="Login Page" element={<Login />} />
          <Route exact path="/login" name="Login Page" element={<Login />} />
          <Route exact path="/register" name="Register Page" element={<Register />} />
          <Route exact path="/forgetpassword" name="Register Page" element={<ForgetPassword />} /> */}
           {!isAuthenticated && (
            <>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/forgetpassword" element={<ForgetPassword />} />
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
          {/* Add a default route or fallback to handle non-matching routes */}
          <Route path="*" element={<Login />} />
        {/* </Routes> */}
        {/* <Routes> */}
          {/* <Route exact path="/" name="Login Page" element={<Login />} />
          <Route exact path="/login" name="Login Page" element={<Login />} />
          <Route exact path="/register" name="Register Page" element={<Register />} />
          <Route exact path="/forgetpassword" name="Register Page" element={<ForgetPassword />} /> */}
          {/* <Route exact path="/dashboard/:id" name="Register Page" element={<Dashboard />} /> */}
          {/* <Route exact path="/profile/:userId" name="Profile Page" element={<Profile/>} /> */}
          {/* <Route exact path="/404" name="Page 404" element={<Page404 />} />
          <Route exact path="/500" name="Page 500" element={<Page500 />} /> */}
          {/* <Route path="*" name="Home" element={<DefaultLayout />} /> */}
          {/* <Route path="*" name="Home" element={<Login />} /> */}
          {/* </Route> */}
        </Routes>
      </Suspense>
    </Router>
    //  </HashRouter> 
  )
}

export default App
