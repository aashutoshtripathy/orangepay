  import React, { useState } from 'react'
  import { Link, useNavigate } from 'react-router-dom'
  import {
    CButton,
    CCard,
    CCardBody,
    CCardGroup,
    CCol,
    CContainer,
    CForm,
    CFormInput,
    CInputGroup,
    CInputGroupText,
    CRow,
  } from '@coreui/react'
  import CIcon from '@coreui/icons-react'
  import { cilLockLocked, cilUser } from '@coreui/icons'
  import axios from "axios"

  const Login = () => {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [usernameError, setUsernameError] = useState(null)
    const [passwordError, setPasswordError] = useState(null)
    const [generalError, setGeneralError] = useState(null)
    const [user, setUser] = useState(null); // Store user data


    const navigate = useNavigate();

    const handleSubmit = async (e) => {
      e.preventDefault()

      // Reset errors
      setUsernameError(null)
      setPasswordError(null)
      setGeneralError(null)

      // Form validation
      let valid = true;

      if (!username) {
        setUsernameError("Username is required.")
        valid = false;
      }

      if (!password) {
        setPasswordError("Password is required.")
        valid = false;
      }

      if (!valid) return;

      try {
        const response = await axios.post('/login', {
          username,
          password,
        }, { withCredentials: true })  

        // const { user } = response.data.data;
        // const { id } = user;
        
        const { token, user , session } = response.data.data;


        const expirationTime = new Date().getTime() + 60 * 60 * 1000; // 1 hour from now


        // Save token and user data in localStorage
        localStorage.setItem('token', token);
        // localStorage.setItem('session', JSON.stringify(data.session));
        // console.log('Login Successful:', data);
        // sessionStorage.setItem('session', JSON.stringify(session));
        sessionStorage.setItem('session',session)


        // localStorage.setItem('userId', user.id)

        // Save user info in localStorage
        localStorage.setItem('username', username);
        localStorage.setItem('userId', user.id);

        localStorage.setItem('expirationTime', expirationTime);


        // Redirect to the dashboard
        navigate(`/dashboard/${user.id}`);
        // navigate(`/dashboard/${id}`);

      } catch (err) {

        if (err.response && err.response.data && err.response.data.message) {
          setGeneralError(err.response.data.message); // Set the error message from API response
        } else {
          setGeneralError("Login failed: Something went wrong");
        }
      }
    }

    const handleUsernameChange = (e) => {
      setUsername(e.target.value);
      if (e.target.value) {
        setUsernameError(null); // Clear the error as the user types
      }
    }

    const handlePasswordChange = (e) => {
      setPassword(e.target.value);
      if (e.target.value) {
        setPasswordError(null); // Clear the error as the user types
      }
    }

    const handlePassword = () => {
      navigate('/forgetpassword')
    }

    return (
      <div className="bg-body-tertiary min-vh-100 d-flex flex-row align-items-center">
        <CContainer>
          <CRow className="justify-content-center">
            <CCol md={8}>
              <CCardGroup>
                <CCard className="p-4">
                  <CCardBody>
                    <CForm onSubmit={handleSubmit}>
                      <h1>Login</h1>
                      <p className="text-body-secondary">Sign In to your account</p>

                      {/* General error message */}
                      {generalError && <p style={{ color: 'red' }}>{generalError}</p>}

                      {/* Username input */}
                      <CInputGroup className="mb-3">
                        <CInputGroupText>
                          <CIcon icon={cilUser} />
                        </CInputGroupText>
                        <CFormInput
                          placeholder="Username"
                          autoComplete="username"
                          value={username}
                          onChange={handleUsernameChange}
                          onFocus={() => setUsernameError(null)} // Clear error on focus
                        />
                      </CInputGroup>
                      {usernameError && <p style={{ color: 'red', marginTop: '-15px' }}>{usernameError}</p>}

                      {/* Password input */}
                      <CInputGroup className="mb-4">
                        <CInputGroupText>
                          <CIcon icon={cilLockLocked} />
                        </CInputGroupText>
                        <CFormInput
                          type="password"
                          placeholder="Password"
                          autoComplete="current-password"
                          value={password}
                          onChange={handlePasswordChange}
                          onFocus={() => setPasswordError(null)} // Clear error on focus
                        />
                      </CInputGroup>
                      {passwordError && <p style={{ color: 'red', marginTop: '-15px' }}>{passwordError}</p>}

                      <CRow>
                        <CCol xs={6}>
                          <CButton style={{ backgroundColor: 'orange', borderColor: 'orange' }}  type="submit"  className="px-4">
                            Login
                          </CButton>
                        </CCol>
                        <CCol xs={6} className="text-right">
                          <CButton color="link" onClick={handlePassword} className="px-0">
                            Forgot password?
                          </CButton>
                        </CCol>
                      </CRow>
                    </CForm>
                  </CCardBody>
                </CCard>
                <CCard className="text-white bg-primary py-5 mx-auto" style={{ maxWidth: '100%', width: '100%', maxHeight: '600px' }}>
  <CCardBody className="text-center">
    <div>
      <h2
        style={{
          color: 'orange',
          fontSize: '36px',
          fontWeight: 'bold',
          fontFamily: 'Arial, sans-serif',
          textShadow: '2px 2px 4px rgba(0, 0, 0, 0.2)',
        }}
      >
        Orange Pay
      </h2>
      <p>
        Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod
        tempor incididunt ut labore et dolore magna aliqua.
      </p>
      <Link to="/register">
        <CButton color="warning"
          style={{
            backgroundColor: 'orange',
            borderColor: 'orange',
            color: 'white',
            transition: 'all 0.3s ease', // Smooth transition for hover effects
            position: 'relative', // Required for pseudo-element positioning
            overflow: 'hidden', // This sets the text color to white
          }}
          className="mt-3"
          active
          tabIndex={-1}
        >
          Register Now!
        </CButton>
      </Link>
    </div>
  </CCardBody>
</CCard>


              </CCardGroup>
            </CCol>
          </CRow>
        </CContainer>
      </div>
    )
  }

  export default Login
