import React, { useState, useEffect, useRef } from 'react';
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
import log from "../.././../assets/images/log (1).png";
import nb from "../.././../assets/images/nb.png";


const Payment = () => {
  const [consumerId, setConsumerId] = useState('');
  const [billDetails, setBillDetails] = useState({});
  const [mobileNumber, setMobileNumber] = useState('');
  const [data, setData] = useState({});
  const [amount, setAmount] = useState(500);
  const [defaultAmount, setDefaultAmount] = useState(500); // State for default amount
  const [selectedMethod, setSelectedMethod] = useState('wallet');
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
  const [showPrintView, setShowPrintView] = useState(false);
  const printRef = useRef();
  const [consumerIdError, setConsumerIdError] = useState('');


  const [showPinModal, setShowPinModal] = useState(false);
  const [pin, setPin] = useState('');
  const [pinError, setPinError] = useState('');

const validateConsumerId = (value) => {
  if (!value) {
    return 'Consumer ID is required.';
  } else if (value.length < 5) { // Example validation
    return 'Consumer ID must be at least 5 characters long.';
  }
  return ''; // No error
};









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
        const response = await axios.get(`/api/v1/users/fetchUserList/${userId}`);
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
  const API_URL = '/api/v1/users/BiharService/BillInterface'

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
    const error = validateConsumerId(consumerId);
    if (error) {
      setConsumerIdError(error);
      return; // Exit if there's an error
    }
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
        const errorMessage = result.error.length > 0 ? result.error[0] : 'An unknown error occurred.';
        alert(`Error: ${errorMessage}`);
      }
    } catch (error) {
      console.error('Error processing payment:', error);
      alert('An error occurred while processing the payment.');
    }
  };


  // const handlePinSubmit = async () => {
  //   // Assuming '1234' is the correct PIN for this example; replace with your logic
  //   if (pin === '1234') {
  //     setShowPinModal(false); // Close the PIN modal
  //     await handleProceedToPay(); // Proceed to payment
  //   } else {
  //     setPinError('Incorrect PIN. Please try again.');
  //   }
  // };

  const handleClosePinModal = () => {
    setShowPinModal(false); // Close the PIN modal
    setPin(''); // Clear the PIN
    setPinError(''); // Clear any PIN errors
  };


  
const handleConsumerIdBlur = () => {
  const error = validateConsumerId(consumerId);
  setConsumerIdError(error); // Set error state
};

