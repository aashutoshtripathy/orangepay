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

  // Function to load the Razorpay script
  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  useEffect(() => {
    const loadScript = async () => {
      const loaded = await loadRazorpayScript();
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

  // Create Razorpay order
  const createRazorpayOrder = async () => {
    if (!validate()) return;

    setLoading(true);
    const data = {
      amount: Number(amount) * 100, // Razorpay requires amount in paise
      currency: 'INR',
    };

    try {
      const response = await axios.post('/api/v1/users/createOrder', data);
      if (response.data.id) {
        handleRazorpayScreen(response.data.amount);
      } else {
        alert('Failed to create Razorpay order.');
      }
    } catch (error) {
      console.error('Error creating order:', error);
      alert('An error occurred while creating the order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Open Razorpay payment screen
  const handleRazorpayScreen = (amount) => {
    if (!isScriptLoaded) {
      alert('Razorpay SDK failed to load. Please refresh the page.');
      return;
    }

    const options = {
      key: 'rzp_test_GcZZFDPP0jHtC4', // Replace with your Razorpay API key
      amount: amount, // Amount in paise
      currency: 'INR',
      name: 'OrangePay',
      description: 'Payment to OrangePay',
      handler: (response) => {
        setSuccessMessage('Payment successful! Transaction ID: ' + response.razorpay_payment_id);
      },
      prefill: {
        name: 'OrangePay',
        email: 'support@orangepay.com',
      },
      theme: {
        color: '#F4C430',
      },
    };

    const paymentObject = new window.Razorpay(options);
    paymentObject.open();
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
                onClick={createRazorpayOrder}
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
