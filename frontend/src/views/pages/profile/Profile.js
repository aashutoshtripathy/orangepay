import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import {
  CCard,
  CCardBody,
  CCardHeader,
  CCardFooter,
  CRow,
  CCol,
  CButton,
  CModal,
  CModalHeader,
  CModalBody,
  CModalFooter,
  CFormLabel,
  CFormInput,
  CFormSelect
} from '@coreui/react';

const Profile = () => {
  const { userId } = useParams();

  console.log('User ID from useParams:', userId);

  const [balance, setBalance] = useState(null);
  const [loading, setLoading] = useState(true); // Changed default value to true
  const [error, setError] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [fundAmount, setFundAmount] = useState('');
  const [bankReference, setBankReference] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('');
  const [errors, setErrors] = useState({}); // State for validation errors
  const userName = 'Test';
  const availableBalance = '$10,000';

  useEffect(() => {
    if (!userId) {
      console.error('Invalid userId format:', userId);
      return;
    }

    const fetchBalance = async () => {
      try {
        const response = await axios.get(`/balance/${userId}`);
        setBalance(response.data.balance);
      } catch (err) {
        console.error('Error fetching balance:', err);
        setError('Failed to fetch balance');
      } finally {
        setLoading(false);
      }
    };

    fetchBalance();
  }, [userId]);

  const handleRequestFund = async (e) => {
    e.preventDefault();
    const newErrors = {};

    // Validate each field
    if (!fundAmount) newErrors.fundAmount = 'Amount is required';
    if (!bankReference) newErrors.bankReference = 'Bank Reference Number is required';
    if (!paymentMethod) newErrors.paymentMethod = 'Payment Method is required';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors); // Set errors if validation fails
      return;
    }

    try {
      console.log('Sending fund request:', {
        userId,
        fundAmount,
        bankReference,
        paymentMethod,
      });

      const response = await axios.post('/fund-request', {
        userId,
        fundAmount,
        bankReference,
        paymentMethod,
      });

      console.log('Response from server:', response);

      // Clear the states
      setFundAmount('');
      setBankReference('');
      setPaymentMethod('');
      setModalVisible(false);

    } catch (error) {
      console.error('Error requesting fund:', error);
      setError('Failed to request fund');
    }
  };

  const handleInputChange = (e) => {
    const { id, value } = e.target;

    // Update state based on field id
    if (id === 'fund-amount') setFundAmount(value);
    if (id === 'bank-reference') setBankReference(value);
    if (id === 'payment-method') setPaymentMethod(value);

    // Clear errors for the specific field
    setErrors((prevErrors) => ({
      ...prevErrors,
      [id]: ''
    }));
  };

  const handleInputFocus = (e) => {
    const { id } = e.target;
    setErrors((prevErrors) => ({
      ...prevErrors,
      [id]: ''
    }));
  };

  const date = new Date();
  const month = date.toLocaleString('default', { month: 'long' });
  const year = date.getFullYear();

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <>
      <CCard className="mb-4">
        <CCardHeader>
          <h4>Profile</h4>
        </CCardHeader>
        <CCardBody>
          <CRow className="justify-content-center">
            <CCol sm={6} className="text-center ">
              <h5>Account ID : {userName}</h5>
              <h5>Agency Firm Name : {userName}</h5>
              <h5>Registered Name: {userName}</h5>
              <h5>Registered E-Mail ID : {userName}</h5>
              <h5>Registered Mobile No. : {userName}</h5>
            </CCol>
            <CCol sm={6} className="text-center mt-4">
              <h5>Available Balance : {balance}</h5>
              <h5>Margin ({month} {year}) : {availableBalance}</h5>
            </CCol>
          </CRow>
        </CCardBody>
        <CCardFooter className="text-center">
          <CButton color="success" size="lg" className="me-3">
            Get Android App
          </CButton>
          <CButton color="primary" size="lg" onClick={() => setModalVisible(true)}>
            Request Fund
          </CButton>
        </CCardFooter>
      </CCard>

      <CModal visible={modalVisible} onClose={() => setModalVisible(false)}>
        <CModalHeader closeButton>
          <h5>Request Fund</h5>
        </CModalHeader>
        <CModalBody>
          <form onSubmit={handleRequestFund}>
            <CFormLabel htmlFor="fund-amount">Amount</CFormLabel>
            <CFormInput
              name="fundAmount"
              id="fund-amount"
              type="number"
              value={fundAmount}
              onChange={handleInputChange}
              onFocus={handleInputFocus}
            />
            {errors.fundAmount && <div className="text-danger">{errors.fundAmount}</div>}

            <CFormLabel htmlFor="bank-reference" className="mt-3">Bank Reference Number</CFormLabel>
            <CFormInput
              name="bankReference"
              id="bank-reference"
              type="text"
              value={bankReference}
              onChange={handleInputChange}
              onFocus={handleInputFocus}
            />
            {errors.bankReference && <div className="text-danger">{errors.bankReference}</div>}

            <CFormLabel htmlFor="payment-method" className="mt-3">Payment Method</CFormLabel>
            <CFormSelect
              name="paymentMethod"
              id="payment-method"
              value={paymentMethod}
              onChange={handleInputChange}
              onFocus={handleInputFocus}
            >
              <option value="">Select Payment Method</option>
              <option value="bank-transfer">Bank Transfer</option>
              <option value="upi">UPI</option>
              <option value="card">Card</option>
              <option value="paypal">PayPal</option>
              <option value="net-banking">Net Banking</option>
              {/* Add more payment methods as necessary */}
            </CFormSelect>
            {errors.paymentMethod && <div className="text-danger">{errors.paymentMethod}</div>}

            <CModalFooter>
              <CButton color="secondary" type="button" onClick={() => setModalVisible(false)}>
                Cancel
              </CButton>
              <CButton color="primary" type="submit">
                Request Fund
              </CButton>
            </CModalFooter>
          </form>
        </CModalBody>
      </CModal>
    </>
  );
};

export default Profile;