const handleConsumerIdFocus = () => {
  setConsumerIdError(''); // Clear error on focus
};


  const handlePrint = () => {
    const printContent = printRef.current.innerHTML; // Get the content to print
    const printWindow = window.open('', '', 'width=600,height=400');

    printWindow.document.write(`
      <html>
        <head>
          <title>Print</title>
          <style>
            body { font-family: Arial, sans-serif; }
            h4 { margin: 0; }
            p { margin: 5px 0; }
          </style>
        </head>
        <body>
          ${printContent}
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.onload = () => {
      printWindow.print(); // Ensure the content is fully loaded before printing
      printWindow.close();
    };
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


  const formatKolkataTime = (dateString) => {
    if (!dateString) return "N/A"; // Handle cases where dateString is null or undefined

    const date = new Date(dateString);
    // Convert to IST (UTC +5:30)
    const istOffset = 5.5 * 60; // 5 hours 30 minutes in minutes
    const utcOffset = date.getTimezoneOffset(); // Get the local timezone offset in minutes
    const istTime = new Date(date.getTime() + (istOffset + utcOffset) * 60000); // Adjust the time

    // Format the date to a readable string
    return istTime.toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' });
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
    
    // Validate form inputs
    if (!validate()) return;
  
    // Show PIN modal before proceeding
    setShowPinModal(true);
  };
  
  const handlePinSubmit = async () => {
    try {
      // Send the entered PIN to the backend for validation
      const response = await axios.post('/api/v1/users/validate-tpin', {
        userId, // Assumes userId is stored in localStorage
        tpin: pin,
      });
  
      // Check the response from the backend
      if (response.data.success) { // Assuming backend sends { success: true } if PIN is correct
        setShowPinModal(false); // Close the PIN modal
        await handleProceedToPay(); // Proceed to payment
      } else {
        setPinError('Incorrect PIN. Please try again.'); // Show error if PIN is incorrect
      }
    } catch (error) {
      console.error('Error validating Tpin:', error);
      setPinError('An error occurred. Please try again later.'); // Display generic error
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
    <CContainer
    className="d-flex justify-content-center align-items-center"
   // Centers the card vertically and horizontally
  >
    <CCard style={{ width: '50%' }}>
        <CCardHeader>
          <h2 style={{color:"#f36c23"}}>Payment Information</h2>
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
                  style={{width:"200%"}}
                    type="text"
                    id="consumerId"
                    value={consumerId}
                    onChange={(e) => setConsumerId(e.target.value)}
                    onBlur={handleConsumerIdBlur} // Validate on blur
                    onFocus={handleConsumerIdFocus}
                    placeholder="Enter Consumer ID"
                  />
             {formSubmitted && consumerIdError && <p className="text-danger">{consumerIdError}</p>}
    </CCol>
              </CRow>

              <CButton color="primary" style={{backgroundColor:"#f36c23",border:"none"}} onClick={handleFetchBill}>
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
                      <CCard   className="mb-3" 
                      style={selectedMethod === 'wallet' ? { backgroundColor: '#f36c23', color: 'white' } : {}}
                      onClick={() => handleMethodChange({ target: { value: 'wallet' } })}>
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
                      <CCard  className="mb-3" 
                      style={selectedMethod === 'ezetap' ? { backgroundColor: '#f36c23', color: 'white' } : {}} onClick={() => handleMethodChange({ target: { value: 'ezetap' } })}>
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
                      <CCard className="mb-3" 
                      style={selectedMethod === 'upi-qr' ? { backgroundColor: '#f36c23', color: 'white' } : {}} onClick={() => handleMethodChange({ target: { value: 'upi-qr' } })}>
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
                      <CCard  className="mb-3" 
                      style={selectedMethod === 'rrn' ? { backgroundColor: '#f36c23', color: 'white' } : {}} onClick={() => handleMethodChange({ target: { value: 'rrn' } })}>
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
                    type="text"
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

              <CButton color="primary" style={{backgroundColor:"#f36c23", border: "none"}} onClick={handlePayment}>
                Pay Bill
              </CButton>
            </>
          )}
        </CCardBody>
      </CCard>

      <CModal visible={showPinModal} onClose={handleClosePinModal}>
        <CModalHeader>Enter PIN</CModalHeader>
        <CModalBody>
          <CFormInput
            type="password"
            id="pin"
            value={pin}
            onChange={(e) => setPin(e.target.value)}
            placeholder="Enter 4-digit PIN"
            maxLength="4"
          />
          {pinError && <p className="text-danger">{pinError}</p>}
        </CModalBody>
        <CModalFooter>
          <CButton color="primary" onClick={handlePinSubmit}>
            Submit
          </CButton>
          <CButton color="secondary" onClick={handleClosePinModal}>
            Cancel
          </CButton>
        </CModalFooter>
      </CModal>

      <CModal visible={showSuccessModal} onClose={handleCloseModal}>



        <CModalBody ref={printRef}>
          <CModalHeader>Payment Successful</CModalHeader>
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: '20px' }}>
            <img src={nb} alt="Thank You" style={{ width: '20%', maxWidth: '300px' }} />
          </div>
          <p>Your payment was processed successfully!</p>

          <p><strong>Date/Time:</strong>  {formatKolkataTime(data.billposton) || "N/A"}</p>

          <p><strong>Receipt No.:</strong> {data.transactionId || 'N/A'}</p>

          <p><strong>Consumer No.:</strong> {data.canumber || 'N/A'}</p>

          <p><strong>Consumer Name:</strong> {data.consumerName || 'N/A'}</p>

          <p><strong>Payment Amt.:</strong> {data.billamount || 'N/A'}</p>

          <p><strong>Payment Mode:</strong> {data.getway || 'N/A'}</p>

          <p><strong>Transaction ID:</strong> {data.transactionId || 'N/A'}</p>

          <p><strong>Payment Status:</strong> Transaction success</p>

          <p>Thanks for Payment!</p>

          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: '20px' }}>
            <img src={log} alt="Thank You" style={{ width: '100%', maxWidth: '300px', marginTop: '20px' }} />
          </div>
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={handlePrint}>
            Print
          </CButton>
          <CButton color="secondary" onClick={handleCloseModal}>
            Close
          </CButton>
        </CModalFooter>
      </CModal>

    </CContainer>
  );
};

export default Payment;