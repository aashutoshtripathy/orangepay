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
  CModalBody,
  CModalFooter,
  CFormSelect,
  CSpinner,
  CAlert,
  CFormFeedback,
} from '@coreui/react';
import axios from 'axios';
import useRazorpay from 'react-razorpay';

const Topup = () => {
  const [Razorpay, isLoaded] = useRazorpay();
  const [consumerId, setConsumerId] = useState('');
  const [billDetails, setBillDetails] = useState({});
  const [mobileNumber, setMobileNumber] = useState('');
  const [amount, setAmount] = useState(''); // Change to string to capture input
  const [userId, setUserId] = useState('');
  const [errors, setErrors] = useState({});
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };
  
    const [isScriptLoaded, setIsScriptLoaded] = useState(false);
  
    useEffect(() => {
      const loadScript = async () => {
        const loaded = await loadRazorpayScript();
        setIsScriptLoaded(loaded);
      };
      loadScript();
    }, []);
  

  useEffect(() => {
    const storedUserId = localStorage.getItem('userId');
    if (storedUserId) {
      setUserId(storedUserId);
    }
  }, []);

  const validate = () => {
    const errors = {};
    if (!amount || isNaN(amount) || amount <= 0) errors.amount = 'A valid amount is required.';
    setErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const createRazorpayOrder = async () => {
    if (!validate()) return; // Validate before creating order

    const data = {
      amount: Number(amount) * 100, // Razorpay requires amount in paise
      currency: "INR",
    };

    try {
      const response = await axios.post("/api/v1/users/ezetap", data);
      if (response.data.id) {
        handleRazorpayScreen(response.data.amount);
      } else {
        alert('Failed to create Razorpay order');
      }
    } catch (error) {
      console.error('Error creating order:', error);
      alert('An error occurred while creating the order. Please try again.');
    }
  };

  const handleRazorpayScreen = async (amount) => {
    if (!isScriptLoaded) {
      alert('Razorpay SDK failed to load. Please refresh the page.');
      return;
    }

    const options = {
      key: 'rzp_test_GcZZFDPP0jHtC4', // Replace with your Razorpay API key
      amount: amount, // Amount in paise
      currency: 'INR',
      name: "OrangePay",
      description: "Payment to OrangePay",
      handler: function (response) {
        console.log('Payment Successful:', response);
        setSuccessMessage('Payment successful! Transaction ID: ' + response.razorpay_payment_id);
      },
      prefill: {
        name: "OrangePay",
        email: "OrangePay@gmail.com",
      },
      theme: {
        color: "#F4C430",
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
              <h5>Add TopUp</h5>
            </CCardHeader>
            <CCardBody>
              <CFormLabel htmlFor="amount">Amount</CFormLabel>
              <CFormInput
              style={{width:"100%"}}
                type="number"
                id="amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)} 
                placeholder="Enter Amount"
                invalid={formSubmitted && !!errors.amount}
              />
              {formSubmitted && errors.amount && (
                <CFormFeedback invalid>{errors.amount}</CFormFeedback>
              )}

              <CButton color="primary" onClick={createRazorpayOrder} disabled={loading} className="mt-3">
                {loading ? <CSpinner size="sm" /> : 'Add TopUp'}
              </CButton>

              {/* Success message */}
              {successMessage && <CAlert color="success" className="mt-3">{successMessage}</CAlert>}
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
    </CContainer>
  );
};

export default Topup;
