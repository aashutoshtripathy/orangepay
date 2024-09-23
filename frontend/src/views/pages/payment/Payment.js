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

const Payment = () => {
  const [consumerId, setConsumerId] = useState('');
  const [billDetails, setBillDetails] = useState(null);
  const [mobileNumber, setMobileNumber] = useState('');
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


  const MERCHANT_CODE = 'BSPDCL_RAPDRP_16';
  const MERCHANT_PASSWORD = 'OR1f5pJeM9q@G26TR9nPY';





  useEffect(() => {
    const storedUserId = localStorage.getItem('userId');
    if (storedUserId) {
      setUserId(storedUserId);
    }
  }, []);

  const validate = () => {
    const errors = {};
    if (!consumerId) errors.consumerId = 'Consumer ID is required.';
    if (isBillFetched && !mobileNumber) errors.mobileNumber = 'Mobile number is required.';
    if (isBillFetched && (!amount || isNaN(amount) || amount <= 0)) errors.amount = 'A valid amount is required.';
    setErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const API_URL = 'http://1.6.61.79/BiharService/BillInterface.asmx';

  const soapRequest = (consumerId, amount) => `
  <?xml version="1.0" encoding="utf-8"?>
  <soap:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
    <soap:Body>
      <BillDetails xmlns="http://tempuri.org/">
        <strCANumber>${consumerId}</strCANumber>
        <strDivision></strDivision>
        <strSubDivision></strSubDivision>
        <strLegacyNo></strLegacyNo>
        <strMerchantCode>${MERCHANT_CODE}</strMerchantCode>
        <strMerchantPassword>${MERCHANT_PASSWORD}</strMerchantPassword>
        <Amount>${amount}</Amount>
      </BillDetails>
    </soap:Body>
  </soap:Envelope>
`;


const handleFetchBill = async () => {
  setFormSubmitted(true);
  setIsBillFetched(true);
  setFetchBillSuccess(true);

  try {
    const response = await axios.post(API_URL, 

      soapRequest(consumerId),
      {
        headers: {
          'Content-Type': 'text/xml',
          // 'SOAPAction': 'http://tempuri.org/BillDetails',
        },
      }
    );

    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(response.data, 'text/xml');

    const amountDue = xmlDoc.getElementsByTagName('Amount')[0]?.textContent; // Adjust this line
    const dueDate = xmlDoc.getElementsByTagName('DueDate')[0]?.textContent; // Check if this exists in your response

    if (amountDue && dueDate) {
      setBillDetails({ amountDue, dueDate });
      setFetchBillSuccess(true);
    } else {
      alert('Bill details not found.');
    }
  } catch (error) {
    console.error('Error fetching bill:', error);
    alert('An error occurred while fetching the bill.');
  }
};

     const handleProceedToPay = async () => {
    setFormSubmitted(true);

    if (!validate()) return;

    try {
      const response = await fetch('/payment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          consumerId,
          mobileNumber,
          amount,
          paymentMethod: selectedMethod,
          remark,
        }),
      });

      const data = await response.json();
      if (response.ok && data.success) {
        setTransactionId(data.data?.transactionId || 'N/A');
        setShowSuccessModal(true);
        // Reset form fields
        setConsumerId('');
        setMobileNumber('');
        setAmount(defaultAmount); // Reset to default amount
        setRemark('');
        setBillDetails(null);
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
    setShowSuccessModal(false);
  };

  return (
    <CContainer className="p-4">
      <CCard>
        <CCardHeader>
          <h2>Payment Information</h2>
        </CCardHeader>

        <CCardBody>
          {fetchBillSuccess && (
            <div className="mb-4">
              <h4>Consumer Information</h4>
              <p><strong>Consumer ID:</strong> {consumerId}</p>
              {/* <p><strong>Consumer Name:</strong> {consumerName}</p> */}
              {/* <p><strong>Due Date:</strong> {dueDate}</p> */}
            </div>
          )}
          {/* Consumer ID Field */}
          {!fetchBillSuccess && (
            <>
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
                  {formSubmitted && errors.consumerId && <p className="text-danger">{errors.consumerId}</p>}
                </CCol>
              </CRow>

              {/* Fetch Bill Button */}
              <CButton color="primary" onClick={handleFetchBill}>
                Fetch Bill
              </CButton>
            </>
          )}

          {/* Conditional Rendering for Bill Details and Payment Fields */}
          {isBillFetched && (
            <>
              {/* Display Bill Details */}
              {billDetails && (
                <div className="mt-4">
                  <h4>Bill Details</h4>
                  <p>Amount Due: {billDetails.amountDue}</p>
                  <p>Due Date: {billDetails.dueDate}</p>
                </div>
              )}

              {/* Mobile Number Field */}
              <CRow className="mb-3">
                <CCol md={6}>
                  <CFormLabel htmlFor="mobileNumber">Mobile Number</CFormLabel>
                  <CFormInput
                    type="text"
                    id="mobileNumber"
                    value={mobileNumber}
                    onChange={(e) => setMobileNumber(e.target.value)}
                    placeholder="Enter Mobile Number"
                  />
                  {formSubmitted && errors.mobileNumber && <p className="text-danger">{errors.mobileNumber}</p>}
                </CCol>
              </CRow>
              <CRow className="mb-3">
                <CCol md={6}>
                  <label htmlFor="paymentMethod">Payment Method</label>
                  <CFormSelect
                    id="paymentMethod"
                    value={selectedMethod}
                    onChange={handleMethodChange}
                  >
                    <option value="">Select Payment Method</option>
                    <option value="wallet">WALLET</option>
                    <option value="ezetap">EZETAP</option>
                    <option value="upi-qr">UPI-QR</option>
                  </CFormSelect>
                </CCol>
              </CRow>

              {/* Amount Field */}
              <CRow className="mb-3">
                <CCol md={6}>
                  <CFormLabel htmlFor="defaultAmount">Amount</CFormLabel>
                  <CFormInput
                    type="number"
                    id="amount"
                    value={amount}
                    onChange={(e) => setAmount(Number(e.target.value))}
                    placeholder="Enter amount"
                  />
                </CCol>
              </CRow>

              {/* Remark Field */}
              <CRow className="mb-3">
                <CCol md={6}>
                  <CFormLabel htmlFor="remark">Remark</CFormLabel>
                  <CFormInput
                    type="text"
                    id="remark"
                    value={remark}
                    onChange={(e) => setRemark(e.target.value)}
                    placeholder="Enter a remark (optional)"
                  />
                </CCol>
              </CRow>

              {/* Pay Bill Button */}
              <CButton color="primary" onClick={handleProceedToPay}>
                Pay Bill
              </CButton>
            </>
          )}
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
