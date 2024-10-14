import React, { useState, useEffect } from 'react';
import {
  CContainer,
  CRow,
  CCol,
  CButton,
  CCard,
  CCardHeader,
  CCardBody,
  CFormInput,
  CFormLabel,
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
} from '@coreui/react'; 
import axios from 'axios';
import { useNavigate } from 'react-router-dom';


const Cancelation = () => {
  const [consumerId, setConsumerId] = useState('');
  const [errors, setErrors] = useState({});
  const [userId, setUserId] = useState({});
  
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [fetchBillSuccess, setFetchBillSuccess] = useState(false);
  const [cancellationData, setCancellationData] = useState(null);
  const [fetchError, setFetchError] = useState('');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  const navigate = useNavigate();



  useEffect(() => {
    const storedUserId = localStorage.getItem('userId');
    if (storedUserId) {
      setUserId(storedUserId);
    }
  }, []);

  const validate = () => {
    const errors = {};
    if (!consumerId) errors.consumerId = 'Consumer ID is required.';
    setErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleFetchBill = async () => {
    setFormSubmitted(true);
    setFetchError(''); // Reset error state on new search
  
    if (!validate()) return;
  
    try {
      const response = await axios.post('/get-cancellation', {
        consumerId,
        userId
      });
  
      if (response.status === 200) {
        if (response.data && response.data.length > 0) {
          setCancellationData(response.data);
          setFetchBillSuccess(true);
          setConsumerId('');
          setErrors({});
        } else {
          setFetchError('No records found.'); // Set error message for no records
        }
      }
    } catch (error) {
      console.error('Error fetching cancellation:', error);
      setFetchError('No records found.'); // Set error message for failed API call
    }
  };

  const handleCardClick = (item) => {
    if (item.paymentmode === 'wallet') {
      setSelectedItem(item); // Save the selected item
      navigate('/request-cancelation-details', { state: { selectedItem: item } }); 
    }
  };

  const closeModal = () => {
    setIsModalVisible(false);
    setSelectedItem(null); // Clear the selected item
  };
  

  return (
    <CContainer className="p-4">
      <CCard>
        <CCardHeader>
          <h2>Transaction Reversal Request</h2>
        </CCardHeader>

        <CCardBody>
          {!fetchBillSuccess && (
            <>
              <CRow className="mb-3">
                <CCol md={6}>
                  <CFormLabel htmlFor="consumerId">Enter Consumer Number</CFormLabel>
                  <CFormInput
                    type="text"
                    id="consumerId"
                    value={consumerId}
                    onChange={(e) => setConsumerId(e.target.value)}
                    placeholder="Enter Consumer Number"
                  />
                  {formSubmitted && errors.consumerId && <p className="text-danger">{errors.consumerId}</p>}
                </CCol>
              </CRow>

              <CButton color="primary" onClick={handleFetchBill}>
                Search
              </CButton>
            </>
          )}

{fetchError && <p className="text-danger">{fetchError}</p>} 

          {fetchBillSuccess && (
            <>
              
              <p><strong>Consumer Number:</strong> {cancellationData[0].canumber || 'N/A'}</p>

              <CRow className="mt-4">
                {cancellationData.map((item) => (
                  <CCol md={6} key={item._id}>
<CCard onClick={() => handleCardClick(item)} style={{ cursor: 'pointer' }}>
                      <CCardHeader>
                        <h5>Cancellation Details</h5>
                      </CCardHeader>
                      <CCardBody>
                        <p><strong>Transaction ID:</strong> {item.transactionId || 'N/A'}</p>
                        <p><strong>Consumer Number:</strong> {item.canumber || 'N/A'}</p>
                        <p><strong>Consumer Name:</strong> {item.consumerName || 'N/A'}</p>
                        <p><strong>Payment Mode:</strong> {item.paymentmode || 'N/A'}</p>
                        <p><strong>Payment Amount:</strong> {item.paidamount || 'N/A'}</p>
                        <p><strong>Payment Status:</strong> {item.paymentstatus || 'N/A'}</p>
                        <p><strong>Created On:</strong> {new Date(item.createdon).toLocaleString() || 'N/A'}</p>
                        {/* Add more fields as necessary */}
                      </CCardBody>
                    </CCard>
                  </CCol>
                ))}
              </CRow>
            </>
          )}
          
        </CCardBody>
      </CCard>
      <CModal visible={isModalVisible} onClose={closeModal}>
        <CModalHeader>
          <CModalTitle>Payment Details</CModalTitle>
        </CModalHeader>
        <CModalBody>
          {selectedItem && (
            <>
              <p><strong>Transaction ID:</strong> {selectedItem.transactionId}</p>
              <p><strong>Consumer Number:</strong> {selectedItem.canumber}</p>
              <p><strong>Consumer Name:</strong> {selectedItem.consumerName}</p>
              <p><strong>Payment Mode:</strong> {selectedItem.paymentmode}</p>
              <p><strong>Payment Amount:</strong> {selectedItem.paidamount}</p>
              <p><strong>Payment Status:</strong> {selectedItem.paymentstatus}</p>
              <p><strong>Created On:</strong> {new Date(selectedItem.createdon).toLocaleString()}</p>
            </>
          )}
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={closeModal}>Cancel Payment</CButton>
        </CModalFooter>
      </CModal>
    </CContainer>
  );
};

export default Cancelation;
