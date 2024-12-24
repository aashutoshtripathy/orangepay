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
} from '@coreui/react';
import axios from 'axios';

const PrepaidRecharge = () => {
  const [consumerId, setConsumerId] = useState('');
  const [billDetails, setBillDetails] = useState({});
  const [mobileNumber, setMobileNumber] = useState('');
  const [data, setData] = useState({});
  const [amount, setAmount] = useState(500);
  const [defaultAmount, setDefaultAmount] = useState(500); // State for default amount
  const [selectedMethod, setSelectedMethod] = useState('');
  const [remark, setRemark] = useState('');
  const [userId, setUserId] = useState('');
  const [errors, setErrors] = useState({});
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [transactionId, setTransactionId] = useState('');
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [isBillFetched, setIsBillFetched] = useState(false);
  const [fetchBillSuccess, setFetchBillSuccess] = useState(false);
  const [responseData, setResponseData] = useState(null);








  useEffect(() => {
    const storedUserId = localStorage.getItem('userId');
    if (storedUserId) {
      setUserId(storedUserId);
    }
  }, []);

  const validate = () => {
    const errors = {};
    if (!consumerId) errors.consumerId = 'Consumer ID is required.';
    // if (isBillFetched && !mobileNumber) errors.mobileNumber = 'Mobile number is required.';
    // if (isBillFetched && (!amount || isNaN(amount) || amount <= 0)) errors.amount = 'A valid amount is required.';
    setErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // const API_URL = 'http://1.6.61.79/BiharService/BillInterface.asmx';
  // const API_URL = '/api/v1/hargharbijlee/WebServiceExternal/WebServiceOPSM.asmx?op=GetConsumerBalanceDetails'
  const API_URL = 'http://hargharbijli.bsphcl.co.in/WebServiceExternal/WebServiceOPSM.asmx?op=GetConsumerBalanceDetails'

  const soapRequest = (consumerId) => `
<?xml version="1.0" encoding="utf-8"?>
<soap12:Envelope xmlns:soap12="http://www.w3.org/2003/05/soap-envelope" xmlns:bsphcl="http://bsphcl.co.in/">
  <soap12:Header>
    <bsphcl:UserCredentials>
      <bsphcl:username>SMOR</bsphcl:username>
      <bsphcl:password>Op#4321@$M</bsphcl:password>
    </bsphcl:UserCredentials>
  </soap12:Header>
  <soap12:Body>
    <bsphcl:GetConsumerBalanceDetails>
      <bsphcl:StrCANumber>${consumerId}</bsphcl:StrCANumber>
    </bsphcl:GetConsumerBalanceDetails>
  </soap12:Body>
</soap12:Envelope>
`.trim();



  

const handleFetchBill = async () => {
  if (!consumerId) {
    alert("Consumer ID is required.");
    return;
  }

  setFormSubmitted(true);
  setIsBillFetched(true);
  setFetchBillSuccess(false);

  try {
    const response = await axios.post('/api/v1/hargharbijlee/fetch-bill', { consumerId });
  
    console.log("API Response:", response.data);
  
    const result = response.data;
  
    setBillDetails({
      consumerId: result.consumerNumber || 'N/A',
      balance: result.balance || 'N/A',
      lastPaymentDate: result.lastPaymentDate || 'N/A',
      lastPaymentAmount: result.lastPaymentAmount || 'N/A',
      meterNumber: result.meterNumber || 'N/A',
      connectionStatus: result.connectionStatus === 'Y' ? 'Active' : 'Inactive',
      ResponseDateTime: result.responseDateTime,
      Status: result.status,
    });
  
    setFetchBillSuccess(true);
  } catch (error) {
    console.error('Error fetching bill:', error);
    alert('An error occurred while fetching the bill details.');
  }
}  




  
    

  const handleProceedToPay = async () => {
    setFormSubmitted(true);

    if (!validate()) return;

    try {
      const response = await fetch('/api/v1/users/payment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          consumerId: consumerId,
          mobileNumber,
          amount,
          paymentMethod: selectedMethod,
          remark,
          consumerName: billDetails.consumerName,
          divisionName: billDetails.divisionName,
          subDivision: billDetails.subDivision
        }),
      });

      const result = await response.json();
      if (response.ok && result.success) {
        setTransactionId(result.data.invoice?.transactionId || 'N/A');
        setData(result.data.invoice);
        setShowSuccessModal(true);
        // Reset form fields
        setConsumerId('');
        setMobileNumber('');
        setAmount(defaultAmount); // Reset to default amount
        setRemark('');
        setBillDetails({});
        setIsBillFetched(false);
        setErrors({});
      } else {
        alert(`Error: ${data.message}`);
      }
    } catch (error) {
      console.error('Error processing payment:', error);
      alert('An error occurred while processing the payment.');
    }
  };
  // const handleSetDefaultAmount = () => {
  //   setAmount(defaultAmount);
  // };

  const handleMethodChange = (e) => {
    setSelectedMethod(e.target.value);
  };

  const handleCloseModal = () => {
    setShowSuccessModal(false); // Close the modal
    setConsumerId(''); // Reset Consumer ID
    setMobileNumber(''); // Reset Mobile Number
    setAmount(defaultAmount); // Reset Amount to default
    setRemark(''); // Clear Remark
    setBillDetails({}); // Clear Bill Details
    setIsBillFetched(false); // Reset the fetched bill state
    setErrors({}); // Clear any errors
    setFormSubmitted(false);
    setFetchBillSuccess(false)
  };

  return (
    <CContainer
      className="d-flex justify-content-center align-items-center"
    // Centers the card vertically and horizontally
    >
    <CCard style={{ width: '50%' }}>
    <CCardHeader>
          <h2 style={{color:"#f36c23"}}>Check Prepaid Balance</h2>
        </CCardHeader>

        <CCardBody>
          {fetchBillSuccess && (
            <div className="mb-4">
              <h4>Consumer Information</h4>
              <p><strong>Consumer ID:</strong> {billDetails.consumerId|| 'N/A'}</p>
              <p><strong>Current Balance:</strong> {billDetails.balance || 'N/A'}</p> 
              <p><strong>Response Date & Time:</strong> {billDetails.ResponseDateTime || 'N/A'}</p>
              <p><strong>Meter Number:</strong> {billDetails.meterNumber || 'N/A'}</p>
              <p><strong>Status:</strong> {billDetails.connectionStatus || 'N/A'}</p>
              <p><strong>Last Payment Amount:</strong> {billDetails.lastPaymentAmount || 'N/A'}</p>
              <p><strong>Last Payment Date:</strong> {billDetails.lastPaymentDate || 'N/A'}</p>
              <p><strong>Payment Status:</strong> {billDetails.Status || 'N/A'}</p>

            

            </div>
          )}
          {/* Consumer ID Field */}
          {!fetchBillSuccess && (
            <>
              <CRow className="mb-3">
                <CCol md={6}>
                  <label htmlFor="paymentMethod">Select Meter Type</label>
                  <CFormSelect
                  style={{width:"200%"}}
                    id="paymentMethod"
                    value={selectedMethod}
                    onChange={handleMethodChange}
                  >
                    <option value="" disabled>Select Meter Type</option>
                    <option value="secure">Secure</option>
                    <option value="eesl">EESL</option>
                    <option value="genus">Genus</option>
                  </CFormSelect>
                </CCol>
              </CRow>
              <CRow className="mb-3">
                <CCol md={6}>
                  <CFormLabel htmlFor="consumerId">Enter Consumer Number</CFormLabel>
                  <CFormInput
                    style={{width:"200%"}}
                    type="text"
                    id="consumerId"
                    value={consumerId}
                    onChange={(e) => setConsumerId(e.target.value)}
                    placeholder="Enter Consumer Number"
                  />
                  {formSubmitted && errors.consumerId && <p className="text-danger">{errors.consumerId}</p>}
                </CCol>
              </CRow>

              {/* Fetch Bill Button */}
              <CButton style={{backgroundColor:"#f36c23",border:"none"}} color='primary' onClick={handleFetchBill}>
                Get Balance
              </CButton>
            </>
          )}

          {/* Conditional Rendering for Bill Details and Payment Fields */}
          {isBillFetched && (
            <>
             
            </>
          )}
        </CCardBody>
      </CCard>

      {/* Success Modal */}
      <CModal visible={showSuccessModal} onClose={handleCloseModal}>
        <CModalHeader>Payment Successful</CModalHeader>
        <CModalBody>
          <p>Your payment was processed successfully!</p>

          {/* Date/Time: Provide fallback if paymentdate is not available or invalid */}
          <p><strong>Date/Time:</strong>  {""}</p>

          {/* Receipt No. */}
          <p><strong>Receipt No.:</strong> {data.transactionId || 'N/A'}</p>

          {/* Consumer No.: Check if consumer number (canumber) is available */}
          <p><strong>Consumer No.:</strong> {data.canumber || 'N/A'}</p>

          {/* Consumer Name: Provide fallback if consumer name is not available */}
          <p><strong>Consumer Name:</strong> {data.consumerName || 'N/A'}</p>

          {/* Payment Amount */}
          <p><strong>Payment Amt.:</strong> {data.billamount || 'N/A'}</p>

          {/* Payment Mode */}
          <p><strong>Payment Mode:</strong> {data.getway || 'N/A'}</p>

          {/* Transaction ID */}
          <p><strong>Transaction ID:</strong> {data.transactionId || 'N/A'}</p>

          {/* Payment Status */}
          <p><strong>Payment Status:</strong> Transaction success</p>

          <p>Thanks for Payment!</p>
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

export default PrepaidRecharge;
