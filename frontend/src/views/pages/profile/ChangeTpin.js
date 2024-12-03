import React, { useState, useEffect } from 'react';
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
} from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { cilLockLocked } from '@coreui/icons';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const ChangePassword = () => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const userId = localStorage.getItem('userId'); // Get userId from localStorage

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    // Validate input fields
    if (!currentPassword || !newPassword || !confirmPassword) {
      setError('All fields are required.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('New password and confirm password do not match.');
      return;
    }

    try {
      const response = await axios.post('/api/v1/users/change-tpin', {
        userId,
        currentPassword,
        newPassword,
      });

      if (response.data.success) {
        setModalMessage('Congratulations, your Tpin has been changed!');
      } else {
        setModalMessage('Something went wrong, please enter the correct Tpin.');
      }
      setModalVisible(true);
    } catch (err) {
      setModalMessage('An error occurred: ' + (err.response?.data?.message || err.message));
      setModalVisible(true);
    }
  };

  const handleClose = () => {
    setModalVisible(false);
  };

  useEffect(() => {
    // Clear input fields and navigate back when modal closes after success
    if (!modalVisible && modalMessage === 'Congratulations, your Tpin has been changed!') {
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      // navigate(-1);
    }
  }, [modalVisible, modalMessage, navigate]);

  return (
    <div className="bg-body-tertiary min-vh-90 d-flex flex-row align-items-center">
      <CContainer>
        <CRow className="justify-content-center">
          <CCol md={6}>
            <CCard className="p-4">
              <CCardBody>
                <CForm onSubmit={handleSubmit}>
                  <h1>Change Tpin</h1>
                  <p className="text-body-secondary">Enter your Tpin details</p>

                  {error && <p style={{ color: 'red' }}>{error}</p>}

                  {/* Current Password input */}
                  <CInputGroup className="mb-3">
                    <CInputGroupText>
                      <CIcon icon={cilLockLocked} />
                    </CInputGroupText>
                    <CFormInput
                      type="password"
                      maxLength={4}
                      placeholder="Current Tpin"
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
                      maxLength={4}
                      placeholder="New Tpin"
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
                      maxLength={4}
                      placeholder="Confirm Tpin"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                  </CInputGroup>

                  <CRow>
                    <CCol xs={6}>
                      <CButton type="submit" color="primary" className="px-4">
                        Change Tpin
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
  );
};

export default ChangePassword;
