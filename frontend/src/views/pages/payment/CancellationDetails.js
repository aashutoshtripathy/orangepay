import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import {
  CContainer,
  CRow,
  CCol,
  CFormLabel,
  CFormSelect,
  CFormInput,
  CButton,
  CFormText
} from '@coreui/react';

const CancellationDetails = () => {
  const location = useLocation();
  const { selectedItem } = location.state || {};
  const [option, setOption] = useState('');
  const [files, setFiles] = useState({ input1: null, input2: null, input3: null });
  const [errors, setErrors] = useState({ option: '', files: { input1: '', input2: '', input3: '' } });

  const handleFileChange = (e, inputName) => {
    const file = e.target.files[0];
    setFiles((prevFiles) => ({
      ...prevFiles,
      [inputName]: file,
    }));
  };
  




  const validateOption = () => {
    if (!option) {
      setErrors((prevErrors) => ({ ...prevErrors, option: 'Please select an option.' }));
    } else {
      setErrors((prevErrors) => ({ ...prevErrors, option: '' }));
    }
  };

  const validateFiles = () => {
    const newErrors = { input1: '', input2: '', input3: '' }; // Initialize with keys
    Object.keys(files).forEach((key) => {
      if (!files[key]) {
        newErrors[key] = 'Please upload a file for this input.';
      }
    });
    
    console.log("File errors:", newErrors); // Log file errors
    setErrors((prevErrors) => ({ ...prevErrors, files: newErrors }));
    return newErrors;
  };
  


  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Form submitted");
  
    const validationErrors = {};
    if (!option) validationErrors.option = 'Please select an option.';
    const fileErrors = validateFiles();
  
    console.log("Validation errors:", validationErrors); // Log validation errors
    console.log("File errors:", fileErrors); // Log file errors
  
    // if (Object.keys(validationErrors).length > 0 || Object.keys(fileErrors).length > 0) {
    //       console.log("Validation failed, returning early.");
    //   setErrors((prevErrors) => ({ ...prevErrors, ...validationErrors }));
    //   return;
    // }

    const formData = new FormData();
    Object.keys(files).forEach((key) => {
      if (files[key]) {
        formData.append(key, files[key]); // Append the files dynamically
      }
    });
    
    formData.append('selectedOption', option);
    formData.append('userId', selectedItem.userId);
    formData.append('transactionId', selectedItem.transactionId);
    formData.append('consumerNumber', selectedItem.canumber);
    formData.append('consumerName', selectedItem.consumerName);
    formData.append('paymentMode', selectedItem.paymentmode || 'N/A');
    formData.append('paymentAmount', selectedItem.paidamount || 'N/A');
    formData.append('paymentStatus', selectedItem.paymentstatus || 'N/A');
    formData.append('createdOn', new Date(selectedItem.createdon).toISOString());

    try {
      console.log("Sending data:", Array.from(formData.entries()));
      const response = await axios.post('/cancellation-details', formData);
      console.log('Data sent successfully:', response.data);
    } catch (error) {
      console.error('Error sending data:', error);
    }
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
          <p><strong>Tds:</strong> {selectedItem.tds || 'N/A'}</p>
          <p><strong>Net Comission:</strong> {selectedItem.netCommission || 'N/A'}</p>
          <p><strong>Created On:</strong> {new Date(selectedItem.createdon).toLocaleString() || 'N/A'}</p>

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

          <CButton color="primary" type="submit">Submit</CButton>
        </form>
      )}
    </CContainer>
  );
};

export default CancellationDetails;
