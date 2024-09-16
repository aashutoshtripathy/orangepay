import React, { useState, useEffect } from 'react';
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
  CModal,
  CModalHeader,
  CModalBody,
  CModalFooter,
} from '@coreui/react';

const Payment = () => {
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('');
  const [consumerId, setConsumerId] = useState('');
  const [meterId, setMeterId] = useState('');
  const [amount, setAmount] = useState('');
  const [userId, setUserId] = useState('');
  const [errors, setErrors] = useState({});
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [transactionId, setTransactionId] = useState('');
  const [formSubmitted, setFormSubmitted] = useState(false); // New state to track form submission
  const [focusedField, setFocusedField] = useState(''); // New state to track the focused field

  useEffect(() => {
    const storedUserId = localStorage.getItem('userId');
    if (storedUserId) {
      setUserId(storedUserId);
    }
  }, []);

  const validate = () => {
    const errors = {};
    if (!consumerId && !meterId) errors.id = 'Either Consumer ID or Meter ID must be provided.';
    if (!amount || isNaN(amount) || amount <= 0) errors.amount = 'A valid amount is required.';
    if (!selectedPaymentMethod) errors.paymentMethod = 'Please select a payment method.';
    setErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handlePaymentSelection = (method) => {
    setSelectedPaymentMethod(method);
    console.log(`Selected Payment Method: ${method}`);
  };

  const handleAmountButtonClick = (value) => {
    setAmount(value);
  };

  const handleProceedToPay = async () => {
    setFormSubmitted(true); // Set formSubmitted to true when the user attempts to submit

    if (!validate()) return;

    try {
      const response = await fetch('/payment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          consumerId: consumerId || '',
          meterId: meterId || '',
          amount,
          paymentMethod: selectedPaymentMethod,
        }),
      });

      const data = await response.json();
      console.log("Response data:", data);

      if (response.ok && data.success) {
        setTransactionId(data.data.transactionId);
        setShowSuccessModal(true);
        setConsumerId('');
        setMeterId('');
        setAmount('');
        setSelectedPaymentMethod('');
        setErrors({}); 
      } else {
        console.error(`Error from backend: ${data.message}`);
        alert(`Error: ${data.message}`);
      }
    } catch (error) {
      console.error('Error processing payment:', error);
      alert('An error occurred while processing the payment.');
    }
  };

  const handleCloseModal = () => {
    setShowSuccessModal(false);
  };

  const handleBlur = (field) => {
    if (errors[field]) {
      setErrors(prevErrors => {
        const { [field]: _, ...rest } = prevErrors;
        return rest;
      });
    }
    setFocusedField('');
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
                onFocus={() => setFocusedField('consumerId')}
                onBlur={() => handleBlur('id')}
                placeholder="Enter Consumer ID"
              />
              {(formSubmitted && errors.id && !meterId) && <p className="text-danger">{errors.id}</p>}
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
                onFocus={() => setFocusedField('meterId')}
                onBlur={() => handleBlur('id')}
                placeholder="Enter Meter ID"
              />
              {(formSubmitted && errors.id && !consumerId) && <p className="text-danger">{errors.id}</p>}
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
                onFocus={() => setFocusedField('amount')}
                onBlur={() => handleBlur('amount')}
                placeholder="Enter or select amount"
              />
              {(formSubmitted && errors.amount) && <p className="text-danger">{errors.amount}</p>}
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

           <CRow className="mb-3">
            <CCol md={8} lg={6}>
              <CCard>
                <CCardHeader>Select Payment Method</CCardHeader>
                <CCardBody>
                  <CRow>
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
                  {errors.paymentMethod && <p className="text-danger mt-2">{errors.paymentMethod}</p>}
                </CCardBody>
              </CCard>
            </CCol>
          </CRow>

          
          {/* Proceed to Pay Button */}
          <CButton color="primary" onClick={handleProceedToPay}>
            Proceed to Pay
          </CButton>
        </CCardBody>
      </CCard>

      {/* Success Modal */}
      <CModal visible={showSuccessModal} onClose={handleCloseModal}>
        <CModalHeader>Payment Successful</CModalHeader>
        <CModalBody>
          <p>Your payment was processed successfully!</p>
          <p>Transaction ID: {transactionId}</p>
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={handleCloseModal}>
            Close
          </CButton>
        </CModalFooter>
      </CModal>
    </CContainer>
  );
};

export default Payment;
