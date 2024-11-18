import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import '../../../scss/login.scss'
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
  const [user, setUser] = useState(null);


  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault()

    
    setUsernameError(null)
    setPasswordError(null)
    setGeneralError(null)

    
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
      const response = await axios.post(`/login`, {
        username,
        password,
      }, { withCredentials: true })

      // const { user } = response.data.data;
      // const { id } = user;

      const { token, user, session , encryptedSession } = response.data.data;


      const expirationTime = new Date().getTime() + 60 * 60 * 1000; // 1 hour from now


      // Save token and user data in localStorage
      localStorage.setItem('token', token);
      // localStorage.setItem('session', JSON.stringify(data.session));
      // console.log('Login Successful:', data);
      // sessionStorage.setItem('session', JSON.stringify(session));
      sessionStorage.setItem('session', session)
      sessionStorage.setItem('encryptedSession', encryptedSession)
      
      
      localStorage.setItem("user", JSON.stringify(user));



      // localStorage.setItem('userId', user.id)

      // Save user info in localStorage
      localStorage.setItem('username', username);
      localStorage.setItem('userId', user.id);
      localStorage.setItem('status', user.status);

      localStorage.setItem('expirationTime', expirationTime);


      // Redirect to the dashboard
      navigate(`/dashboard/${user.id}`);
      // navigate(`/dashboard/${id}`);

    } catch (err) {

      if (err.response && err.response.data && err.response.data.message) {
        setGeneralError(err.response.data.message);
      } else {
        setGeneralError("Login failed: Username or Password Incorrect");
      }
    }
  }

  const handleUsernameChange = (e) => {
    setUsername(e.target.value);
    if (e.target.value) {
      setUsernameError(null);
    }
  }

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
    if (e.target.value) {
      setPasswordError(null);
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

                    
                    {generalError && <p style={{ color: 'red' }}>{generalError}</p>}

                    
                    <CInputGroup className="mb-3">
                      <CInputGroupText>
                        <CIcon icon={cilUser} />
                      </CInputGroupText>
                      <CFormInput
                        className="custom-input"
                        placeholder="Username"
                        autoComplete="username"
                        value={username}
                        onChange={handleUsernameChange}
                        onFocus={() => setUsernameError(null)} 
                      />
                    </CInputGroup>
                    {usernameError && <p style={{ color: 'red', marginTop: '-15px' }}>{usernameError}</p>}

                    
                    <CInputGroup className="mb-4">
                      <CInputGroupText>
                        <CIcon icon={cilLockLocked} />
                      </CInputGroupText>
                      <CFormInput
                        className="custom-input"
                        type="password"
                        placeholder="Password"
                        autoComplete="current-password"
                        value={password}
                        onChange={handlePasswordChange}
                        onFocus={() => setPasswordError(null)} 
                      />
                    </CInputGroup>
                    {passwordError && <p style={{ color: 'red', marginTop: '-15px' }}>{passwordError}</p>}

                    <CRow>
                      <CCol xs={6}>
                        <CButton className="login-btn" style={{ backgroundColor: 'orange', borderColor: 'orange' }} type="submit" >
                          Login
                        </CButton>
                      </CCol>
                      <CCol xs={6} className="text-right">
                        <CButton color="link" onClick={handlePassword} className="px-0">
                          Reset password?
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
                        color: '#f36c23',
                        fontSize: '36px',
                        fontWeight: 'bold',
                        fontFamily: 'Cooper Black',
                        textShadow: '2px 2px 4px rgba(0, 0, 0, 0.2)',
                      }}
                    >
                      OrangePay
                    </h2>
                    <p>
                      Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod
                      tempor incididunt ut labore et dolore magna aliqua.
                    </p>
                    <Link to="/register">
                      <CButton className="register-btn"
                        // style={{
                        //   backgroundColor: 'orange',
                        //   borderColor: 'orange',
                        //   color: 'white',
                        //   transition: 'all 0.3s ease', 
                        //   position: 'relative', 
                        //   overflow: 'hidden', 
                        // }}
                        
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
