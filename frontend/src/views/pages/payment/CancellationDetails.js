import React, { useState, useEffect } from 'react';
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
  
  // States for form data, file inputs, errors, and modal visibility
  const [option, setOption] = useState('');
  const [files, setFiles] = useState({ input1: "", input2: "", input3: "" });
  const [errors, setErrors] = useState({ option: '', files: { input1: '', input2: '', input3: '' } });
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  // Handle file selection for dynamic fields
  const handleFileChange = (e, field) => {
    const file = e.target.files[0];
    setFiles(prevFiles => ({
      ...prevFiles,
      [field]: file,
    }));
  };

  // Validate the selected option field
  const validateOption = () => {
    if (!option) {
      setErrors(prevErrors => ({ ...prevErrors, option: 'Please select an option.' }));
    } else {
      setErrors(prevErrors => ({ ...prevErrors, option: '' }));
    }
  };

  // Validate all file fields
  const validateFiles = () => {
    const newErrors = { input1: '', input2: '', input3: '' };
    Object.keys(files).forEach((key) => {
      if (!files[key]) {
        newErrors[key] = 'Please upload a file for this input.';
      }
    });
    setErrors(prevErrors => ({ ...prevErrors, files: newErrors }));
    return newErrors;
  };

  // Form submit handler
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate Option and Files
    const validationErrors = {}; 
    if (!option) validationErrors.option = 'Please select an option.';
    
    const fileErrors = validateFiles(); // Check for file upload errors
    if (Object.keys(validationErrors).length > 0 || Object.keys(fileErrors).length > 0) {
      setErrors(prevErrors => ({ ...prevErrors, ...validationErrors }));
      return; // If validation fails, stop the form submission
    }

    // Prepare form data
    const formData = new FormData();
    Object.keys(files).forEach((key) => {
      if (files[key]) {
        formData.append(key, files[key]);
      }
    });

    // Add selected options and other necessary fields
    formData.append('selectedOption', option);
    formData.append('userId', selectedItem.userId);
    formData.append('tds', selectedItem.tds);
    formData.append('id', selectedItem.id);
    formData.append('commission', selectedItem.commission);
    formData.append('netCommission', selectedItem.netCommission);
    formData.append('transactionId', selectedItem.transactionId);
    formData.append('consumerNumber', selectedItem.canumber);
    formData.append('consumerName', selectedItem.consumerName);
    formData.append('paymentMode', selectedItem.paymentmode);
    formData.append('paymentAmount', selectedItem.paidamount);
    formData.append('createdOn', new Date(selectedItem.createdon).toISOString());

    // Send the form data to the API
    try {
      const response = await axios.post('/api/v1/users/cancellation-details', formData, {
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

          {/* File Upload Inputs */}
          <CRow className="mb-3">
            <CCol md={6}>
              <CFormLabel htmlFor="inputField1">Input Field 1</CFormLabel>
              <CFormInput
                type="file"
                id="inputField1"
                onChange={(e) => handleFileChange(e, 'input1')}
              />
              {errors.files.input1 && <CFormText className="text-danger">{errors.files.input1}</CFormText>}
            </CCol>
            <CCol md={6}>
              <CFormLabel htmlFor="inputField2">Input Field 2</CFormLabel>
              <CFormInput
                type="file"
                id="inputField2"
                onChange={(e) => handleFileChange(e, 'input2')}
              />
              {errors.files.input2 && <CFormText className="text-danger">{errors.files.input2}</CFormText>}
            </CCol>
          </CRow>

          <CRow className="mb-3">
            <CCol md={6}>
              <CFormLabel htmlFor="inputField3">Input Field 3</CFormLabel>
              <CFormInput
                type="file"
                id="inputField3"
                onChange={(e) => handleFileChange(e, 'input3')}
              />
              {errors.files.input3 && <CFormText className="text-danger">{errors.files.input3}</CFormText>}
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
        <CModalBody>
          Cancellation has been successfully done.
        </CModalBody>
        <CModalFooter>
          <CButton color="primary" onClick={closeModal}>OK</CButton>
        </CModalFooter>
      </CModal>
    </CContainer>
  );
};

export default CancellationDetails;
