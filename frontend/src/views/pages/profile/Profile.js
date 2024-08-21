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
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [fundAmount, setFundAmount] = useState('');
  const [bankReference, setBankReference] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('');
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
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchBalance();
  }, [userId]);



  const handleRequestFund = async () => {
    try {
      console.log('Fund requested:', {
        amount: fundAmount,
        bankReference,
        paymentMethod,
      });

      // Optionally, make an API request to handle the fund request
      // await axios.post('/request-fund', { userId, amount: fundAmount, bankReference, paymentMethod });

      // Clear the states
      setFundAmount('');
      setBankReference('');
      setPaymentMethod('');

    } catch (error) {
      console.error('Error requesting fund:', error);
    } finally {
      // Close the modal
      setModalVisible(false);
    }
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


    <CModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
      >
        <CModalHeader closeButton>
          <h5>Request Fund</h5>
        </CModalHeader>
        <CModalBody>
          <CFormLabel htmlFor="fund-amount">Amount</CFormLabel>
          <CFormInput
            id="fund-amount"
            type="number"
            value={fundAmount}
            onChange={(e) => setFundAmount(e.target.value)}
          />

          <CFormLabel htmlFor="bank-reference" className="mt-3">Bank Reference Number</CFormLabel>
          <CFormInput
            id="bank-reference"
            type="text"
            value={bankReference}
            onChange={(e) => setBankReference(e.target.value)}
          />

          <CFormLabel htmlFor="payment-method" className="mt-3">Payment Method</CFormLabel>
          <CFormSelect
            id="payment-method"
            value={paymentMethod}
            onChange={(e) => setPaymentMethod(e.target.value)}
          >
            <option value="">Select Payment Method</option>
            <option value="bank-transfer">Bank Transfer</option>
            <option value="upi">UPI</option>
            <option value="card">Card</option>
            <option value="paypal">PayPal</option>
            <option value="net-banking">Net Banking</option>
            {/* Add more payment methods as necessary */}
          </CFormSelect>
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setModalVisible(false)}>
            Cancel
          </CButton>
          <CButton color="primary" onClick={handleRequestFund}>
            Request Fund
          </CButton>
        </CModalFooter>
      </CModal>


        
        </>
  );
};

export default Profile;
