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
  CModalBody,
  CModalHeader,
  CModalFooter,
} from '@coreui/react';
import axios from 'axios';
import { useLocation, useNavigate, useParams } from 'react-router-dom';

const CancellationDetailss = () => {
  // State to hold the fetched table data
  const [tableData, setTableData] = useState([]);
  const { userId } = useParams();
  const navigate = useNavigate();

  const [modal, setModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState('');
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [remarks, setRemarks] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const [validationMessage, setValidationMessage] = useState('');
  const location = useLocation();
  const { row } = location.state; // Get row data from the location state

  // Use the row data directly
  useEffect(() => {
    if (row) {
      setTableData([row]); // Set tableData with the received row data
    }
  }, [row]);

  const handleImageClick = (imagePath) => {
    setSelectedImage(imagePath);
    setModal(true);
  };

  // Handle Accept Fund Request
  const handleAccept = async (row) => {
    try {
      const response = await axios.patch(`/cancel/${row._id}/approve`);
      if (response.status === 200) {
        // Update status in the local state
        setTableData((prevData) => 
          prevData.map((item) =>
            item._id === row._id ? { ...item, paymentStatus: 'Completed' } : item
          )
        );
        navigate('/cancellationrequests');
      }
    } catch (error) {
      console.error("Error approving fund request", error);
    }
  };

  // Handle Reject Fund Request
  const handleReject = (user) => {
    setSelectedUser(user);
    setShowRejectModal(true);
  };

  const submitRejection = async (user, remarks) => {
    if (!remarks.trim()) {
      setValidationMessage('Remarks cannot be empty.'); // Set validation message
      return;
    }

    try {
      const response = await axios.patch(`/cancel/${user._id}/reject`, { remarks });
      if (response.status === 200) {
        // Update status in the local state
        setTableData((prevData) => 
          prevData.map((item) =>
            item._id === user._id ? { ...item, paymentStatus: 'Rejected' } : item
          )
        );
        setShowRejectModal(false);
        navigate('/cancellationrequests');
      }
    } catch (error) {
      console.error("Error rejecting fund request", error);
    }
  };

  return (
    <CContainer fluid>
      <CButton style={{ marginBottom:"2px" }} color="secondary" onClick={() => navigate(-1)}>Back</CButton>
      <CTable striped hover bordered responsive>
        <CTableHead>
          <CTableRow>
            <CTableHeaderCell>Field</CTableHeaderCell>
            <CTableHeaderCell>User</CTableHeaderCell>
          </CTableRow>
        </CTableHead>
        <CTableBody>
          {tableData.map((user) => (
            <>
              <CTableRow key={user._id}>
                <CTableHeaderCell scope="row">userId</CTableHeaderCell>
                <CTableDataCell>{user.userId}</CTableDataCell>
              </CTableRow>
              <CTableRow key={user._id + '-transactionId'}>
                <CTableHeaderCell scope="row">transactionId</CTableHeaderCell>
                <CTableDataCell>{user.transactionId}</CTableDataCell>
              </CTableRow>
              <CTableRow key={user._id + '-consumerNumber'}>
                <CTableHeaderCell scope="row">consumerNumber</CTableHeaderCell>
                <CTableDataCell>{user.consumerNumber}</CTableDataCell>
              </CTableRow>
              <CTableRow key={user._id + '-consumerName'}>
                <CTableHeaderCell scope="row">consumerName</CTableHeaderCell>
                <CTableDataCell>{user.consumerName}</CTableDataCell>
              </CTableRow>
              <CTableRow key={user._id + '-paymentMode'}>
                <CTableHeaderCell scope="row">paymentMode</CTableHeaderCell>
                <CTableDataCell>{user.paymentMode}</CTableDataCell>
              </CTableRow>
              <CTableRow key={user._id + '-paymentAmount'}>
                <CTableHeaderCell scope="row">paymentAmount</CTableHeaderCell>
                <CTableDataCell>{user.paymentAmount}</CTableDataCell>
              </CTableRow>
              <CTableRow key={user._id + '-paymentStatus'}>
                <CTableHeaderCell scope="row">paymentStatus</CTableHeaderCell>
                <CTableDataCell>{user.paymentStatus}</CTableDataCell>
              </CTableRow>
              <CTableRow key={user._id + '-createdOn'}>
                <CTableHeaderCell scope="row">createdOn</CTableHeaderCell>
                <CTableDataCell>{user.createdOn}</CTableDataCell>
              </CTableRow>
              <CTableRow key={user._id + '-reason'}>
                <CTableHeaderCell scope="row">Reason</CTableHeaderCell>
                <CTableDataCell>{user.selectedOption}</CTableDataCell>
              </CTableRow>
              <CTableRow key={user._id + '-actions'}>
                <CTableHeaderCell scope="row">Actions</CTableHeaderCell>
                <CTableDataCell>
                  <div style={{ display: "flex", justifyContent: "space-around", width: "100%" }}>
                    <CButton color="success" onClick={() => handleAccept(user)}>Accept</CButton>
                    <CButton color="danger" onClick={() => handleReject(user)}>Reject</CButton>
                  </div>
                </CTableDataCell>
              </CTableRow>
                {/* <CTableRow key={user._id + '-billPhotograph'}>
                <CTableHeaderCell scope="row">Bill Photograph</CTableHeaderCell>
                <CTableDataCell>
                  <img
                    src={/images/${user.aadharNumber}/${user.photograph.split('/').pop()}}
                    alt="Photograph"
                    width="100"
                    style={{ cursor: 'pointer' }}
                    onClick={() => handleImageClick(/images/${user.aadharNumber}/${user.photograph.split('/').pop()})}
                  />
                </CTableDataCell>
              </CTableRow> */}
              {/* <CTableRow key={user._id + '-selfie'}>
                <CTableHeaderCell scope="row">Selfie</CTableHeaderCell>
                <CTableDataCell>
                  <img
                    src={/images/${user.aadharNumber}/${user.aadharCard.split('/').pop()}}
                    alt="Selfie"
                    width="100"
                    style={{ cursor: 'pointer' }}
                    onClick={() => handleImageClick(/images/${user.aadharNumber}/${user.aadharCard.split('/').pop()})}
                  />
                </CTableDataCell>
              </CTableRow> */}
            </>
          ))}
        </CTableBody>
      </CTable>

      <CModal visible={showRejectModal} onClose={() => setShowRejectModal(false)}>
        <CModalHeader onClose={() => setShowRejectModal(false)}>Add Remarks</CModalHeader>
        <CModalBody>
          <textarea
            value={remarks}
            onChange={(e) => setRemarks(e.target.value)}
            rows="4"
            style={{ width: '100%' }}
            placeholder="Enter your remarks here..."
          />
          {validationMessage && <div style={{ color: 'red' }}>{validationMessage}</div>}
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setShowRejectModal(false)}>Cancel</CButton>
          <CButton color="danger" onClick={async () => {
            await submitRejection(selectedUser, remarks);
            // Do not close the modal here; handle it in submitRejection
          }} >Submit</CButton>
        </CModalFooter>
      </CModal>
    </CContainer>
  );
};

export default CancellationDetailss;
