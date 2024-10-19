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
  CModal, CModalBody, CModalHeader, CModalFooter,
} from '@coreui/react';
import axios from 'axios';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import '../../../scss/tableStyle.scss';



const ViewTable = () => {
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
  const { status } = location.state || {};



  // Fetch data from API when the component mounts
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`/fetch-data/${userId}`);
        console.log("Image Path:", response.data.data[0].photograph);
        console.log("API Response:", response.data);
        setTableData(response.data.data);  // Ensure you're setting the correct field
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [userId]);


  const handleImageClick = (imagePath) => {
    setSelectedImage(imagePath);
    setModal(true);
  };


  // Handle Accept Fund Request
  const handleAccept = async (row) => {
    try {
      const response = await axios.patch(`/users/${row._id}/approve`);
      if (response.status === 200) {
        setTableData((prevData) => prevData.filter((item) => item._id !== row._id));
        navigate('/requests')
      }
    } catch (error) {
      console.error("Error approving fund request", error);
    }
  };

  // Handle Reject Fund Request
  const handleRejects = async (row) => {
    try {
      const response = await axios.patch(`/users/${row._id}/reject`);
      if (response.status === 200) {
        setTableData((prevData) => prevData.filter((item) => item._id !== row._id));
        navigate('/requests')
      }
    } catch (error) {
      console.error("Error rejecting fund request", error);
    }
  };

  // Handle Download Images
  const handleDownload = async (row) => {
    try {
      const response = await axios.get(`/download-images/${row.aadharNumber}`, {
        responseType: 'blob',
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `photos_${row.aadharNumber}.zip`);
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
    } catch (error) {
      console.error('Error downloading file', error);
    }
  };

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
      const response = await axios.patch(`/users/${user._id}/reject`, { remarks });
      if (response.status === 200) {
        setTableData((prevData) => prevData.filter((item) => item._id !== user._id));
        setShowRejectModal(false);
        navigate('/requests');
      }
    } catch (error) {
      console.error("Error rejecting fund request", error);
    }
  };





  return (
    <CContainer fluid    className="table-container">
      <CButton color="secondary" onClick={() => navigate(-1)}>Back</CButton>
      <CTable striped hover bordered responsive>
        <CTableHead>
          <CTableRow>
            <CTableHeaderCell>Field</CTableHeaderCell>
            {tableData.map((user, index) => (
              <CTableHeaderCell key={index}>User</CTableHeaderCell>
            ))}
          </CTableRow>
        </CTableHead>
        <CTableBody>
          <CTableRow>
            <CTableHeaderCell scope="row">Name</CTableHeaderCell>
            {tableData.map((user) => (
              <CTableDataCell key={user.name}>{user.name}</CTableDataCell>
            ))}
          </CTableRow>
          <CTableRow>
            <CTableHeaderCell scope="row">Father Or Husband Name</CTableHeaderCell>
            {tableData.map((user) => (
              <CTableDataCell key={user.id}>{user.fatherOrHusbandName}</CTableDataCell>
            ))}
          </CTableRow>
          <CTableRow>
            <CTableHeaderCell scope="row">Date of Birth</CTableHeaderCell>
            {tableData.map((user) => (
              <CTableDataCell key={user.id}>{user.dob}</CTableDataCell>
            ))}
          </CTableRow>
          <CTableRow>
            <CTableHeaderCell scope="row">Aadhar Number</CTableHeaderCell>
            {tableData.map((user) => (
              <CTableDataCell key={user.id}>{user.aadharNumber}</CTableDataCell>
            ))}
          </CTableRow>
          <CTableRow>
            <CTableHeaderCell scope="row">Pan Number</CTableHeaderCell>
            {tableData.map((user) => (
              <CTableDataCell key={user.id}>{user.panNumber}</CTableDataCell>
            ))}
          </CTableRow>
          <CTableRow>
            <CTableHeaderCell scope="row">Mobile Number</CTableHeaderCell>
            {tableData.map((user) => (
              <CTableDataCell key={user.id}>{user.mobileNumber}</CTableDataCell>
            ))}
          </CTableRow>
          <CTableRow>
            <CTableHeaderCell scope="row">Gender</CTableHeaderCell>
            {tableData.map((user) => (
              <CTableDataCell key={user.id}>{user.gender}</CTableDataCell>
            ))}
          </CTableRow>
          <CTableRow>
            <CTableHeaderCell scope="row">Marital Status</CTableHeaderCell>
            {tableData.map((user) => (
              <CTableDataCell key={user.id}>{user.maritalStatus}</CTableDataCell>
            ))}
          </CTableRow>
          <CTableRow>
            <CTableHeaderCell scope="row">Education</CTableHeaderCell>
            {tableData.map((user) => (
              <CTableDataCell key={user.id}>{user.education}</CTableDataCell>
            ))}
          </CTableRow>
          <CTableRow>
            <CTableHeaderCell scope="row">Remarks</CTableHeaderCell>
            {tableData.map((user) => (
              <CTableDataCell key={user.id}>{user.remarks}</CTableDataCell>
            ))}
          </CTableRow>
          <CTableRow>
            <CTableHeaderCell scope="row">Address</CTableHeaderCell>
            {tableData.map((user) => (
              <CTableDataCell key={user.id}>{user.address}</CTableDataCell>
            ))}
          </CTableRow>
          <CTableRow>
            <CTableHeaderCell scope="row">E-Mail</CTableHeaderCell>
            {tableData.map((user) => (
              <CTableDataCell key={user.id}>{user.email}</CTableDataCell>
            ))}
          </CTableRow>
          <CTableRow>
            <CTableHeaderCell scope="row">Division</CTableHeaderCell>
            {tableData.map((user) => (
              <CTableDataCell key={user.id}>{user.division}</CTableDataCell>
            ))}
          </CTableRow>
          <CTableRow>
            <CTableHeaderCell scope="row">Sub-Division</CTableHeaderCell>
            {tableData.map((user) => (
              <CTableDataCell key={user.id}>{user.subDivision}</CTableDataCell>
            ))}
          </CTableRow>
          <CTableRow>
            <CTableHeaderCell scope="row">Section</CTableHeaderCell>
            {tableData.map((user) => (
              <CTableDataCell key={user.id}>{user.section}</CTableDataCell>
            ))}
          </CTableRow>
          <CTableRow>
            <CTableHeaderCell scope="row">Consumer Id</CTableHeaderCell>
            {tableData.map((user) => (
              <CTableDataCell key={user.id}>{user.consumerId}</CTableDataCell>
            ))}
          </CTableRow>
          <CTableRow>
            <CTableHeaderCell scope="row">District</CTableHeaderCell>
            {tableData.map((user) => (
              <CTableDataCell key={user.id}>{user.district}</CTableDataCell>
            ))}
          </CTableRow>
          <CTableRow>
            <CTableHeaderCell scope="row">Pin Code</CTableHeaderCell>
            {tableData.map((user) => (
              <CTableDataCell key={user.id}>{user.pincode}</CTableDataCell>
            ))}
          </CTableRow>
          <CTableRow>
            <CTableHeaderCell scope="row">Bank</CTableHeaderCell>
            {tableData.map((user) => (
              <CTableDataCell key={user.id}>{user.bank}</CTableDataCell>
            ))}
          </CTableRow>
          <CTableRow>
            <CTableHeaderCell scope="row">Bank Account Number</CTableHeaderCell>
            {tableData.map((user) => (
              <CTableDataCell key={user.id}>{user.accountno}</CTableDataCell>
            ))}
          </CTableRow>
          <CTableRow>
            <CTableHeaderCell scope="row">IFSC Code</CTableHeaderCell>
            {tableData.map((user) => (
              <CTableDataCell key={user.id}>{user.ifsc}</CTableDataCell>
            ))}
          </CTableRow>
          <CTableRow>
            <CTableHeaderCell scope="row">Discom</CTableHeaderCell>
            {tableData.map((user) => (
              <CTableDataCell key={user.id}>{user.discom}</CTableDataCell>
            ))}
          </CTableRow>
          <CTableRow>
            <CTableHeaderCell scope="row">Photograph</CTableHeaderCell>
            {tableData.map((user) => {
              const photographPath = user.photograph;
              const filename = photographPath.split('/').pop();
              const imagePath = `/images/${user.aadharNumber}/${filename}`;

              return (
                <CTableDataCell key={user.id}>
                  {/* Clickable Image */}
                  <img
                    src={imagePath}
                    alt="Photograph"
                    width="100"
                    style={{ cursor: 'pointer' }}
                    onClick={() => handleImageClick(imagePath)}
                  />
                </CTableDataCell>
              );
            })}
          </CTableRow>
          <CTableRow>
            <CTableHeaderCell scope="row">Aadhar Card</CTableHeaderCell>
            {tableData.map((user) => {
              const photographPath = user.aadharCard;
              const filename = photographPath.split('/').pop();
              const imagePath = `/images/${user.aadharNumber}/${filename}`;

              return (
                <CTableDataCell key={user.id}>
                  {/* Clickable Image */}
                  <img
                    src={imagePath}
                    alt="Photograph"
                    width="100"
                    style={{ cursor: 'pointer' }}
                    onClick={() => handleImageClick(imagePath)}
                  />
                </CTableDataCell>
              );
            })}
          </CTableRow>
          <CTableRow>
            <CTableHeaderCell scope="row">Pan Card</CTableHeaderCell>
            {tableData.map((user) => {
              const photographPath = user.panCard;
              const filename = photographPath.split('/').pop();
              const imagePath = `/images/${user.aadharNumber}/${filename}`;

              return (
                <CTableDataCell key={user.id}>
                  {/* Clickable Image */}
                  <img
                    src={imagePath}
                    alt="Photograph"
                    width="100"
                    style={{ cursor: 'pointer' }}
                    onClick={() => handleImageClick(imagePath)}
                  />
                </CTableDataCell>
              );
            })}
          </CTableRow>
          <CTableRow>
            <CTableHeaderCell scope="row">Education Certificate</CTableHeaderCell>
            {tableData.map((user) => {
              const photographPath = user.educationCertificate;
              const filename = photographPath.split('/').pop();
              const imagePath = `/images/${user.aadharNumber}/${filename}`;

              return (
                <CTableDataCell key={user.id}>
                  {/* Clickable Image */}
                  <img
                    src={imagePath}
                    alt="Photograph"
                    width="100"
                    style={{ cursor: 'pointer' }}
                    onClick={() => handleImageClick(imagePath)}
                  />
                </CTableDataCell>
              );
            })}

          </CTableRow>
          <CTableRow>
            <CTableHeaderCell scope="row">Cheque</CTableHeaderCell>
            {tableData.map((user) => {
              const photographPath = user.cheque;
              const filename = photographPath.split('/').pop();
              const imagePath = `/images/${user.aadharNumber}/${filename}`;

              return (
                <CTableDataCell key={user.id}>
                  {/* Clickable Image */}
                  <img
                    src={imagePath}
                    alt="Photograph"
                    width="100"
                    style={{ cursor: 'pointer' }}
                    onClick={() => handleImageClick(imagePath)}
                  />
                </CTableDataCell>
              );
            })}

          </CTableRow>
          <CTableRow>
            <CTableHeaderCell scope="row">Signature</CTableHeaderCell>
            {tableData.map((user) => {
              const photographPath = user.signature;
              const filename = photographPath.split('/').pop();
              const imagePath = `/images/${user.aadharNumber}/${filename}`;

              return (
                <CTableDataCell key={user.id}>
                  {/* Clickable Image */}
                  <img
                    src={imagePath}
                    alt="Photograph"
                    width="100"
                    style={{ cursor: 'pointer' }}
                    onClick={() => handleImageClick(imagePath)}
                  />
                </CTableDataCell>
              );
            })}

          </CTableRow>
          <CTableRow>
            <CTableHeaderCell scope="row">Actions</CTableHeaderCell>
            {tableData.map((user) => (
              <CTableDataCell key={user._id}>
                <div style={{ display: "flex", justifyContent: "space-around", width: "100%" }}>
                  {/* Check if the user is rejected */}
                  {user.status === 'Rejected' ? (
                    <>
                      <CButton color="success" onClick={() => handleAccept(user)}>Accept</CButton>{' '}
                      <CButton color="info" onClick={() => handleDownload(user)}>Download</CButton>
                    </>
                  ) : (
                    <>
                      {user.status !== 'Approved' && (
                        <div style={{ display: "flex", justifyContent: "space-around", width: "100%" }}>
                          <CButton color="success" onClick={() => handleAccept(user)}>Accept</CButton>{' '}
                          <CButton color="danger" onClick={() => handleReject(user)}>Reject</CButton>{' '}
                        </div>
                      )}
                      <CButton color="info" onClick={() => handleDownload(user)}>Download</CButton>
                    </>
                  )}
                </div>
              </CTableDataCell>
            ))}
          </CTableRow>

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

      <CModal visible={modal} onClose={() => setModal(false)}>
        <CModalHeader onClose={() => setModal(false)}>Image Preview</CModalHeader>
        <CModalBody>
          <img src={selectedImage} alt="Full Size" style={{ width: '100%' }} />
        </CModalBody>
      </CModal>
    </CContainer>
  );
};

export default ViewTable;
