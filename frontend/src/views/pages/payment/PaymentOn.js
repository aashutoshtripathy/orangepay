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
import { CSpinner } from '@coreui/react';
import crc32 from 'crc-32';
import axios from 'axios';
import log from "../.././../assets/images/log (1).png";
import nb from "../.././../assets/images/nb.png";
import { sendSoapRequest, generateBillDetailsPayload, generatePaymentReceiptDetailsPayload, generatePaymentDetailsPayload } from './SoapApi';


const PaymentOn = () => {
  const [consumerId, setConsumerId] = useState('');
  const [billDetails, setBillDetails] = useState({});
  const [mobileNumber, setMobileNumber] = useState('');
  const [data, setData] = useState({});
  const [amount, setAmount] = useState(500);
  const [defaultAmount, setDefaultAmount] = useState(500);
  const [selectedMethod, setSelectedMethod] = useState('wallet');
  const [remark, setRemark] = useState('');
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
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
  const [isLoading, setIsLoading] = useState(false);
  const [billData, setBillData] = useState({
    consumerId: '',
    consumerName: '',
    address: 'N/A',
    mobileNo: 'N/A',
    divisionName: 'N/A',
    subDivision: 'N/A',
    companyName: 'N/A',
    billMonth: 'N/A',
    amount: 'N/A',
    dueDate: 'N/A',
    invoiceNo: 'N/A',
    paymentDate: "N/A",
    receiptNo: "N/A",
  });


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




  const API_URL = '/api/v1/users/bill-details';
  const NEW_API_URL = '/api/v1/users/BiharService/BillInterface'




  

  const handleFetchBill = async () => {
    const error = validateConsumerId(consumerId);
    if (error) {
      setErrors(prevErrors => ({ ...prevErrors, consumerId: error }));
      return;
    }
    setIsLoading(true);
  
    try {
      const jsonPayload = { consumerId: consumerId };
  
      // First API request
      const response = await axios.post(API_URL, jsonPayload, {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
      });
  
      const billDetails = response.data;
      if (billDetails) {
        const fetchedTransactionId = `OP${Date.now()}`;
        setTransactionId(fetchedTransactionId)
        const companyCode = billDetails.companyName === "SOUTH BIHAR POWER DISTRIBUTION COMPANY LTD" ? "SBPDCL" : billDetails.companyName;
  
        const fetchedBillData = {
          caNumber: billDetails.caNumber,
          dueDate: billDetails.dueDate,
          mobileNumber: billDetails.mobileNumber || "N/A",
          invoiceNumber: billDetails.invoiceNumber,
          consumerName: billDetails.consumerName,
          division: billDetails.division,
          subDivision: billDetails.subDivision,
          billMonth: billDetails.billMonth,
          amount: billDetails.amount,
          address: billDetails.address || "N/A",
          companyName: companyCode,
          transactionId: fetchedTransactionId,
        };
  
        setBillData(fetchedBillData);
        setFetchBillSuccess(true);
        setIsBillFetched(true);
      } else {
        throw new Error('No BillDetailsResult found');
      }
    } catch (error) {
      console.error('Error fetching bill details:', error);
      try {
        console.log('Attempting secondary API...');
        const secondaryResponse = await axios.post(NEW_API_URL, { consumerId: consumerId });
        const consumerData = secondaryResponse.data;
  
        if (Array.isArray(consumerData) && consumerData.length > 0) {
          const consumer = consumerData[0];
          setBillData({
            consumerId: consumer.ConsumeId || '',
            consumerName: consumer.ConsumerName || 'N/A',
            address: consumer.Address || 'N/A',
            mobileNo: consumer.MobileNo || 'N/A',
            divisionName: consumer.DivisionName || 'N/A',
            subDivision: consumer.SubDivision || 'N/A',
          });
          setIsBillFetched(true);
          setFetchBillSuccess(true);
        } else {
          setFetchBillSuccess(false);
          setIsBillFetched(false);
          setConsumerIdError('No records found for this consumer ID.');
          console.error('No consumer data found.');
        }
      } catch (secondaryError) {
        console.error('Secondary API failed:', secondaryError);
      }
    } finally {
      setIsLoading(false);
    }
  };
  
  // Updated handleProceedToPay
  const handleProceedToPay = async () => {
    if (!validate() || !isBillFetched || !billData || !amount) {
      console.error('Missing required fields');
      return;
    }
  
    // Add checks for undefined values
    if (!billData.toString || !amount.toString) {
      console.error('Invalid values for billData or amount');
      return;
    }
  
    setIsLoading(true);
  
    try {
      // Log the data to check the values
      console.log('Bill Data:', billData);
      console.log('Amount:', amount);
  
      const response = await axios.post('/api/v1/users/process-payment', {
        paymentMethod: selectedMethod,
        billDetails: billData,
        amount: amount
      });
  
      if (response.data.success) {
        console.log('Transaction successful');
        setShowSuccessModal(true);
        setIsLoading(false);
    
        // Proceed with the bill receipt request if payment was successful
        try {
          // Call the processBill API with the transactionId from the payment response
          const transactionId = response.data.transactionId;  // Adjust based on your response structure
          const billResponse = await axios.post('/api/v1/users/process-bill', {
            transactionId: transactionId
          });
    
          if (billResponse.data.success) {
            setData(billResponse.data.data)
            console.log('Bill processed successfully');
          } else {
            console.error('Failed to process bill:', billResponse.data.message || 'Unknown error');
          }
        } catch (billError) {
          console.error('Error processing bill:', billError.message || billError);
        }
    
      } else {
        console.error('Transaction failed:', response.data.message || 'Unknown error');
        setIsLoading(false);
      }
    } catch (error) {
      console.error('Error during payment or receipt fetch:', error.message || error);
      setIsLoading(false);
    }
}
  

  







  const handleCloseErrorModal = () => {
    setShowErrorModal(false);
  };


  const parser = new DOMParser();


  const generateUniqueTransactionId = () => `OP${Date.now()}`;






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


  const handleAmountChange = (e) => {
    const value = parseFloat(e.target.value);
    if (!isNaN(value)) {
      setAmount(value);
    } else {
      setAmount(0); // Set to 0 or handle invalid input appropriately 
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



  const handlePinSubmit = async () => {
    try {
      setShowPinModal(true);

      // Validate PIN with backend
      const response = await axios.post('/api/v1/users/validate-tpin', {
        userId, // Assumes userId is stored in localStorage
        tpin: pin,
      });

      if (response.data.success) {
        // PIN is correct, execute additional payment logic
        try {
          const payload = {
            userId,
            consumerId: consumerId,
            invoiceNo: billData.invoiceNumber,
            billMonth: billData.billMonth,
            dueDate: billData.dueDate,
            transactionId,
            paymentDate: billData.paymentDate,
            brandCode: billData.brandCode,
            mobileNumber,
            brandCode: billData.companyName,
            amount,
            receiptNo: data?.receiptData?.receiptNo || 'N/A',
            paymentMethod: selectedMethod,
            remark,
            consumerName: billData.consumerName,
            divisionName: billData.division,
            subDivision: billData.subDivision,
            billpoststatus: "Success",
            receiptNo: data?.receiptNo,
          };

          const paymentResponse = await fetch('/api/v1/users/payment', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
          });

          const result = await paymentResponse.json();

          if (paymentResponse.ok && result.success) {
            console.log('Payment successful:', result);
            setShowPinModal(false); // Close the PIN modal
            await handleProceedToPay(); // Proceed to handle payment
          } else {
            setShowPinModal(false);
            alert('Same CANumber same amount Pay within 30 minutes')
            throw new Error(result.message || 'Payment failed.');
          }
        } catch (error) {
          console.error('Payment error:', error);
          setErrors(error.message || 'An error occurred while processing the payment.');
        }
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

  const handlePayment = async () => {
    setFormSubmitted(true);

    if (!validate()) return;

    setShowPinModal(true);

   
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



  const formatAmount = (value) => {
    return new Intl.NumberFormat('en-IN').format(value);
  };

  return (
    <CContainer
      className="d-flex justify-content-center align-items-center"
    // Centers the card vertically and horizontally
    >
      <CCard style={{ width: '50%' }}>
        <CCardHeader>
          <h2 style={{ color: "#f36c23" }}>Payment Information</h2>
        </CCardHeader>

        <CCardBody>
        {fetchBillSuccess && isBillFetched ? (
  <div className="mb-4 p-4 border rounded shadow-sm bg-light">
    <h4 className="mb-3 text-primary">Consumer Information</h4>
    <ul className="list-unstyled">
      <li><strong>Consumer ID:</strong> {billData.caNumber || 'N/A'}</li>
      <li><strong>Consumer Name:</strong> {billData.consumerName || 'N/A'}</li>
      <li><strong>Address:</strong> {billData.address || 'N/A'}</li>
      <li><strong>Mobile No:</strong> {billData.mobileNumber || 'N/A'}</li>
      <li><strong>Division Name:</strong> {billData.division || 'N/A'}</li>
      <li><strong>Sub Division:</strong> {billData.subDivision || 'N/A'}</li>
      <li><strong>Company Name:</strong> {billData.companyName || 'N/A'}</li>
      <li><strong>Bill Month:</strong> {billData.billMonth || 'N/A'}</li>
      <li><strong>Amount:</strong> ₹{billData.amount || 'N/A'}</li>
      <li><strong>Due Date:</strong> {billData.dueDate || 'N/A'}</li>
      <li><strong>Invoice No:</strong> {billData.invoiceNumber || 'N/A'}</li>
      
    </ul>
  </div>
) : (
  isLoading ? (
    <p className="text-info">Fetching bill details, please wait...</p>
  ) : (
    <p className="text-danger"></p>
  )
)}

          {!fetchBillSuccess && (
            <>
              <CRow className="mb-3">
                <CCol md={6}>
                  <CFormLabel htmlFor="consumerId">Consumer ID</CFormLabel>
                  <CFormInput
                    style={{ width: "200%" }}
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

              {isLoading ? (
                <div className="text-center mt-3">
                  <CSpinner color="primary"  size="lg" /> {/* Loader while data is being fetched */}
                </div>
              ) : (
                <CButton
                  color="primary"
                  style={{ backgroundColor: '#f36c23', border: 'none' }}
                  onClick={handleFetchBill}
                >
                  Fetch Bill
                </CButton>
              )}


            
            </>
          )}

          {isBillFetched && (
            <>
             

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
                  <CFormLabel htmlFor="amount">Amount</CFormLabel>
                  <CFormInput
                    type="text"
                    id="amount"
                    value={formatAmount(amount)}
                    onChange={(e) => {
                      let input = e.target.value;

                      // Remove leading zeros
                      input = input.replace(/^0+/, '');

                      // Update the state
                      setAmount(input);
                    }}
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
                    onChange={handleAmountChange}
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

          <p><strong>Date/Time:</strong>  {formatKolkataTime(data.paymentDateTime) || "N/A"}</p>

          <p><strong>Receipt No.:</strong> {data.receiptNo || 'N/A'}</p>

          <p><strong>Consumer No.:</strong> {data.consumerId || 'N/A'}</p>

          <p><strong>Consumer Name:</strong> {data.consumerName || 'N/A'}</p>

          <p><strong>Payment Amt.:</strong> {data.amountPaid || 'N/A'}</p>

          <p><strong>Payment Mode:</strong> {data.modePayment || 'N/A'}</p>

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

      <CModal visible={showErrorModal} onClose={handleCloseErrorModal}>
        <CModalHeader>Warning</CModalHeader>
        <CModalBody>
          <p className="text-danger">{errorMessage}</p> {/* Display the error message */}
        </CModalBody>
        <CModalFooter>
          <CButton color="primary" onClick={handleCloseErrorModal}>
            Close
          </CButton>
        </CModalFooter>
      </CModal>

    </CContainer>
  );
};

export default PaymentOn;