import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import { Link, useParams } from "react-router-dom";
import {
  CCard,
  CCardBody,
  CCardHeader,
  CCardFooter,
  CRow,
  CCol,
  CButton,
  CModal,
  CModalHeader,
  CModalBody,
  CModalFooter,
  CFormLabel,
  CFormInput,
  CFormSelect,
  CInputGroup,
  CInputGroupText,
} from "@coreui/react";
import { CModalTitle, CForm } from '@coreui/react';

import CIcon from '@coreui/icons-react'; // Default import
import { cilImage } from '@coreui/icons'; // Named import


const Profile = () => {
  const { userId } = useParams();

  console.log("User ID from useParams:", userId);

  const [balance, setBalance] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [fundAmount, setFundAmount] = useState("");
  const [bankReference, setBankReference] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");
  const [bankName, setBankName] = useState("");
  const [datePayment, setDatePayment] = useState(""); // State for datePayment
  const [errors, setErrors] = useState({});
  const [fundRequestMethods, setFundRequestMethods] = useState({});
  // const userName = "Test";
  const availableBalance = "0";
  const [imagePreview, setImagePreview] = useState(null);
  const [fileNames, setFileNames] = useState({ photograph: "" });
  const fileInputRef = useRef(null);

  const [adminData, setAdminData] = useState({
    name: '',
    email: '',
    password: '',
  });


  const handleFormSubmit = (e) => {
    e.preventDefault();
    console.log('Creating SuperAdmin with data:', adminData);

    // You can make an API call here to create the SuperAdmin

    // Close the modal after submission
    setModalVisible(false);
  };

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get(`/fetchUserById/${userId}`);
        setUser(response.data.user);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching user data:", err);
        setError("Failed to load user data.");
        setLoading(false);
      }
    };

    fetchUserData();
  }, [userId]);

  useEffect(() => {
    if (!userId) {
      console.error("Invalid userId format:", userId);
      return;
    }

    const fetchBalance = async () => {
      try {
        const response = await axios.get(`/balance/${userId}`);
        setBalance(response.data.balance);
      } catch (err) {
        if (err.response && err.response.status === 404) {
          // Handle case where the wallet does not exist
          setBalance(null); // No wallet found for this user
        } else {
          console.error("Error fetching balance:", err);
          setError("Failed to fetch balance");
        }
      } finally {
        setLoading(false);
      }
    };


    fetchBalance();
  }, [userId]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`/fetchUserList/${userId}`);
        const result = response.data.fetchUser || {};

        // Update state with the fetched data


        setFundRequestMethods({
          bankTransfer: result.bankTransfer || false,
          upi: result.upi || false,
          cash: result.cash || false,
          cdm: result.cdm || false,
        });


      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    if (userId) {
      fetchData();
    }
  }, [userId]);

  const handleRequestFund = async (e) => {
    e.preventDefault();
    const newErrors = {};

    if (!fundAmount) newErrors.fundAmount = "Amount is required";
    if (paymentMethod !== "cash") {
      if (!bankReference) newErrors.bankReference = "Bank Reference Number is required";
      if (bankReference && bankReference.length < 6)
        newErrors.bankReference = "Bank Reference Number must be at least 6 characters";
      if (!paymentMethod) newErrors.paymentMethod = "Payment Method is required";
      if (paymentMethod === "bank-transfer" && !bankName)
        newErrors.bankName = "Bank Name is required";
    }
    if (!datePayment) newErrors.datePayment = "Date of deposit is required";

    // If there are errors, display them and stop submission
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      console.log("Sending fund request:", {
        userId,
        fundAmount,
        bankReference,
        paymentMethod,
        datePayment,
      });

      const response = await axios.post("/fund-request", {
        userId,
        fundAmount,
        bankReference,
        paymentMethod,
        bankName,
        datePayment,
      });

      console.log("Response from server:", response);

      setFundAmount("");
      setBankReference("");
      setPaymentMethod("");
      setBankName("");
      setDatePayment(""); // Clear datePayment
      setImagePreview(null); // Clear the image preview
      setFileNames((prev) => ({ ...prev, photograph: '' }));
      setModalVisible(false);
    } catch (error) {
      console.error("Error requesting fund:", error);
      setError("Failed to request fund");
    }
  };

  const handleInputChange = (e) => {
    const { id, value } = e.target;

    // Update state based on the input field
    if (id === "fund-amount") setFundAmount(value);
    if (id === "bank-reference") setBankReference(value);
    if (id === "payment-method") setPaymentMethod(value);
    if (id === "bank-name") setBankName(value);
    if (id === "date-payment") setDatePayment(value);

    // Clear error for the specific field being changed
    setErrors((prevErrors) => ({
      ...prevErrors,
      [id]: "", // Clear only the error related to the field being changed
    }));
  };

  const handleInputFocus = (e) => {
    const { id } = e.target;

    // Clear error for the specific field being focused
    setErrors((prevErrors) => {
      const newErrors = { ...prevErrors };

      // Map input IDs to the corresponding error keys
      if (id === "fund-amount") delete newErrors.fundAmount;
      if (id === "bank-reference") delete newErrors.bankReference;
      if (id === "payment-method") delete newErrors.paymentMethod;
      if (id === "bank-name") delete newErrors.bankName;
      if (id === "date-payment") delete newErrors.datePayment;

      return newErrors;
    });
  };


  const handleFileChange = (event) => {
    const file = event.target.files[0];

    // Check if a file is selected
    if (!file) {
      setErrors((prev) => ({ ...prev, image: 'File is required.' }));
      setFileNames((prev) => ({ ...prev, photograph: '' }));
      setImagePreview(null);
      return;
    }

    // Validation: Check file type
    const validTypes = ['image/jpeg', 'image/png', 'image/gif'];
    if (!validTypes.includes(file.type)) {
      setErrors((prev) => ({ ...prev, photograph: 'Please upload a valid image (JPG, PNG, GIF).' }));
      setFileNames((prev) => ({ ...prev, photograph: '' }));
      setImagePreview(null);
      return;
    }

    // Validation: Check file size (5MB limit)
    const maxSize = 5 * 1024 * 1024; // 5MB in bytes
    if (file.size > maxSize) {
      setErrors((prev) => ({ ...prev, photograph: 'File size must be less than 5MB.' }));
      setFileNames((prev) => ({ ...prev, photograph: '' }));
      setImagePreview(null);
      return;
    }

    // If valid, set file name and preview
    setFileNames((prev) => ({ ...prev, photograph: file.name }));
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
    };
    reader.readAsDataURL(file);
  };


  const handleButtonClick = (inputId) => {
    if (inputId === "photograph") {
      fileInputRef.current.click();
    }
  };



  const date = new Date();
  const month = date.toLocaleString("default", { month: "long" });
  const year = date.getFullYear();

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <>
      <CCard className="mb-4">
        <CCardHeader>
          <h4>Profile</h4>
        </CCardHeader>
        <CCardBody>
          <CRow className="justify-content-center">
            <CCol sm={balance !== null ? 6 : 12} className="text-center ">
              {user ? (
                <>
                  <h5>Account ID : {user.userId}</h5>
                  <h5>
                    Agency Firm Name : {"OrangePay"}
                  </h5>
                  <h5>Registered Name: {user.name}</h5>
                  <h5>Registered E-Mail ID : {user.email}</h5>
                  <h5>Registered Mobile No. : {user.mobileNumber}</h5>
                </>
              ) : (
                <h5>Loading user data...</h5>
              )}
            </CCol>
            <CCol sm={6} className="text-center mt-4">
              {balance !== null && (
                <>
                  <h5>Available Balance: {balance}</h5>
                  <h5>
                    Margin ({month} {year}): {availableBalance}
                  </h5>
                </>
              ) }
            </CCol>
          </CRow>
        </CCardBody>
        <CCardFooter className="text-center">
          <Link to={`/update-user/${userId}`}>
            <CButton color="success" size="lg" className="me-3">
              Update User
            </CButton>
          </Link>
          {balance !== null ? (
            <CButton
              color="primary"
              size="lg"
              onClick={() => setModalVisible(true)}
            >
              Request Fund
            </CButton>
          ) : (
            <CButton
            color="primary"
            size="lg"
            onClick={() => setModalVisible(true)}
          >
            Create SuperAdmin
          </CButton>
          )}
        </CCardFooter>
      </CCard>

      <CModal visible={modalVisible} onClose={() => setModalVisible(false)}>
        <CModalHeader closeButton>
          <h5>Request Fund</h5>
        </CModalHeader>
        <CModalBody>
          <form onSubmit={handleRequestFund}>
            <CFormLabel htmlFor="fund-amount">Amount</CFormLabel>
            <CFormInput
              name="fundAmount"
              id="fund-amount"
              type="number"
              value={fundAmount}
              onChange={handleInputChange}
              onFocus={handleInputFocus}
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
              onFocus={handleInputFocus}

            />
            {errors.datePayment && (
              <div className="text-danger">{errors.datePayment}</div>
            )}


            <CFormLabel htmlFor="payment-method" className="mt-3">
              Payment Method
            </CFormLabel>
            <div className="d-flex justify-content-between mt-2">
              {fundRequestMethods.bankTransfer && (
                <div className={`card p-3 m-1 ${paymentMethod === "bank-transfer" ? "border-primary" : "border-light"}`}>
                  <input
                    type="radio"
                    id="payment-method-bank-transfer"
                    name="paymentMethod"
                    value="bank-transfer"
                    checked={paymentMethod === "bank-transfer"}
                    onChange={handleInputChange} // Directly handle input change here
                    className="d-none" // Hide the default radio button
                  />
                  <label
                    htmlFor="payment-method-bank-transfer"
                    className="text-center w-100"
                    onClick={() => setPaymentMethod("bank-transfer")} // Simplified setting state
                  >
                    Bank Transfer
                  </label>
                </div>
              )}
              {fundRequestMethods.upi && (
                <div className={`card p-3 m-1 ${paymentMethod === "upi" ? "border-primary" : "border-light"}`}>
                  <input
                    type="radio"
                    id="payment-method-upi"
                    name="paymentMethod"
                    value="upi"
                    checked={paymentMethod === "upi"}
                    onChange={handleInputChange}
                    className="d-none"
                  />
                  <label
                    htmlFor="payment-method-upi"
                    className="text-center w-100"
                    onClick={() => setPaymentMethod("upi")}
                  >
                    UPI
                  </label>
                </div>
              )}
              {fundRequestMethods.cash && (
                <div className={`card p-3 m-1 ${paymentMethod === "cash" ? "border-primary" : "border-light"}`}>
                  <input
                    type="radio"
                    id="payment-method-cash"
                    name="paymentMethod"
                    value="cash"
                    checked={paymentMethod === "cash"}
                    onChange={handleInputChange}
                    className="d-none"
                  />
                  <label
                    htmlFor="payment-method-cash"
                    className="text-center w-100"
                    onClick={() => setPaymentMethod("cash")}
                  >
                    Cash
                  </label>
                </div>
              )}
              {fundRequestMethods.cdm && (
                <div className={`card p-3 m-1 ${paymentMethod === "cdm" ? "border-primary" : "border-light"}`}>
                  <input
                    type="radio"
                    id="payment-method-cdm"
                    name="paymentMethod"
                    value="cdm"
                    checked={paymentMethod === "cdm"}
                    onChange={handleInputChange}
                    className="d-none"
                  />
                  <label
                    htmlFor="payment-method-cdm"
                    className="text-center w-100"
                    onClick={() => setPaymentMethod("cdm")}
                  >
                    CDM
                  </label>
                </div>
              )}
            </div>


            {/* <CFormSelect
              name="paymentMethod"
              id="payment-method"
              value={paymentMethod}
              onChange={handleInputChange}
              onFocus={handleInputFocus}
            >
              <option value="" disabled>Select Payment Method</option>
              <option value="bank-transfer">Bank Transfer</option>
              <option value="upi">UPI</option>
              <option value="cdm">CDM</option>
              <option value="cash">Cash</option>
            </CFormSelect> */}
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
                  onFocus={handleInputFocus}
                  style={{ textTransform: "uppercase" }}
                />
                {errors.bankReference && (
                  <div className="text-danger">{errors.bankReference}</div>
                )}
              </>
            )}
            {paymentMethod === "cdm" && (
              <>
                <CFormLabel htmlFor="bank-reference" className="mt-3">
                  Serial Number
                </CFormLabel>
                <CFormInput
                  name="bankReference"
                  id="bank-reference"
                  type="text"
                  value={bankReference}
                  onChange={handleInputChange}
                  onFocus={handleInputFocus}
                  style={{ textTransform: "uppercase" }}
                />
                {errors.bankReference && (
                  <div className="text-danger">{errors.bankReference}</div>
                )}
              </>
            )}




            {paymentMethod === "bank-transfer" && (
              <>
                <CFormLabel htmlFor="bank-name" className="mt-3">
                  Bank Name
                </CFormLabel>
                <CFormSelect
                  name="bankName"
                  id="bank-name"
                  value={bankName}
                  onChange={handleInputChange}
                >
                  <option value="">Select Bank</option>
                  <option value="state-bank-of-india">
                    State Bank of India
                  </option>
                  <option value="hdfc-bank">HDFC Bank</option>
                  <option value="icici-bank">ICICI Bank</option>
                </CFormSelect>
                {errors.bankName && (
                  <div className="text-danger">{errors.bankName}</div>
                )}
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
                  <CButton
                    color="secondary"
                    onClick={() => handleButtonClick("photograph")}
                  >
                    {fileNames.photograph || " Upload Image"}
                  </CButton>

                </CInputGroup>
                {errors.photograph && (
                  <div className="text-danger">{errors.photograph}</div>
                )}
              </>
            )}









            <CModalFooter>
              <CButton
                color="secondary"
                type="button"
                onClick={() => setModalVisible(false)}
              >
                Cancel
              </CButton>
              <CButton color="primary" type="submit">
                Request Fund
              </CButton>
            </CModalFooter>
          </form>
        </CModalBody>
      </CModal>



      <CModal visible={modalVisible} onClose={() => setModalVisible(false)}>
        <CModalHeader onClose={() => setModalVisible(false)}>
          <CModalTitle>Create SuperAdmin</CModalTitle>
        </CModalHeader>
        <CModalBody>
          {/* Form to create SuperAdmin */}
          <CForm onSubmit={handleFormSubmit}>
            <CFormInput
              type="text"
              name="name"
              value={adminData.name}
              onChange={handleInputChange}
              label="Full Name"
              placeholder="Enter name"
              required
            />
            <CFormInput
              type="email"
              name="email"
              value={adminData.email}
              onChange={handleInputChange}
              label="Email"
              placeholder="Enter email"
              required
            />
            <CFormInput
              type="password"
              name="password"
              value={adminData.password}
              onChange={handleInputChange}
              label="Password"
              placeholder="Enter password"
              required
            />
          </CForm>
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={() => setModalVisible(false)}>
            Close
          </CButton>
          <CButton color="primary" onClick={handleFormSubmit}>
            Create Admin
          </CButton>
        </CModalFooter>
      </CModal>
    </>
  );
};

export default Profile;
