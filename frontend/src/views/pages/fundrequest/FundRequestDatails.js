import React, { useEffect, useState } from 'react';
import {
  CTable,
  CTableHead,
  CTableRow,
  CTableHeaderCell,
  CTableBody,
  CTableDataCell,
  CContainer,
  CButton,
  CModal,
  CModalHeader,
  CModalBody,
  CModalFooter,
  CFormInput,
  CFormTextarea,
} from '@coreui/react';
import axios from 'axios';
import { useLocation, useNavigate, useParams } from 'react-router-dom';

const FundRequestDatails = () => {
  const [userData, setUserData] = useState(null); // State to hold user data
  const [reason, setReason] = useState('');
  const [isRejectModalVisible, setRejectModalVisible] = useState(false); // Modal visibility state
  const { userId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userResponse = await axios.get(`/api/v1/users/fetchUserByIdd/${userId}`);
        if (userResponse.data.success) {
          setUserData(userResponse.data.user); // Set user data directly
        } else {
          console.error(userResponse.data.message);
          setUserData(null); // Reset or set to null
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUserData();
  }, [userId]);

  const handleAccept = async () => {
    if (!userData) return; // Prevent actions if user data is not available
    try {
      const response = await axios.patch(`/api/v1/users/fundrequests/${userData._id}/approve`);
      if (response.status === 200) {
        // Handle successful acceptance (e.g., navigate back or show a success message)
        console.log('Request accepted successfully');
        navigate(-1); // Navigate back after acceptance
      }
    } catch (error) {
      console.error("Error approving fund request", error);
    }
  };

  const handleReject = async () => {
    if (!userData) return; // Prevent actions if user data is not available
    try {
      const response = await axios.patch(`/api/v1/users/fundrequests/${userData._id}/reject`);
      if (response.status === 200) {
        // Handle successful rejection (e.g., navigate back or show a success message)
        console.log('Request rejected successfully');
        setRejectModalVisible(false);
        navigate(-1); // Navigate back after rejection
      }
    } catch (error) {
      console.error("Error rejecting fund request", error);
    }
  };

  // Handle case when no user data is found
  if (!userData) {
    return <div>No fund requests found for this user ID.</div>; // Fallback UI
  }

  return (
    <CContainer fluid>
      <CButton color="secondary" onClick={() => navigate(-1)}>Back</CButton>
      <CTable striped hover bordered responsive>
        <CTableHead>
          <CTableRow>
            <CTableHeaderCell>Field</CTableHeaderCell>
            <CTableHeaderCell>Value</CTableHeaderCell>
          </CTableRow>
        </CTableHead>
        <CTableBody>
          <CTableRow>
            <CTableHeaderCell scope="row">User ID</CTableHeaderCell>
            <CTableDataCell>{userData.uniqueId}</CTableDataCell>
          </CTableRow>
          <CTableRow>
            <CTableHeaderCell scope="row">Fund Amount</CTableHeaderCell>
            <CTableDataCell>{userData.fundAmount}</CTableDataCell>
          </CTableRow>
          <CTableRow>
            <CTableHeaderCell scope="row">Date of Payment</CTableHeaderCell>
            <CTableDataCell>{userData.datePayment}</CTableDataCell>
          </CTableRow>
          <CTableRow>
            <CTableHeaderCell scope="row">Bank Reference</CTableHeaderCell>
            <CTableDataCell>{userData.bankReference}</CTableDataCell>
          </CTableRow>
          <CTableRow>
            <CTableHeaderCell scope="row">Payment Method</CTableHeaderCell>
            <CTableDataCell>{userData.paymentMethod}</CTableDataCell>
          </CTableRow>
          <CTableRow>
            <CTableHeaderCell scope="row">Bank Name</CTableHeaderCell>
            <CTableDataCell>{userData.bankName || 'N/A'}</CTableDataCell>
          </CTableRow>
          <CTableRow>
            <CTableHeaderCell scope="row">Status</CTableHeaderCell>
            <CTableDataCell>{userData.status}</CTableDataCell>
          </CTableRow>
          <CTableRow>
            <CTableHeaderCell scope="row">Created At</CTableHeaderCell>
            <CTableDataCell>{new Date(userData.createdAt).toLocaleString('en-US', {
              year: 'numeric',
              month: '2-digit',
              day: '2-digit',
              hour: '2-digit',
              minute: '2-digit',
              second: '2-digit',
              hour12: true
            })}</CTableDataCell>
          </CTableRow>
          <CTableRow>
            <CTableHeaderCell scope="row">Updated At</CTableHeaderCell>
            <CTableDataCell>{new Date(userData.updatedAt).toLocaleString('en-US', {
              year: 'numeric',
              month: '2-digit',
              day: '2-digit',
              hour: '2-digit',
              minute: '2-digit',
              second: '2-digit',
              hour12: true
            })}</CTableDataCell>
          </CTableRow>
          <CTableRow>
            <CTableHeaderCell scope="row">Actions</CTableHeaderCell>
            <CTableDataCell>
              <div style={{ display: "flex", justifyContent: "space-around", width: "100%" }}>
                <CButton color="success" onClick={handleAccept}>Accept</CButton>
                <CButton color="danger" onClick={() => setRejectModalVisible(true)}>Reject</CButton>
              </div>
            </CTableDataCell>
          </CTableRow>
        </CTableBody>
      </CTable>
      <CModal
        visible={isRejectModalVisible}
        onClose={() => setRejectModalVisible(false)}
      >
        <CModalHeader>Reject Fund Request</CModalHeader>
        <CModalBody>
          <CFormTextarea
            rows={4}
            placeholder="Enter the reason for rejection"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
          />
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setRejectModalVisible(false)}>Cancel</CButton>
          <CButton
            color="danger"
            onClick={handleReject}
            disabled={!reason.trim()} // Disable button if no reason
          >
            Reject
          </CButton>
        </CModalFooter>
      </CModal>
    </CContainer>
  );
};

export default FundRequestDatails;
