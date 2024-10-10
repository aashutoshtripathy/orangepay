import React, { useEffect, useState } from 'react';
import { CCard, CCardBody, CCardHeader, CForm, CFormCheck, CFormInput, CButton } from '@coreui/react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';

const Permission = () => {
  const [selectedOptions, setSelectedOptions] = useState({
    topup: false,
    billPayment: false,
    requestCancellation: false,
    getPrepaidBalance: false,
    fundRequest: false,
  });

  const [fundRequestMethods, setFundRequestMethods] = useState({
    bankTransfer: false,
    upi: false,
    cash: false,
    cdm: false,
  });

  const [billPaymentMethods, setBillPaymentMethods] = useState({
    wallet: false,
    ezetap: false,
    upiQr: false,
    rrn: false,
  });

  const [commission, setCommission] = useState(''); // State for commission

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  //   const userId = localStorage.getItem('userId');
  const naviagte = useNavigate();
  const { userId } = useParams(); // Get userId from URL using useParams


  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`/fetchUserList/${userId}`);
        const result = response.data.fetchUser || {};

        // Map the API response to checkbox states
        setSelectedOptions({
          topup: result.topup || false,
          billPayment: result.billPayment || false,
          requestCancellation: result.requestCancellation || false,
          getPrepaidBalance: result.getPrepaidBalance || false,
          fundRequest: result.fundRequest || false,
        });

        setFundRequestMethods({
          bankTransfer: result.bankTransfer || false,
          upi: result.upi || false,
          cash: result.cash || false,
          cdm: result.cdm || false,
        });
  
        setBillPaymentMethods({
          wallet: result.wallet || false,
          ezetap: result.ezetap || false,
          upiQr: result.upiQr || false,
          rrn: result.rrn || false,
        });

        
        setCommission(result.margin || '0');
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [userId]);

  const handleCommissionChange = (e) => {
    setCommission(e.target.value);
  };

  const handleCheckboxChange = (e) => {
    setSelectedOptions({
      ...selectedOptions,
      [e.target.name]: e.target.checked,
    });
  };



  const handleMethodChange = (e, methodType) => {
    if (methodType === 'fundRequest') {
      setFundRequestMethods({
        ...fundRequestMethods,
        [e.target.name]: e.target.checked,
      });
    } else if (methodType === 'billPayment') {
      setBillPaymentMethods({
        ...billPaymentMethods,
        [e.target.name]: e.target.checked,
      });
    }
  };




  const handleUpdate = async () => {
    // const { userId } = useParams();

    try {
      const updateData = {
        ...selectedOptions,
        ...fundRequestMethods,
        ...billPaymentMethods,
      };
      const response = await axios.put(`/updateUserPermissions/${userId}`, updateData);

      if (response.data.success) {
        console.log('Permissions updated successfully:', response.data.updatedUser);
        naviagte(`/view-user`)
        // You might want to show a success message or update the UI accordingly
      } else {
        console.error('Update failed:', response.data.message);
      }
    } catch (error) {
      console.error('Error updating permissions:', error);
    }
  };

  const handleUpdateCommission = async () => {
    // Prepare the data to be sent to the backend for commission only
    const updatedData = { commission };

    try {
      const response = await axios.put(`/updateCommission/${userId}`, updatedData);
      
      if (response.data.success) {
        console.log('Commission updated successfully:', response.data.updatedUser);
        naviagte(`/view-user`);
      } else {
        console.error('Commission update failed:', response.data.message);
      }
    } catch (error) {
      console.error('Error updating commission:', error);
    }
  };

  return (
    <CCard className="mb-4">
      <CCardHeader>Update Options</CCardHeader>
      <CCardBody>
        <CForm>
          {/* Checkbox Group */}
          <CFormCheck
            id="topup"
            name="topup"
            label="TopUp"
            checked={selectedOptions.topup}
            onChange={handleCheckboxChange}
          />
          <CFormCheck
            id="billPayment"
            name="billPayment"
            label="Bill Payment"
            checked={selectedOptions.billPayment}
            onChange={handleCheckboxChange}
          />
          <CFormCheck
            id="getPrepaidBalance"
            name="getPrepaidBalance"
            label="Prepaid Balance"
            checked={selectedOptions.getPrepaidBalance}
            onChange={handleCheckboxChange}
          />
          <CFormCheck
            id="requestCancellation"
            name="requestCancellation"
            label="Request Cancellation"
            checked={selectedOptions.requestCancellation}
            onChange={handleCheckboxChange}
          />
          <CFormCheck
            id="fundRequest"
            name="fundRequest"
            label="Fund Request"
            checked={selectedOptions.fundRequest}
            onChange={handleCheckboxChange}
          />

          {/* Update Button */}
          <CButton color="primary" onClick={handleUpdate}>
            Update
          </CButton>
        </CForm>


        <hr />

          <h5>Fund Request Method</h5>
          <CForm>

          <CFormCheck
            id="bankTransfer"
            name="bankTransfer"
            label="Bank Transfer"
            checked={fundRequestMethods.bankTransfer}
            onChange={(e) => handleMethodChange(e, 'fundRequest')}
          />
          <CFormCheck
            id="upi"
            name="upi"
            label="Upi"
            checked={fundRequestMethods.upi}
            onChange={(e) => handleMethodChange(e, 'fundRequest')}
          />
          <CFormCheck
            id="cash"
            name="cash"
            label="Cash"
            checked={fundRequestMethods.cash}
            onChange={(e) => handleMethodChange(e, 'fundRequest')}
          />
          <CFormCheck
            id="cdm"
            name="cdm"
            label="Cdm"
            checked={fundRequestMethods.cdm}
            onChange={(e) => handleMethodChange(e, 'fundRequest')}
          />
             <CButton color="primary" onClick={handleUpdate}>
            Update
          </CButton>

          {/* Bill Payment Method */}
          <hr />
          <h5>Bill Payment Method</h5>
          <CFormCheck
            id="wallet"
            name="wallet"
            label="Wallet"
            checked={billPaymentMethods.wallet}
            onChange={(e) => handleMethodChange(e, 'billPayment')}
          />
          <CFormCheck
            id="ezetap"
            name="ezetap"
            label="Ezetap"
            checked={billPaymentMethods.ezetap}
            onChange={(e) => handleMethodChange(e, 'billPayment')}
          />
          <CFormCheck
            id="upiQr"
            name="upiQr"
            label="UPI-QR"
            checked={billPaymentMethods.upiQr}
            onChange={(e) => handleMethodChange(e, 'billPayment')}
          />
          <CFormCheck
            id="rrn"
            name="rrn"
            label="RRN"
            checked={billPaymentMethods.rrn}
            onChange={(e) => handleMethodChange(e, 'billPayment')}
          />

          {/* Update Button */}
          <CButton color="primary" onClick={handleUpdate}>
            Update
          </CButton>
        </CForm>

        <hr />

        {/* Commission Update Section */}
        <h5>Update Commission</h5>
        <CForm>
          {/* Input field for commission */}
          <CFormInput
            type="number"
            id="commission"
            name="commission"
            label="Commission"
            value={commission}
            onChange={handleCommissionChange}
            placeholder="Enter commission amount"
          />

          {/* Update Commission Button */}
          <CButton color="success" className="mt-3" onClick={handleUpdateCommission}>
            Update Commission
          </CButton>
        </CForm>
      </CCardBody>
    </CCard>
  );
};

export default Permission;
