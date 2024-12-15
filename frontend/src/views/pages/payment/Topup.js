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
  CFormFeedback,
  CSpinner,
  CAlert,
} from '@coreui/react';
import axios from 'axios';

const Topup = () => {
  const [amount, setAmount] = useState('');
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [isScriptLoaded, setIsScriptLoaded] = useState(false);

  // Function to load the Ezetap script
  const loadEzetapScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = 'https://ezetap.com/sdk.js'; // Replace with the actual Ezetap SDK URL
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  useEffect(() => {
    const loadScript = async () => {
      const loaded = await loadEzetapScript();
      setIsScriptLoaded(loaded);
    };
    loadScript();
  }, []);

  // Validate amount input
  const validate = () => {
    const errors = {};
    if (!amount || isNaN(amount) || amount <= 0) {
      errors.amount = 'A valid amount is required.';
    }
    setErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Create Ezetap order
  const createEzetapOrder = async () => {
    if (!validate()) return;

    setLoading(true);
    const data = {
      amount: Number(amount), // Send amount as Ezetap expects
      currency: 'INR',
      customerName: "544514634",
      phone: "3451",
      checksum: "44635354",
    };

    try {
      const response = await axios.post('/api/v1/users/createOrder', data);
      if (response.data && response.data.orderId) {
        handleEzetapPayment(response.data); // Pass the order details to the payment handler
      } else {
        alert('Failed to create Ezetap order.');
      }
    } catch (error) {
      console.error('Error creating Ezetap order:', error);
      alert('An error occurred while creating the order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Handle Ezetap payment
  const handleEzetapPayment = (orderData) => {
    if (!isScriptLoaded) {
      alert('Ezetap SDK failed to load. Please refresh the page.');
      return;
    }

    // Example payment options for Ezetap SDK
    const options = {
      orderId: orderData.orderId, // Use the order ID from the backend
      amount: orderData.amount, // Amount in the appropriate format
      customerName: 'OrangePay',
      customerEmail: 'support@orangepay.com',
      onSuccess: (response) => {
        setSuccessMessage(`Payment successful! Transaction ID: ${response.transactionId}`);
        confirmEzetapPayment(response); // Confirm payment with the backend
      },
      onError: (error) => {
        console.error('Payment failed:', error);
        alert('Payment failed. Please try again.');
      },
    };

    // Ensure the EzetapPaymentGateway is available before calling open method
    if (window.EzetapPaymentGateway && window.EzetapPaymentGateway.open) {
      window.EzetapPaymentGateway.open(options); // Replace with Ezetap's actual SDK method
    } else {
      console.error('EzetapPaymentGateway is not available.');
      alert('EzetapPaymentGateway is not available. Please refresh the page.');
    }
  };

  // Confirm payment with the backend
  const confirmEzetapPayment = async (paymentResponse) => {
    try {
      const confirmation = await axios.post('/api/v1/ezetap/confirmPayment', paymentResponse); // Backend API for payment confirmation
      if (confirmation.data && confirmation.data.success) {
        alert('Payment confirmed successfully!');
      } else {
        alert('Payment confirmation failed.');
      }
    } catch (error) {
      console.error('Error confirming payment:', error);
      alert('An error occurred while confirming the payment.');
    }
  };

  return (
    <CContainer className="p-4">
      <CRow className="justify-content-center">
        <CCol md={6}>
          <CCard>
            <CCardHeader>
              <h5>Add Top-Up</h5>
            </CCardHeader>
            <CCardBody>
              <CFormLabel htmlFor="amount">Amount</CFormLabel>
              <CFormInput
                id="amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="Enter Amount"
                invalid={!!errors.amount}
              />
              {errors.amount && <CFormFeedback invalid>{errors.amount}</CFormFeedback>}

              <CButton
                color="primary"
                className="mt-3"
                onClick={createEzetapOrder}
                disabled={loading}
              >
                {loading ? <CSpinner size="sm" /> : 'Add Top-Up'}
              </CButton>

              {successMessage && (
                <CAlert color="success" className="mt-3">
                  {successMessage}
                </CAlert>
              )}
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
    </CContainer>
  );
};

export default Topup;
