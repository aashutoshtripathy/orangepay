import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  CContainer,
  CRow,
  CCol,
  CFormLabel,
  CFormSelect,
  CFormInput,
  CButton,
  CFormText,
  CModal,
  CModalBody,
  CModalFooter,
  CModalHeader,
  CModalTitle,
} from '@coreui/react';

const CancellationDetails = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { selectedItem } = location.state || {};

  // States for form data, multiple file inputs, errors, and modal visibility
  const [option, setOption] = useState('');
  const [file, setFile] = useState(null);
  const [photo1, setPhoto1] = useState(null);
  const [photo2, setPhoto2] = useState(null);
  const [errors, setErrors] = useState({ option: '', file: '', photo1: '', photo2: '' });
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  // Handle file selection (generalized for multiple files)
  const handleFileChange = (e, setPhotoFunction) => {
    const selectedFile = e.target.files[0];
    setPhotoFunction(selectedFile);
    if (!selectedFile) {
      setErrors((prevErrors) => ({ ...prevErrors, [e.target.name]: 'Please upload a file.' }));
    } else {
      setErrors((prevErrors) => ({ ...prevErrors, [e.target.name]: '' }));
    }
  };

  // Validate the selected option field
  const validateOption = () => {
    if (!option) {
      setErrors((prevErrors) => ({ ...prevErrors, option: 'Please select an option.' }));
    } else {
      setErrors((prevErrors) => ({ ...prevErrors, option: '' }));
    }
  };

  // Validate all file inputs
  const validateFiles = () => {
    if (!file || !photo1 || !photo2) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        file: file ? '' : 'Please upload a file.',
        photo1: photo1 ? '' : 'Please upload a photograph.',
        photo2: photo2 ? '' : 'Please upload a photograph.',
      }));
      return false;
    }
    return true;
  };

  // Form submit handler
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate fields
    const isOptionValid = !!option;
    const areFilesValid = validateFiles();

    if (!isOptionValid || !areFilesValid) {
      if (!isOptionValid) {
        setErrors((prevErrors) => ({ ...prevErrors, option: 'Please select an option.' }));
      }
      return; // Stop submission if validation fails
    }

    // Prepare form data
    const formData = new FormData();
    formData.append('file', file); // Append the main file
    formData.append('photo1', photo1); // Append the first photograph
    formData.append('photo2', photo2); // Append the second photograph
    formData.append('selectedOption', option);
    formData.append('userId', selectedItem.userId);
    formData.append('tds', selectedItem.tds);
    formData.append('id', selectedItem.id);
    formData.append('commission', selectedItem.commission);
    formData.append('netCommission', selectedItem.netCommission);
    formData.append('paymentStatus', selectedItem.paymentStatus);
    formData.append('transactionId', selectedItem.transactionId);
    formData.append('consumerNumber', selectedItem.canumber);
    formData.append('consumerName', selectedItem.consumerName);
    formData.append('paymentMode', selectedItem.paymentmode);
    formData.append('paymentAmount', selectedItem.paidamount);
    formData.append('createdOn', new Date(selectedItem.createdon).toISOString());
    const transactionId = selectedItem.transactionId;

    // Send the form data to the API
    try {
      const response = await axios.post('/api/v1/users/cancellation-details', formData,transactionId, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      console.log('Data sent successfully:', response.data);
      setShowSuccessModal(true); // Show success modal after successful submission
    } catch (error) {
      console.error('Error sending data:', error);
    }
  };

  // Close success modal and navigate back
  const closeModal = () => {
    setShowSuccessModal(false);
    navigate(-1); // Navigate back to the previous page
  };

  return (
    <CContainer className="p-4">
      <h2>Cancellation Details</h2>
      {selectedItem && (
        <form onSubmit={handleSubmit}>
          <p><strong>Transaction ID:</strong> {selectedItem.transactionId}</p>
          <p><strong>Consumer Number:</strong> {selectedItem.canumber}</p>
          <p><strong>Consumer Name:</strong> {selectedItem.consumerName}</p>
          <p><strong>Payment Mode:</strong> {selectedItem.paymentmode || 'N/A'}</p>
          <p><strong>Payment Amount:</strong> {selectedItem.paidamount || 'N/A'}</p>
          <p><strong>Payment Status:</strong> {selectedItem.paymentstatus || 'N/A'}</p>
          <p><strong>Posting Status:</strong> {selectedItem.billpoststatus || 'N/A'}</p>
          <p><strong>Tds:</strong> {selectedItem.tds || 'N/A'}</p>
          <p><strong>Net Commission:</strong> {selectedItem.netCommission || 'N/A'}</p>
          <p><strong>Created On:</strong> {new Date(selectedItem.createdon).toLocaleString() || 'N/A'}</p>

          {/* Option Dropdown */}
          <CRow className="mb-3">
            <CCol md={6}>
              <CFormLabel htmlFor="dropdownOptions">Select an Option</CFormLabel>
              <CFormSelect
                id="dropdownOptions"
                value={option}
                onChange={(e) => setOption(e.target.value)}
                onBlur={validateOption}
              >
                <option value="" hidden>Choose an option</option>
                <option value="option1">Option 1</option>
                <option value="option2">Option 2</option>
                <option value="option3">Option 3</option>
                <option value="option4">Option 4</option>
              </CFormSelect>
              {errors.option && <CFormText className="text-danger">{errors.option}</CFormText>}
            </CCol>
          </CRow>

          {/* Main File Upload */}
          <CRow className="mb-3">
            <CCol md={6}>
              <CFormLabel htmlFor="fileInput">Upload File</CFormLabel>
              <CFormInput
                type="file"
                id="fileInput"
                onChange={(e) => handleFileChange(e, setFile)}
              />
              {errors.file && <CFormText className="text-danger">{errors.file}</CFormText>}
            </CCol>
          </CRow>

          {/* First Photograph */}
          <CRow className="mb-3">
            <CCol md={6}>
              <CFormLabel htmlFor="photo1Input">Upload Photograph 1</CFormLabel>
              <CFormInput
                type="file"
                id="photo1Input"
                name="photo1"
                onChange={(e) => handleFileChange(e, setPhoto1)}
              />
              {errors.photo1 && <CFormText className="text-danger">{errors.photo1}</CFormText>}
            </CCol>
          </CRow>

          {/* Second Photograph */}
          <CRow className="mb-3">
            <CCol md={6}>
              <CFormLabel htmlFor="photo2Input">Upload Photograph 2</CFormLabel>
              <CFormInput
                type="file"
                id="photo2Input"
                name="photo2"
                onChange={(e) => handleFileChange(e, setPhoto2)}
              />
              {errors.photo2 && <CFormText className="text-danger">{errors.photo2}</CFormText>}
            </CCol>
          </CRow>

          {/* Submit Button */}
          <CButton color="primary" type="submit">Submit</CButton>
        </form>
      )}

      {/* Success Modal */}
      <CModal visible={showSuccessModal} onClose={closeModal}>
        <CModalHeader>
          <CModalTitle>Success</CModalTitle>
        </CModalHeader>
        <CModalBody>Your cancellation details were successfully submitted.</CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={closeModal}>Close</CButton>
        </CModalFooter>
      </CModal>
    </CContainer>
  );
};

export default CancellationDetails;
