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
  CButton
} from '@coreui/react';

const Profile = () => {
  const { userId } = useParams();

  console.log('User ID from useParams:', userId); 

  const [balance, setBalance] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
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

  const date = new Date();
  const month = date.toLocaleString('default', { month: 'long' });
  const year = date.getFullYear();

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
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
        <CButton color="primary" size="lg">
          Request Fund
        </CButton>
      </CCardFooter>
    </CCard>
  );
};

export default Profile;
