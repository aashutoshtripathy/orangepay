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

  const navigate = useNavigate() // Initialize useNavigate hook

  const handleSubmit = async (e) => {
    e.preventDefault()

    // Reset error
    setError(null)

    // Validation checks
    if (!currentPassword || !newPassword || !confirmPassword) {
      setError("All fields are required.")
      return
    }

    if (newPassword !== confirmPassword) {
      setError("New password and confirm password do not match.")
      return
    }

    try {
      // Call API to change the password
      const response = await axios.post('/change-password', {
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

  const handleClose = () => {
    setModalVisible(false)

    // If the password change was successful, navigate to the login page
    if (modalMessage === 'Congratulations, your password has been changed!') {
      navigate('/login') // Redirect to login page
    }
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

                  {/* Current Password input */}
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

                  {/* New Password input */}
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

                  {/* Confirm Password input */}
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

                  <CRow>
                    <CCol xs={6}>
                      <CButton type="submit" color="primary" className="px-4">
                        Change Password
                      </CButton>
                    </CCol>
                  </CRow>
                </CForm>
              </CCardBody>
            </CCard>
          </CCol>
        </CRow>

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
