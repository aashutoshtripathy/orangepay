import React, { useState , useEffect } from 'react';
import {
  CContainer,
  CRow,
  CCol,
  CButton,
  CFormCheck,
  CCard,
  CCardHeader,
  CCardBody,
  CFormInput,
  CFormLabel,
} from '@coreui/react';

const Payment = () => {
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('');
  const [consumerId, setConsumerId] = useState('');
  const [meterId, setMeterId] = useState('');
  const [amount, setAmount] = useState('');
  const [userId, setUserId] = useState(''); // Initialize userId with useState

  useEffect(() => {
    // Fetch userId from localStorage when the component mounts
    const storedUserId = localStorage.getItem('userId');
    if (storedUserId) {
      setUserId(storedUserId);
    }
  }, []);




  const handlePaymentSelection = (method) => {
    setSelectedPaymentMethod(method);
    console.log(`Selected Payment Method: ${method}`);
  };

  const handleAmountButtonClick = (value) => {
    setAmount(value);
  };



  const handleProceedToPay = async () => {
    try {
      const response = await fetch('/payment', { // Ensure the correct API endpoint is used
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          consumerId,
          meterId,
          amount,
          paymentMethod: selectedPaymentMethod,
        }),
      });
  
      const data = await response.json();
      console.log("Response data:", data); // Log the response data for debugging
  
      if (response.ok && data.success) {
        alert(`Payment processed successfully: Transaction ID - ${data.data.transactionId}`);
      } else {
        console.error(`Error from backend: ${data.message}`);
        alert(`Error: ${data.message}`);
      }
    } catch (error) {
      console.error('Error processing payment:', error);
      alert('An error occurred while processing the payment.');
    }
  };
  
  
  
  

  return (
    <CContainer className="p-4">
      <CCard>
        <CCardHeader>
          <h2>Payment Information</h2>
        </CCardHeader>
        <CCardBody>
          {/* Consumer ID Field */}
          <CRow className="mb-3">
            <CCol md={6}>
              <CFormLabel htmlFor="consumerId">Consumer ID</CFormLabel>
              <CFormInput
                type="text"
                id="consumerId"
                value={consumerId}
                onChange={(e) => setConsumerId(e.target.value)}
                placeholder="Enter Consumer ID"
              />
            </CCol>
          </CRow>

          {/* Meter ID Field */}
          <CRow className="mb-3">
            <CCol md={6}>
              <CFormLabel htmlFor="meterId">Meter ID</CFormLabel>
              <CFormInput
                type="text"
                id="meterId"
                value={meterId}
                onChange={(e) => setMeterId(e.target.value)}
                placeholder="Enter Meter ID"
              />
            </CCol>
          </CRow>

          {/* Amount Field with Static Values */}
          <CRow className="mb-3">
            <CCol md={6}>
              <CFormLabel htmlFor="amount">Amount</CFormLabel>
              <CFormInput
                type="number"
                id="amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="Enter or select amount"
              />
              <div className="mt-2">
                {/* Static Value Buttons */}
                {[100, 500, 1000, 2000].map((value) => (
                  <CButton
                    key={value}
                    color="secondary"
                    className="me-2 mt-1"
                    onClick={() => handleAmountButtonClick(value)}
                  >
                    {value}
                  </CButton>
                ))}
              </div>
            </CCol>
          </CRow>

          {/* Payment Method Options */}
          <CRow className="mb-3">
            <CCol>
              <CFormCheck
                type="radio"
                name="paymentMethod"
                id="cash"
                label="Cash"
                onChange={() => handlePaymentSelection('cash')}
                checked={selectedPaymentMethod === 'cash'}
              />
            </CCol>
            <CCol>
              <CFormCheck
                type="radio"
                name="paymentMethod"
                id="ezytap"
                label="Ezetap"
                onChange={() => handlePaymentSelection('ezytap')}
                checked={selectedPaymentMethod === 'ezytap'}
              />
            </CCol>
            <CCol>
              <CFormCheck
                type="radio"
                name="paymentMethod"
                id="ccard"
                label="Card"
                onChange={() => handlePaymentSelection('ccard')}
                checked={selectedPaymentMethod === 'ccard'}
              />
            </CCol>
          </CRow>

          {/* Proceed to Pay Button */}
          <CButton color="primary" onClick={handleProceedToPay}>
            Proceed to Pay
          </CButton>
        </CCardBody>
      </CCard>
    </CContainer>
  );
};

export default Payment;
