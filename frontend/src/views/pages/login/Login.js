import React, { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { useHistory } from 'react-router-dom'
import { useEffect } from 'react'

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
  // const history = useHistory()

  // const {_id} = useParams();


  const navigate = useNavigate();

  // useEffect(() => {
  //   localStorage.removeItem('username'); // Remove specific item
  //   // Or clear all items:
  //   // localStorage.clear();
  // }, []); 

  const handleSubmit = async (e) => {
    e.preventDefault()


    try {
      const response = await axios.post('/login', {
        username,
        password,
      })  


      const { user } = response.data.data;

      const { id } = user; 





      console.log(response.data); // Add this to check the response structure

      // If the login is successful, you might receive a token or user data
      // const {data} = response.data

      // localStorage.setItem('username', username)
      // dispatch(setUserRole(data.role)); // Use the action to set user role

      localStorage.setItem('username', username);
      localStorage.setItem('userId', id);

      // dispatch(setUserRole(data.role)); // Set user role

      // Redirect to the dashboard
      navigate(`/dashboard/${id}`);

      // Example: Store the token or user data as needed
      // localStorage.setItem('token', data.token)

      // Redirect to the dashboard
      // navigate('/dashboard')

    } catch (err) {
      // Handle the error, show it to the user
      // setError('Login failed: ' + (err.response?.data?.message || err.message))
    }
  }

    // Perform form validation
    // if (username === '' || password === '') {
    //   alert('Please fill in both fields')
    //   return
    // }
    // navigate('/dashboard')

    // Example: Send form data to a backend or handle login logic
    // console.log('Form submitted:', { username, password })

    // Reset form fields
    // setUsername('')
    // setPassword('')
  // }

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
                    <CInputGroup className="mb-3">
                      <CInputGroupText>
                        <CIcon icon={cilUser} />
                      </CInputGroupText>
                      <CFormInput
                        placeholder="Username"
                        autoComplete="username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                      />
                    </CInputGroup>
                    <CInputGroup className="mb-4">
                      <CInputGroupText>
                        <CIcon icon={cilLockLocked} />
                      </CInputGroupText>
                      <CFormInput
                        type="password"
                        placeholder="Password"
                        autoComplete="current-password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                      />
                    </CInputGroup>
                    <CRow>
                      <CCol xs={6}>
                        <CButton type="submit" color="warning" className="px-4">
                          Login
                        </CButton>
                      </CCol>
                      <CCol xs={6} className="text-right">
                        <CButton color="link" className="px-0">
                          Forgot password?
                        </CButton>
                      </CCol>
                    </CRow>
                  </CForm>
                </CCardBody>
              </CCard>
              <CCard className="text-white bg-primary py-5" style={{ width: '44%' }}>
                <CCardBody className="text-center">
                  <div>
                    <h2>Sign up</h2>
                    <p>
                      Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod
                      tempor incididunt ut labore et dolore magna aliqua.
                    </p>
                    <Link to="/register">
                      <CButton color="warning" className="mt-3" active tabIndex={-1}>
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
