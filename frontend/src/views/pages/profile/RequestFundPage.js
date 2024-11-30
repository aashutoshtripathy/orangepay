import React, { useState, useRef } from 'react';
import axios from 'axios';
import {
  CContainer,
  CRow,
  CCol,
  CButton,
  CFormLabel,
  CFormInput,
  CFormSelect,
  CInputGroup,
  CInputGroupText,
  CModal,
  CModalHeader,
  CModalBody,
  CModalFooter,
  CCard,
  CCardHeader,
  CCardBody
} from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { cilImage } from '@coreui/icons';

const RequestFundPage = () => {
  const [fundAmount, setFundAmount] = useState('');
  const [datePayment, setDatePayment] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('');
  const [bankReference, setBankReference] = useState('');
  const [bankName, setBankName] = useState('');
  const [fileNames, setFileNames] = useState({});
  const [successModal, setSuccessModal] = useState(false);
  const [errors, setErrors] = useState({});
  const fileInputRef = useRef(null);
  const userId = localStorage.getItem('userId')

  const fundRequestMethods = {
    "bank-transfer": 'Bank Transfer',
    upi: 'UPI',
    cash: 'Cash',
    cdm: 'CDM',
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    if (name === 'fundAmount') setFundAmount(value);
    else if (name === 'datePayment') setDatePayment(value);
    else if (name === 'paymentMethod') setPaymentMethod(value);
    else if (name === 'bankReference') setBankReference(value);
    else if (name === 'bankName') setBankName(value);
  };

  const handleRequestFund = async (event) => {
    event.preventDefault();

    try {
      const response = await axios.post("/api/v1/users/fund-request", {
        userId,
        fundAmount,
        bankReference,
        paymentMethod,
        bankName,
        datePayment,
      });
      
      console.log(response);

      if (response.status === 201) {
        // alert("Fund request submitted successfully");
        setSuccessModal(true);
        setFundAmount('');
        setDatePayment('');
        setPaymentMethod('');
        setBankReference('');
        setBankName('');
        setFileNames({});
      }
    } catch (error) {
      // Handle error response
      setErrors({ api: error.response?.data?.message || "An error occurred" });
    }
  };

  const handleFileChange = (event) => {
    const { name } = event.target;
    setFileNames({ ...fileNames, [name]: event.target.files[0].name });
  };

  const handleButtonClick = () => {
    fileInputRef.current.click();
  };

  return (
    <CContainer className="p-4">
    <CRow className="justify-content-center">
      <CCol md={6}>
        <CCard>
          <CCardHeader>
            <h5 style={{color:"#f36c23"}}>Request Fund</h5>
          </CCardHeader>
          <CCardBody>

          <form onSubmit={handleRequestFund}>
            <CFormLabel htmlFor="fund-amount">Amount</CFormLabel>
            <CFormInput
              name="fundAmount"
              id="fund-amount"
              type="text"
              value={fundAmount}
              onChange={handleInputChange}
            />
            {errors.fundAmount && (
              <div className="text-danger">{errors.fundAmount}</div>
            )}

            <CFormLabel htmlFor="date-payment" className="mt-3">
              Date of Deposit
            </CFormLabel>
            <CFormInput
              name="datePayment"
              id="date-payment"
              type="date"
              value={datePayment}
              onChange={handleInputChange}
            />
            {errors.datePayment && (
              <div className="text-danger">{errors.datePayment}</div>
            )}

            <CFormLabel htmlFor="payment-method" className="mt-3">
              Payment Method
            </CFormLabel>
            <div className="d-flex justify-content-between mt-2">
              {Object.entries(fundRequestMethods).map(([key, label]) => (
                <div
                  key={key}
                  className={`card p-3 m-1 ${paymentMethod === key ? "border-primary" : "border-light"}`}
                  onClick={() => setPaymentMethod(key)}
                  style={{ cursor: 'pointer' }}
                >
                  <input
                    type="radio"
                    id={`payment-method-${key}`}
                    name="paymentMethod"
                    value={key}
                    checked={paymentMethod === key}
                    onChange={handleInputChange}
                    className="d-none"
                  />
                  <label htmlFor={`payment-method-${key}`} className="text-center w-100">
                    {label}
                  </label>
                </div>
              ))}
            </div>
            {errors.paymentMethod && (
              <div className="text-danger">{errors.paymentMethod}</div>
            )}

            {paymentMethod !== "cdm" && (
              <>
                <CFormLabel htmlFor="bank-reference" className="mt-3">
                  Bank Reference Number
                </CFormLabel>
                <CFormInput
                  name="bankReference"
                  id="bank-reference"
                  type="text"
                  value={bankReference}
                  onChange={handleInputChange}
                  style={{ textTransform: "uppercase" }}
                />
                {errors.bankReference && (
                  <div className="text-danger">{errors.bankReference}</div>
                )}
              </>
            )}

            {paymentMethod === "bank-transfer" && (
                <>
            {/* //   <div className="card p-3 m-1 border-primary"> */}
                <CFormLabel htmlFor="bank-name" className="mt-3">
                  Bank Name
                </CFormLabel>
                <CFormSelect
                  name="bankName"
                  id="bank-name"
                  value={bankName}
                  onChange={handleInputChange}
                >
                  <option value="" hidden>Select Bank</option>
                  <option value="state-bank-of-india">State Bank of India</option>
                  <option value="hdfc-bank">HDFC Bank</option>
                  <option value="icici-bank">ICICI Bank</option>
                </CFormSelect>
                {errors.bankName && (
                  <div className="text-danger">{errors.bankName}</div>
                )}
              {/* </div> */}
              </>
            )}

            {paymentMethod !== "upi" && (
              <>
                <CInputGroup className="mb-3 mt-3">
                  <CInputGroupText>
                    <CIcon icon={cilImage} />
                  </CInputGroupText>
                  <CFormInput
                    ref={fileInputRef}
                    id="photograph"
                    name="photograph"
                    type="file"
                    onChange={handleFileChange}
                    style={{ display: "none" }}
                  />
                  <CButton color="secondary" onClick={handleButtonClick}>
                    {fileNames.photograph || "Upload Image"}
                  </CButton>
                </CInputGroup>
                {errors.photograph && (
                  <div className="text-danger">{errors.photograph}</div>
                )}
              </>
            )}
            <CButton color="primary" style={{backgroundColor:"#f36c23",border:"none"}} type="submit" className="mt-4">
              Request Fund
            </CButton>
          </form>
          </CCardBody>
          </CCard>


          <CModal visible={successModal} onClose={() => setSuccessModal(false)}>
            <CModalHeader>Success</CModalHeader>
            <CModalBody>Your fund request has been submitted successfully!</CModalBody>
            <CModalFooter>
              <CButton color="primary" onClick={() => setSuccessModal(false)}>
                Close
              </CButton>
            </CModalFooter>
          </CModal>
        </CCol>
      </CRow>
    </CContainer>
  );
};

export default RequestFundPage;
