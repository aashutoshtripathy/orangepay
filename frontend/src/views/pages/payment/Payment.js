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

  const handleFetchBill = async () => {
    setFormSubmitted(true);
    setIsBillFetched(true);
    setFetchBillSuccess(true); // Indicate that the bill has been fetched successfully


    // if (!validate()) return;

    // try {
    //   const response = await fetch(`/fetch-bill/${consumerId}`); // Adjust API endpoint as needed
    //   const data = await response.json();

    //   if (response.ok && data.success) {
    //     setBillDetails(data.bill); // Set fetched bill details
    //     setIsBillFetched(true); // Mark bill as fetched
    //   } else {
    //     alert(`Error: ${data.message}`);
    //   }
    // } catch (error) {
    //   console.error('Error fetching bill:', error);
    //   alert('An error occurred while fetching the bill.');
    // }
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
        // setTransactionId(data.data.transactionId);
        setTransactionId(data.data?.TxnId || "N/A"); // Fallback to "N/A" if TxnId is missing
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
                id="defaultAmount"
                value={defaultAmount}
                onChange={(e) => setDefaultAmount(Number(e.target.value))}
                placeholder="Enter default amount"
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
