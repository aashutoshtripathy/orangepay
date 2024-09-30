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
  CFormCheck,
  CFormSelect,
} from '@coreui/react';
import axios from 'axios';

const Payment = () => {
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
  const [selectedOptions, setSelectedOptions] = useState({});
  const [fundRequestMethods, setFundRequestMethods] = useState({});
  const [billPaymentMethods, setBillPaymentMethods] = useState({});
  const [commission, setCommission] = useState('');





  const MERCHANT_CODE = 'BSPDCL_RAPDRP_16';
  const MERCHANT_PASSWORD = 'OR1f5pJeM9q@G26TR9nPY';





  useEffect(() => {
    const storedUserId = localStorage.getItem('userId');
    if (storedUserId) {
      setUserId(storedUserId);
    }
  }, []);


  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`/fetchUserList/${userId}`);
        const result = response.data.fetchUser || {};

        // Update state with the fetched data
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

        setCommission(result.margin || '');
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    if (userId) {
      fetchData();
    }
  }, [userId]);




  const validate = () => {
    const errors = {};
    if (!consumerId) errors.consumerId = 'Consumer ID is required.';
    if (isBillFetched && !mobileNumber) errors.mobileNumber = 'Mobile number is required.';
    if (isBillFetched && (!amount || isNaN(amount) || amount <= 0)) errors.amount = 'A valid amount is required.';
    setErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // const API_URL = 'http://1.6.61.79/BiharService/BillInterface.asmx';
  const API_URL = '/BiharService/BillInterface'

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
    setFetchBillSuccess(false); // Set to false initially to indicate fetching process

    try {
      const response = await axios.post(API_URL, {
        consumerId: consumerId, // Sending consumerId in the JSON body
      });

      const consumerData = response.data; // Assuming this is the API response

      if (Array.isArray(consumerData) && consumerData.length > 0) {
        const consumer = consumerData[0]; // Access the first consumer object

        // Extract the details
        const extractedConsumerId = consumer.ConsumeId || ''; // Fallback to empty string
        const consumerName = consumer.ConsumerName || 'N/A'; // Provide a fallback
        const address = consumer.Address || 'N/A';
        const mobileNo = consumer.MobileNo || 'N/A';
        const divisionName = consumer.DivisionName || 'N/A';
        const subDivision = consumer.SubDivision || 'N/A';

        // Set the extracted details to state
        setBillDetails({
          consumerId: extractedConsumerId,
          consumerName,
          address,
          mobileNo,
          divisionName,
          subDivision,
        });
        setFetchBillSuccess(true);
      } else {
        console.error('No consumer data found.');
        // Handle case when no data is found
      }
    } catch (error) {
      console.error('Error fetching bill:', error);
      // Handle error appropriately, e.g., show an alert
    }
  };
  console.log(billDetails)

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
          consumerId: consumerId,
          mobileNumber,
          amount,
          paymentMethod: selectedMethod,
          remark,
          consumerName: billDetails.consumerName,
          divisionName: billDetails.divisionName,
          subDivision: billDetails.subDivision,
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
        alert(`Error: ${result.message}`); // Use result.message instead of data.message
      }
    } catch (error) {
      console.error('Error processing payment:', error);
      alert('An error occurred while processing the payment.');
    }
  };

  const createRazorpayOrder = async () => {
    if (!validate()) return; // Validate before creating order

    const data = {
      amount: Number(amount), // Razorpay requires amount in paise
      currency: "INR",
    };

    try {
      const response = await axios.post("/ezetap", data);
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
    const options = {
      key: 'rzp_test_GcZZFDPP0jHtC4',
      amount: amount * 100,
      currency: 'INR',
      name: "OrangePay",
      description: "Payment to OrangePay",
      handler: function (response) {
        // Handle the response here
      },
      prefill: {
        name: "OrangePay",
        email: "orangepay@gmail.com"
      },
      theme: {
        color: "#F4C430"
      }
    };

    const paymentObject = new window.Razorpay(options);
    paymentObject.open();
  };

  // const handleSetDefaultAmount = () => {
  //   setAmount(defaultAmount);
  // };
  const handlePayment = async () => {
    setFormSubmitted(true);
    if (!validate()) return;

    if (selectedMethod === 'wallet') {
      await handleProceedToPay();
    } else {
      await createRazorpayOrder();
    }
  };

  const handleMethodChange = (e) => {
    const selectedValue = e.target.value;
    setSelectedMethod(selectedValue);
    if (selectedValue === "ezetap") {
      // Perform action for credit method
      console.log("Credit method selected.");
    }
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
              <p><strong>Consumer Name:</strong> {billDetails.consumerName || 'N/A'}</p>
              <p><strong>Mobile No:</strong> {billDetails.mobileNo || 'N/A'}</p>
              <p><strong>Address:</strong> {billDetails.address || 'N/A'}</p>
            </div>
          )}
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

              <CButton color="primary" onClick={handleFetchBill}>
                Fetch Bill
              </CButton>
            </>
          )}

          {isBillFetched && (
            <>
              {/* {billDetails && (
                <div className="mt-4">
                  <h4>Bill Details</h4>
                  <p>Amount Due: {billDetails.amountDue}</p>
                  <p>Due Date: {billDetails.dueDate}</p>
                </div>
              )} */}

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
              {/* <CRow className="mb-3">
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
              </CRow> */}


              <CRow className="mb-3">
                <CCol md={6}>
                  <label htmlFor="paymentMethod">Payment Method</label>
                  <div className="d-flex justify-content-between mt-2">
                    {billPaymentMethods.wallet && (
                      <CCard className={`mb-3 ${selectedMethod === 'wallet' ? 'border-primary' : ''}`} onClick={() => handleMethodChange({ target: { value: 'wallet' } })}>
                        <CCardBody>
                          <CFormCheck
                            type="radio"
                            name="paymentMethod"
                            id="wallet"
                            value="wallet"
                            label="Wallet"
                            checked={selectedMethod === 'wallet'}
                            onChange={handleMethodChange}
                            className="d-none" // Hide the default radio button
                          />
                          <span className="ms-2">Wallet</span>
                        </CCardBody>
                      </CCard>
                    )}
                    {billPaymentMethods.ezetap && (
                      <CCard className={`mb-3 ${selectedMethod === 'ezetap' ? 'border-primary' : ''}`} onClick={() => handleMethodChange({ target: { value: 'ezetap' } })}>
                        <CCardBody>
                          <CFormCheck
                            type="radio"
                            name="paymentMethod"
                            id="ezetap"
                            value="ezetap"
                            label="EZETAP"
                            checked={selectedMethod === 'ezetap'}
                            onChange={handleMethodChange}
                            className="d-none" // Hide the default radio button
                          />
                          <span className="ms-2">EZETAP</span>
                        </CCardBody>
                      </CCard>
                    )}
                    {billPaymentMethods.upiQr && (
                      <CCard className={`mb-3 ${selectedMethod === 'upi-qr' ? 'border-primary' : ''}`} onClick={() => handleMethodChange({ target: { value: 'upi-qr' } })}>
                        <CCardBody>
                          <CFormCheck
                            type="radio"
                            name="paymentMethod"
                            id="upi-qr"
                            value="upi-qr"
                            label="UPI-QR"
                            checked={selectedMethod === 'upi-qr'}
                            onChange={handleMethodChange}
                            className="d-none" // Hide the default radio button
                          />
                          <span className="ms-2">UPI-QR</span>
                        </CCardBody>
                      </CCard>
                    )}
                    {billPaymentMethods.rrn && (
                      <CCard className={`mb-3 ${selectedMethod === 'rrn' ? 'border-primary' : ''}`} onClick={() => handleMethodChange({ target: { value: 'rrn' } })}>
                        <CCardBody>
                          <CFormCheck
                            type="radio"
                            name="paymentMethod"
                            id="rrn"
                            value="rrn"
                            label="RRN"
                            checked={selectedMethod === 'rrn'}
                            onChange={handleMethodChange}
                            className="d-none" // Hide the default radio button
                          />
                          <span className="ms-2">RRN</span>
                        </CCardBody>
                      </CCard>
                    )}
                  </div>
                </CCol>
              </CRow>

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

              <CButton color="primary" onClick={handlePayment}>
                Pay Bill
              </CButton>
            </>
          )}
        </CCardBody>
      </CCard>

      <CModal visible={showSuccessModal} onClose={handleCloseModal}>
        <CModalHeader>Payment Successful</CModalHeader>
        <CModalBody>
          <p>Your payment was processed successfully!</p>

          <p><strong>Date/Time:</strong>  {""}</p>

          <p><strong>Receipt No.:</strong> {data.transactionId || 'N/A'}</p>

          <p><strong>Consumer No.:</strong> {data.canumber || 'N/A'}</p>

          <p><strong>Consumer Name:</strong> {data.consumerName || 'N/A'}</p>

          <p><strong>Payment Amt.:</strong> {data.billamount || 'N/A'}</p>

          <p><strong>Payment Mode:</strong> {data.getway || 'N/A'}</p>

          <p><strong>Transaction ID:</strong> {data.transactionId || 'N/A'}</p>

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

export default Payment;