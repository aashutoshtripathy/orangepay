import React, { useEffect, useState } from "react";
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
} from "@coreui/react";

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
  const [errors, setErrors] = useState({});
  // const userName = "Test";
  const availableBalance = "0";

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
        console.error("Error fetching balance:", err);
        setError("Failed to fetch balance");
      } finally {
        setLoading(false);
      }
    };

    fetchBalance();
  }, [userId]);

  const handleRequestFund = async (e) => {
    e.preventDefault();
    const newErrors = {};

    if (!fundAmount) newErrors.fundAmount = "Amount is required";
    if (!bankReference)
      newErrors.bankReference = "Bank Reference Number is required";
    if (bankReference && bankReference.length < 6)
      newErrors.bankReference =
        "Bank Reference Number must be at least 6 characters";
    if (!paymentMethod) newErrors.paymentMethod = "Payment Method is required";
    if (paymentMethod === "bank-transfer" && !bankName)
      newErrors.bankName = "Bank Name is required";

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
      });

      const response = await axios.post("/fund-request", {
        userId,
        fundAmount,
        bankReference,
        paymentMethod,
        bankName,
      });

      console.log("Response from server:", response);

      setFundAmount("");
      setBankReference("");
      setPaymentMethod("");
      setBankName("");
      setModalVisible(false);
    } catch (error) {
      console.error("Error requesting fund:", error);
      setError("Failed to request fund");
    }
  };

  const handleInputChange = (e) => {
    const { id, value } = e.target;

    if (id === "fund-amount") setFundAmount(value);
    if (id === "bank-reference") setBankReference(value);
    if (id === "payment-method") setPaymentMethod(value);
    if (id === "bank-name") setBankName(value);

    setErrors((prevErrors) => ({
      ...prevErrors,
      [id]: "",
    }));
  };

  const handleInputFocus = (e) => {
    const { id } = e.target;
    setErrors((prevErrors) => ({
      ...prevErrors,
      [id]: "",
    }));
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
            <CCol sm={6} className="text-center ">
              {user ? (
                <>
                  <h5>Account ID : {user.userId}</h5>
                  <h5>
                    Agency Firm Name : {process.env.REACT_APP_COMPANY_NAME}
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
              <h5>Available Balance : {balance}</h5>
              <h5>
                Margin ({month} {year}) : {availableBalance}
              </h5>
            </CCol>
          </CRow>
        </CCardBody>
        <CCardFooter className="text-center">
          <Link to={`/update-user/${userId}`}>
          <CButton color="success" size="lg" className="me-3">
              Update User
          </CButton>
          </Link>
          <CButton
            color="primary"
            size="lg"
            onClick={() => setModalVisible(true)}
          >
            Request Fund
          </CButton>
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

            <CFormLabel htmlFor="payment-method" className="mt-3">
              Payment Method
            </CFormLabel>
            <CFormSelect
              name="paymentMethod"
              id="payment-method"
              value={paymentMethod}
              onChange={handleInputChange}
              onFocus={handleInputFocus}
            >
              <option value="">Select Payment Method</option>
              <option value="bank-transfer">Bank Transfer</option>
              <option value="upi">UPI</option>
              <option value="card">Card</option>
              <option value="paypal">PayPal</option>
              <option value="net-banking">Net Banking</option>
            </CFormSelect>
            {errors.paymentMethod && (
              <div className="text-danger">{errors.paymentMethod}</div>
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
    </>
  );
};

export default Profile;
