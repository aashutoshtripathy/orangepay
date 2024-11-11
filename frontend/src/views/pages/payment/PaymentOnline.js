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
import crc32 from 'crc-32';
import axios from 'axios';
import log from "../.././../assets/images/log (1).png";
import nb from "../.././../assets/images/nb.png";
import { sendSoapRequest, generateBillDetailsPayload, generatePaymentReceiptDetailsPayload, generatePaymentDetailsPayload } from './SoapApi';


const PaymentOnline = () => {
  const [consumerId, setConsumerId] = useState('');
  const [billDetails, setBillDetails] = useState({});
  const [mobileNumber, setMobileNumber] = useState('');
  const [data, setData] = useState({});
  const [amount, setAmount] = useState(500);
  const [defaultAmount, setDefaultAmount] = useState(500);
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
  const [showPrintView, setShowPrintView] = useState(false);
  const printRef = useRef();
  const [consumerIdError, setConsumerIdError] = useState('');
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




  const API_URL = '/BiharService/BillInterface.asmx';
  // const SECONDARY_API_URL = '/BiharService/BillInterface'
  const SECONDARY_API_URL = '/BiharService/BillInterface.asmx?op=PaymentDetails'


  const soapRequest = (consumerId) => `
    <?xml version="1.0" encoding="utf-8"?>
    <soap:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
      <soap:Body>
        <BillDetails xmlns="http://tempuri.org/">
          <strCANumber>${consumerId}</strCANumber>
          <strMerchantCode>${MERCHANT_CODE}</strMerchantCode>
          <strMerchantPassword>${MERCHANT_PASSWORD}</strMerchantPassword>
        </BillDetails>
      </soap:Body>
    </soap:Envelope>
    `;

  const handleFetchBill = async () => {
    const error = validateConsumerId(consumerId);
    if (error) {
      setErrors(prevErrors => ({ ...prevErrors, consumerId: error }));
      return;
    }

    try {
      const xmlPayload = soapRequest(consumerId).trim(); // Ensure no whitespace before XML declaration
      const response = await axios.post(API_URL, xmlPayload, {
        headers: {
          'Content-Type': 'text/xml; charset=utf-8',
          'Accept': 'application/xml, text/xml, application/json',
        },
      });

      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(response.data, "text/xml");
      const namespaceURI = "http://tempuri.org/";
      const billDetails = xmlDoc.getElementsByTagNameNS(namespaceURI, "BillDetailsResult")[0];

      if (billDetails) {
        const getTagValue = (tagName) => {
          const element = billDetails.getElementsByTagNameNS(namespaceURI, tagName)[0];
          return element && element.textContent.trim() ? element.textContent : 'N/A';
        };

        const fetchedBillData = {
          consumerId: getTagValue("CANumber"),
          consumerName: getTagValue("ConsumerName"),
          address: getTagValue("Address"),
          mobileNo: getTagValue("MobileNumber"),
          divisionName: getTagValue("Division"),
          subDivision: getTagValue("SubDivision"),
          companyName: getTagValue("CompanyName"),
          billMonth: getTagValue("BillMonth"),
          amount: getTagValue("Amount"),
          dueDate: getTagValue("DueDate"),
          invoiceNo: getTagValue("InvoiceNO"),
        };

        setBillData(fetchedBillData);
        setFetchBillSuccess(true);
        setIsBillFetched(true)
      } else {
        setFetchBillSuccess(false);
        console.error('No BillDetailsResult found in response from primary API.');

        // // Ensure you have the correct namespace
        // const namespaceURI = "http://tempuri.org/"; // Replace with the correct namespace if necessary

        // // Check if the XML response is valid
        // const secondaryXmlDoc = parser.parseFromString(secondaryResponse.data, "text/xml");
        // console.log(secondaryXmlDoc); // Log the parsed XML

        // // Attempt to find BillDetailsResult
        // const secondaryBillDetails = secondaryXmlDoc.getElementsByTagNameNS(namespaceURI, "BillDetailsResult")[0];

        // if (secondaryBillDetails) {
        //   // Function to safely extract values from XML
        //   const getTagValue = (tagName) => {
        //     const element = secondaryBillDetails.getElementsByTagNameNS(namespaceURI, tagName)[0];
        //     return element ? element.textContent.trim() : 'N/A';
        //   };

        //   // Map the data as per your response structure
        //   const secondaryFetchedBillData = {
        //     consumerId: getTagValue("CANumber"),
        //     consumerName: getTagValue("ConsumerName"),
        //     address: getTagValue("Address"),
        //     mobileNo: getTagValue("MobileNumber"),
        //     divisionName: getTagValue("Division"),
        //     subDivision: getTagValue("SubDivision"),
        //     companyName: getTagValue("CompanyName"),
        //     billMonth: getTagValue("BillMonth"),
        //     amount: getTagValue("Amount"),
        //     dueDate: getTagValue("DueDate"),
        //     invoiceNo: getTagValue("InvoiceNO"),
        //   };

        //   setBillData(secondaryFetchedBillData);
        //   setFetchBillSuccess(true);
        //   console.log('Fetched from secondary API:', secondaryFetchedBillData);
        // } else {
        //   console.error('No BillDetailsResult found in secondary response.');
        // }

      }
    } catch (error) {
      console.error('Error fetching bill details:', error);
    }
  };

  const handleAmountChange = (e) => {
    const value = parseFloat(e.target.value);
    if (!isNaN(value)) {
      setAmount(value);
    } else {
      setAmount(0); // Set to 0 or handle invalid input appropriately 
    }
  };

  const formatDateTime = () => { const now = new Date(); const year = now.getFullYear(); const month = String(now.getMonth() + 1).padStart(2, '0'); const day = String(now.getDate()).padStart(2, '0'); const hours = String(now.getHours()).padStart(2, '0'); const minutes = String(now.getMinutes()).padStart(2, '0'); const seconds = String(now.getSeconds()).padStart(2, '0'); return `${day}-${month}-${year} ${hours}:${minutes}:${seconds}`; };
  const calculateChecksum = (amount, privateKey) => {
    if (typeof amount !== 'number') { amount = parseFloat(amount); if (isNaN(amount)) { console.error("Invalid amount for checksum calculation:", amount); return null; } }
    const data = `${amount}${privateKey}`;
    const checksum = crc32.str(data);
    return checksum >>> 0;
  };


  const handleProceedToPay = async () => {
    if (!validate() || !isBillFetched) return;



    try {
      const checksum = calculateChecksum(amount, 'd8bKEaX1XEtB');
      const formattedDateTime = formatDateTime();
    const transactionRef = transactionId || generateUniqueTransactionId();
      const soapRequest = (billData, amount, checksum) => `
      <?xml version="1.0" encoding="utf-8"?>
      <soap:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
        <soap:Body>
          <PaymentDetails xmlns="http://tempuri.org/">
            <strCANumber>${billData.consumerId}</strCANumber>
            <strInvoiceNo>${billData.invoiceNo}</strInvoiceNo>
            <strDueDate>${billData.dueDate}</strDueDate>
            <strAmount>${amount}</strAmount>
            <strCompanyCode>${'SBPDCL'}</strCompanyCode>
            <strTransactionId>${transactionRef}</strTransactionId>
            <strTransactionDateTime>${formatDateTime()}</strTransactionDateTime> <!-- Current timestamp -->
            <strReceiptNo>${transactionRef}</strReceiptNo> <!-- Generated or passed dynamically -->
            <strBankRefCode>${'BR1234567890'}</strBankRefCode> <!-- Can be dynamic -->
            <strBankId></strBankId> 
            <strPaymentMode>${selectedMethod || 'CreditCard'}</strPaymentMode>
            <strMerchantCode>${MERCHANT_CODE}</strMerchantCode>
            <strMerchantPassword>${MERCHANT_PASSWORD}</strMerchantPassword>
            <strCkeckSum>${checksum}</strCkeckSum> <!-- Call checksum function here -->
          </PaymentDetails>
        </soap:Body>
      </soap:Envelope>
      `.trim();


        const xmlPayload = soapRequest(billData, amount, checksum); 

        if (!xmlPayload) {
          console.error("Failed to generate XML payload due to missing amount.");
          return;
        } const response = await axios.post(SECONDARY_API_URL, xmlPayload, {
          headers: {
            'Content-Type': 'text/xml; charset=utf-8',
            'Accept': 'application/xml, text/xml, application/json',
          },
        });
        console.log(response.data); // Check the response
        const statusFlagMatch = response.data.match(/<StatusFlag>(.*?)<\/StatusFlag>/);
        const messageMatch = response.data.match(/<Message>(.*?)<\/Message>/);
      
        const statusFlag = statusFlagMatch ? statusFlagMatch[1] : null;
        const message = messageMatch ? messageMatch[1] : 'No message found';
      
        if (statusFlag === '1') {
          console.log('Transaction successful:', message);
                  setShowSuccessModal(true);

      
          // Create SOAP request for fetching the receipt
          const receiptSoapRequest = `
            <?xml version="1.0" encoding="utf-8"?>
            <soap:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
              <soap:Body>
                <PaymentReceiptDetails xmlns="http://tempuri.org/">
                  <strTransactionId>${transactionRef}</strTransactionId>
                  <strMerchantCode>${MERCHANT_CODE}</strMerchantCode>
                  <strMerchantPassword>${MERCHANT_PASSWORD}</strMerchantPassword>
                </PaymentReceiptDetails>
              </soap:Body>
            </soap:Envelope>
          `.trim();
      
          try {
            const receiptResponse = await axios.post('/BiharService/BillInterface.asmx?op=PaymentReceiptDetails', receiptSoapRequest, {
              headers: {
                'Content-Type': 'text/xml; charset=utf-8',
                'Accept': 'application/xml, text/xml, application/json',
              },
            });
      
            console.log('Receipt Response:', receiptResponse.data);
            const response = receiptResponse.data
            const xmlDoc = new DOMParser().parseFromString(response, 'text/xml');
      const receiptData = {
        receiptNo: xmlDoc.getElementsByTagName('BSPDCL_Receipt_No')[0]?.textContent || 'N/A',
        transactionId: xmlDoc.getElementsByTagName('Transaction_Id')[0]?.textContent || 'N/A',
        consumerNo: xmlDoc.getElementsByTagName('CANumber')[0]?.textContent || 'N/A',
        consumerName: xmlDoc.getElementsByTagName('ConsumerName')[0]?.textContent || 'N/A',
        billAmount: xmlDoc.getElementsByTagName('AmountPaid')[0]?.textContent || 'N/A',
        paymentMode: xmlDoc.getElementsByTagName('ModePayment')[0]?.textContent || 'N/A',
        paymentDate: xmlDoc.getElementsByTagName('PaymentDateTime')[0]?.textContent || 'N/A',
      };

      // Set the parsed data in state
      setData(receiptData);
            
          } catch (error) {
            console.error('Error fetching receipt:', error);
          }
        } else {
          console.error('Transaction failed:', message);
        }
      } catch (error) {
        console.error('Error during payment or receipt fetch:', error);
        if (error.response) {
          console.error('Error Response:', error.response.data); // Log the error response if available
        }
      }
    }


    const parser = new DOMParser();
    // const xmlDoc = parser.parseFromString(response.data, 'text/xml');

    // const receiptData = {
    //   receiptNo: xmlDoc.getElementsByTagName('BSPDCL_Receipt_No')[0]?.textContent,
    //   transactionId: xmlDoc.getElementsByTagName('Transaction_Id')[0]?.textContent,
    //   consumerId: xmlDoc.getElementsByTagName('CANumber')[0]?.textContent,
    //   consumerName: xmlDoc.getElementsByTagName('ConsumerName')[0]?.textContent,
    //   billNo: xmlDoc.getElementsByTagName('BillNo')[0]?.textContent,
    //   billDueDate: xmlDoc.getElementsByTagName('BillDueDate')[0]?.textContent,
    //   amountPaid: xmlDoc.getElementsByTagName('AmountPaid')[0]?.textContent,
    //   paymentDateTime: xmlDoc.getElementsByTagName('PaymentDateTime')[0]?.textContent,
    //   modePayment: xmlDoc.getElementsByTagName('ModePayment')[0]?.textContent,
    // };

    // // Set the extracted data in state
    // setData(receiptData);

  const generateUniqueTransactionId = () => `OP${Date.now()}`;




  // try {
  //   const response = await fetch('/payment', {
  //     method: 'POST',
  //     headers: {
  //       'Content-Type': 'application/json',
  //     },
  //     body: JSON.stringify({
  //       userId,
  //       consumerId: consumerId,
  //       mobileNumber,
  //       amount,
  //       paymentMethod: selectedMethod,
  //       remark,
  //       consumerName: billDetails.consumerName,
  //       divisionName: billDetails.divisionName,
  //       subDivision: billDetails.subDivision,
  //     }),
  //   });

  //     const result = await response.json();
  //     if (response.ok && result.success) {
  //       setTransactionId(result.data.invoice?.transactionId || 'N/A');
  //       setData(result.data.invoice);
  //       setShowSuccessModal(true);
  //       // Reset form fields
  //       setConsumerId('');
  //       setMobileNumber('');
  //       setAmount(defaultAmount); // Reset to default amount
  //       setRemark('');
  //       setBillDetails({});
  //       setIsBillFetched(false);
  //       setErrors({});
  //     } else {
  //       const errorMessage = result.error.length > 0 ? result.error[0] : 'An unknown error occurred.';
  //       alert(`Error: ${errorMessage}`);
  //     }
  //   } catch (error) {
  //     console.error('Error processing payment:', error);
  //     alert('An error occurred while processing the payment.');
  //   }
  // };


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
    // Check if the entered PIN is correct
    if (pin === '1234') { // Replace with your actual PIN logic
      setShowPinModal(false); // Close the PIN modal
      await handleProceedToPay(); // Proceed to payment
    } else {
      setPinError('Incorrect PIN. Please try again.'); // Show error if PIN is incorrect
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



  const formatAmount = (value) => {
    return new Intl.NumberFormat('en-IN').format(value);
  };



  // const formatAmount = (value) => {
  //   return new Intl.NumberFormat('en-IN', {
  //     style: 'currency',
  //     currency: 'INR',
  //   }).format(value);
  // };

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
              <p><strong>Consumer Name:</strong> {billData.consumerName || 'N/A'}</p>
              <p><strong>Mobile No:</strong> {billData.mobileNo || 'N/A'}</p>
              <p><strong>Address:</strong> {billData.address || 'N/A'}</p>
              <p><strong>Division Name:</strong> {billData.divisionName || 'N/A'}</p>
              <p><strong>Sub Division:</strong> {billData.subDivision || 'N/A'}</p>
              <p><strong>Company Name:</strong> {billData.companyName || 'N/A'}</p>
              <p><strong>Bill Month:</strong> {billData.billMonth || 'N/A'}</p>
              <p><strong>Amount:</strong> {billData.amount || 'N/A'}</p>
              <p><strong>Due Date:</strong> {billData.dueDate || 'N/A'}</p>
              <p><strong>Invoice NO:</strong> {billData.invoiceNo || 'N/A'}</p>


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
                    onBlur={handleConsumerIdBlur} // Validate on blur
                    onFocus={handleConsumerIdFocus}
                    placeholder="Enter Consumer ID"
                  />
                  {formSubmitted && consumerIdError && <p className="text-danger">{consumerIdError}</p>}
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
                  <CFormLabel htmlFor="amount">Amount</CFormLabel>
                  <CFormInput
                    type="text"
                    id="amount"
                    value={formatAmount(amount)}
                    onChange={(e) => setAmount(e.target.value)}
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

          <p><strong>Date/Time:</strong>  {formatKolkataTime(data.paymentDate) || "N/A"}</p>

          <p><strong>Receipt No.:</strong> {data.receiptNo || 'N/A'}</p>

          <p><strong>Consumer No.:</strong> {data.consumerNo || 'N/A'}</p>

          <p><strong>Consumer Name:</strong> {data.consumerName || 'N/A'}</p>

          <p><strong>Payment Amt.:</strong> {data.billAmount || 'N/A'}</p>

          <p><strong>Payment Mode:</strong> {data.paymentMode || 'N/A'}</p>

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

export default PaymentOnline;