import React, { useState } from 'react'
import {
  CButton,
  CCard,
  CCardBody,
  CCol,
  CContainer,
  CForm,
  CFormInput,
  CInputGroup,
  CInputGroupText,
  CModal,
  CModalBody,
  CModalFooter,
  CModalHeader,
  CModalTitle,
  CRow,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilLockLocked } from '@coreui/icons'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

const ChangePassword = () => {
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState(null)
  const [modalVisible, setModalVisible] = useState(false)
  const [modalMessage, setModalMessage] = useState('')
  const [email, setEmail] = useState('') // New state for email input
  const [resetMode, setResetMode] = useState(false) // To toggle between change password and reset password
  const [aadhaarLastFour, setAadhaarLastFour] = useState('') // State for Aadhar last four digits
  const [aadhaarVerified, setAadhaarVerified] = useState(false) // State for Aadhar verification
  // const userId = localStorage.getItem('userId')
  const [userId, setUserId] = useState('');
  const [otpModalVisible, setOtpModalVisible] = useState(false) // State for OTP modal visibility
  const [otp, setOtp] = useState('') // State for OTP input
  const [otpError, setOtpError] = useState(null)
  const [otpSuccess, setOtpSuccess] = useState(null)

  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()

    setError(null)

    if (resetMode) {
      // Reset password request logic...
    } else {
      if (!aadhaarVerified) {
        // Verify Aadhar number
        if (!aadhaarLastFour) {
          setError("Aadhar last four digits are required.")
          return
        }

        try {
          const response = await axios.post('/verify-aadhaar', {

            aadhaarLastFour,
          })

          if (response.data.success) {
            setAadhaarVerified(true);
            setUserId(response.data.userId);
            setOtpModalVisible(true)
          } else {
            setError('Aadhar verification failed. Please try again.')
          }
        } catch (err) {
          setError('An error occurred: ' + (err.response?.data?.message || err.message))
        }
      } else {

        if (!currentPassword || !newPassword || !confirmPassword) {
          setError("All fields are required.")
          return
        }

        if (newPassword !== confirmPassword) {
          setError("New password and confirm password do not match.")
          return
        }

        try {
          const response = await axios.post('/change-password', {
            userId,
            currentPassword,
            newPassword,
          })

          if (response.data.success) {
            setModalMessage('Congratulations, your password has been changed!')
          } else {
            setModalMessage('Something went wrong, please enter the correct password.')
          }
          setModalVisible(true)
        } catch (err) {
          setModalMessage('An error occurred: ' + (err.response?.data?.message || err.message))
          setModalVisible(true)
        }
      }
    }
  }


  const handleOtpSubmit = async () => {
    setOtpError(null)
    setOtpSuccess(null)
    try {
      const response = await axios.post('/verify-otp', { userId, otp })

      if (response.data.success) {
        setOtpSuccess('OTP verified successfully!')
        setAadhaarVerified(true)
        setTimeout(() => setOtpModalVisible(false), 1500) // Close modal after success
      } else {
        setOtpError('Invalid OTP. Please try again.')
      }
    } catch (err) {
      setOtpError('An error occurred: ' + (err.response?.data?.message || err.message))
    }
  }






  const handleClose = () => {
    setModalVisible(false)
    if (modalMessage === 'Congratulations, your password has been changed!') {
      navigate('/login')
    }
  }

  const toggleResetMode = () => {
    setResetMode(!resetMode)
    setCurrentPassword('')
    setNewPassword('')
    setConfirmPassword('')
    setEmail('')
    setAadhaarLastFour('')
    setError(null)
    setAadhaarVerified(false)
  }

  return (
    <div className="bg-body-tertiary min-vh-90 d-flex flex-row align-items-center">
      <CContainer>
        <CRow className="justify-content-center">
          <CCol md={6}>
            <CCard className="p-4">
              <CCardBody>
                <CForm onSubmit={handleSubmit}>
                  <h1>Change Password</h1>
                  <p className="text-body-secondary">Enter your password details</p>

                  {error && <p style={{ color: 'red' }}>{error}</p>}


                  {!aadhaarVerified && (
                    <CInputGroup className="mb-3">
                      <CInputGroupText>
                        <CIcon icon={cilLockLocked} />
                      </CInputGroupText>
                      <CFormInput
                        type="text"
                        placeholder="Last 4 Digits of Aadhar"
                        value={aadhaarLastFour}
                        onChange={(e) => setAadhaarLastFour(e.target.value)}
                      />
                    </CInputGroup>
                  )}


                  {aadhaarVerified  && otpSuccess  && (
                    <CInputGroup className="mb-3">
                      <CInputGroupText>
                        <CIcon icon={cilLockLocked} />
                      </CInputGroupText>
                      <CFormInput
                        type="password"
                        placeholder="Current Password"
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                      />
                    </CInputGroup>
                  )}


                  {aadhaarVerified && otpSuccess  && (
                    <CInputGroup className="mb-3">
                      <CInputGroupText>
                        <CIcon icon={cilLockLocked} />
                      </CInputGroupText>
                      <CFormInput
                        type="password"
                        placeholder="New Password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                      />
                    </CInputGroup>
                  )}


                  {aadhaarVerified && otpSuccess  && (
                    <CInputGroup className="mb-3">
                      <CInputGroupText>
                        <CIcon icon={cilLockLocked} />
                      </CInputGroupText>
                      <CFormInput
                        type="password"
                        placeholder="Confirm Password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                      />
                    </CInputGroup>
                  )}

                  <CRow>
                    <CCol xs={6}>
                      <CButton type="submit" color="primary" className="px-4">
                        {aadhaarVerified ? 'Change Password' : 'Verify Aadhar'}
                      </CButton>
                    </CCol>
                  </CRow>
                </CForm>
              </CCardBody>
            </CCard>
          </CCol>
        </CRow>


        <CModal visible={otpModalVisible} onClose={() => setOtpModalVisible(false)}>
          <CModalHeader>
            <CModalTitle>Enter OTP</CModalTitle>
          </CModalHeader>
          <CModalBody>
            <CFormInput
              type="text"
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => {
                const input = e.target.value;
                if (/^\d{0,4}$/.test(input)) { 
                  setOtp(input);
                }
              }}
            />
            {otpError && <p style={{ color: 'red' }}>{otpError}</p>}
            {otpSuccess && <p style={{ color: 'green' }}>{otpSuccess}</p>}
          </CModalBody>
          <CModalFooter>
            <CButton color="primary" onClick={handleOtpSubmit}>
              Verify OTP
            </CButton>
            <CButton color="secondary" onClick={() => setOtpModalVisible(false)}>
              Close
            </CButton>
          </CModalFooter>
        </CModal>

        {/* Success/Error Modal */}
        <CModal visible={modalVisible} onClose={handleClose}>
          <CModalHeader>
            <CModalTitle>Password Change</CModalTitle>
          </CModalHeader>
          <CModalBody>
            {modalMessage}
          </CModalBody>
          <CModalFooter>
            <CButton color="secondary" onClick={handleClose}>
              Close
            </CButton>
          </CModalFooter>
        </CModal>
      </CContainer>
    </div>
  )
}

export default ChangePassword
