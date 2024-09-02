import React, { useRef, useState } from "react";
import axios from "axios";
import {
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CCardFooter,
  CCol,
  CContainer,
  CForm,
  CFormInput,
  CInputGroup,
  CInputGroupText,
  CRow,
  CFormCheck,
  CModal,
  CModalBody,
  CModalFooter,
  CModalHeader,
  CModalTitle,
} from "@coreui/react";
import {
  cilUser,
  cilCalendar,
  cilPhone,
  cilEnvelopeClosed,
  cilImage,
} from "@coreui/icons";
import CIcon from "@coreui/icons-react";
// import {
//   cilUser,
//   cilCalendar,
//   cilPhone,
//   cilEnvelopeClosed,
//   cilImage,
// } from "@coreui/icons";
import { Link, useNavigate } from "react-router-dom";

const Register = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const navigate = useNavigate();
  const [fileNames, setFileNames] = useState({
    photograph: "",
    aadharCard: "",
    signature: "",
    panCard: "",
    educationCertificate: "",
    cheque: "",
  });
  const fileInputRefs = {
    photograph: useRef(null),
    signature: useRef(null),
    aadharCard: useRef(null),
    panCard: useRef(null),
    educationCertificate: useRef(null),
    cheque: useRef(null),
  };

  const [formData, setFormData] = useState({
    name: "",
    fatherOrHusbandName: "",
    dob: "",
    aadharNumber: "",
    panNumber: "",
    mobileNumber: "",
    gender: "",
    maritalStatus: "",
    education: [],
    address: "",
    salaryBasis: "",
    email: "",
    division: "",
    subDivision: "",
    section: "",
    sectionType: "",
    photograph: null,
    aadharCard: null,
    panCard: null,
    educationCertificate: null,
    cheque: null,
    district: "", // Add this field
    pincode: "", // Add this field
    bank: "", // Add this field
    accountno: "",
    ifsc: "", // Add this field
  });

  const [errors, setErrors] = useState({});

  const validateForm = () => {
    let formErrors = {};

    // Name validation
    if (!formData.name.trim()) {
      formErrors.name = "Name is required";
    }

    // Father's/Husband's Name validation
    if (!formData.fatherOrHusbandName.trim()) {
      formErrors.fatherOrHusbandName = "Father's/Husband's Name is required";
    }

    // Date of Birth validation
    if (!formData.dob) {
      formErrors.dob = "Date of Birth is required";
    }

    if (!formData.division.trim()) {
      formErrors.division = "Division is required";
    }

    if (!formData.subDivision.trim()) {
      formErrors.subDivision = "Subdivision is required";
    }

    if (!formData.section.trim()) {
      formErrors.section = "Section is required";
    }

    if (formData.education.length === 0) {
      formErrors.education = "Please select at least one education level.";
    }

    // Aadhar Number validation
    if (!formData.aadharNumber) {
      formErrors.aadharNumber = "Aadhar Number is required";
    } else if (formData.aadharNumber.length < 12) {
      formErrors.aadharNumber = "Aadhar Number must be 12 digits long";
    }

    // PAN Number validation
    if (!formData.panNumber) {
      formErrors.panNumber = "PAN Number is required";
    } else if (formData.panNumber.length < 10) {
      formErrors.panNumber = "Pan Number Must be 10 charecters";
    }

    // Mobile Number validation
    if (!formData.mobileNumber) {
      formErrors.mobileNumber = "Mobile Number is required";
    } else if (formData.mobileNumber.length < 10) {
      formErrors.mobileNumber = "Mobile Number must be 10 digits long";
    }

    // Email validation
    if (!formData.email) {
      formErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      formErrors.email = "Email address is invalid";
    }

    // Gender validation
    if (!formData.gender) {
      formErrors.gender = "Gender is required";
    }

    // Marital Status validation
    if (!formData.maritalStatus) {
      formErrors.maritalStatus = "Marital Status is required";
    }

    // Address validation
    if (!formData.address.trim()) {
      formErrors.address = "Address is required";
    }

    // Salary Basis validation
    if (!formData.salaryBasis) {
      formErrors.salaryBasis = "Job Type is required";
    }

    // Section Type validation
    if (!formData.sectionType) {
      formErrors.sectionType = "Section Type is required";
    }

    // Bank validation
    if (!formData.bank) {
      formErrors.bank = "Bank is required";
    }

    // IFSC validation
    if (!formData.ifsc) {
      formErrors.ifsc = "IFSC is required";
    }

    // Account Number validation
    if (!formData.accountno) {
      formErrors.accountno = "Account Number is required";
    }

    // District validation
    if (!formData.district) {
      formErrors.district = "District is required";
    }

    // Pincode validation
    if (!formData.pincode) {
      formErrors.pincode = "Pincode is required";
    } else if (formData.pincode.length < 6) {
      formErrors.pincode = "Pincode must be 6 digits long";
    }

    // File uploads validation (if required)
    if (!formData.photograph) {
      formErrors.photograph = "Photograph is required";
    }
    if (!formData.signature) {
      formErrors.signature = "Signature is required";
    }
    if (!formData.aadharCard) {
      formErrors.aadharCard = "Aadhar Card is required";
    }
    if (!formData.panCard) {
      formErrors.panCard = "PAN Card is required";
    }
    if (!formData.educationCertificate) {
      formErrors.educationCertificate = "Education Certificate is required";
    }
    if (!formData.cheque) {
      formErrors.cheque = "Cheque is required";
    }

    setErrors(formErrors);
    return Object.keys(formErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    if (files.length > 0) {
      setFileNames((prev) => ({
        ...prev,
        [name]: files[0].name,
      }));
      setFormData((prev) => ({
        ...prev,
        [name]: files[0],
      }));
    }
  };

  const handleCheckboxChange = (e) => {
    const { name, value, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: checked
        ? [...prev[name], value]
        : prev[name].filter((item) => item !== value),
    }));
  };

  // const handleSubmit = async (e) => {
  //   e.preventDefault();

  //   const formDataToSend = new FormData();

  //   for (const key in formData) {
  //     if (formData.hasOwnProperty(key) && formData[key] !== null) {
  //       if (Array.isArray(formData[key])) {
  //         formData[key].forEach((value) =>
  //           formDataToSend.append(key, value)
  //         );
  //       } else {
  //         formDataToSend.append(key, formData[key]);
  //       }
  //     }
  //   }

  //   try {
  //     const response = await axios.post("register", formData);
  //     console.log(response.data);
  //   } catch (error) {
  //     console.error("Error in posting the data:", error);
  //   }

  //   setFormData({
  //     name: "",
  //     fatherOrHusbandName: "",
  //     dob: "",
  //     aadharNumber: "",
  //     panNumber: "",
  //     mobileNumber: "",
  //     gender: "",
  //     maritalStatus: "",
  //     education: [],
  //     address: "",
  //     salaryBasis: "",
  //     email: "",
  //     division: "",
  //     subDivision: "",
  //     section: "",
  //     sectionType: "",
  //     photograph: null,
  //     aadharCard: null,
  //     panCard: null,
  //     educationCertificate: null,
  //     cheque: null,
  //   });
  // };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    const formDataToSend = new FormData();

    for (const key in formData) {
      if (formData.hasOwnProperty(key) && formData[key] !== null) {
        if (Array.isArray(formData[key])) {
          formData[key].forEach((value) => formDataToSend.append(key, value));
        } else {
          formDataToSend.append(key, formData[key]);
        }
      }
    }

    try {
      const response = await axios.post("/register", formDataToSend, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      console.log(response.data);
      setModalVisible(true);
    } catch (error) {
      console.error("Error in posting the data:", error);
    }
  };

  const handleModalClose = () => {
    setModalVisible(false);
    navigate("/login"); // Redirect to login page after closing modal
  };

  const handleButtonClick = (inputId) => {
    document.getElementById(inputId).click();
  };

  return (
    <div className="bg-light min-vh-100 d-flex flex-row align-items-center">
      <CContainer>
        <CRow className="justify-content-center">
          <CCol md={10} lg={8} xl={7}>
            <CCard className="shadow-lg">
              <CCardHeader className="text-center">
                <h2>Register</h2>
                <p className="text-muted">Fill in the details below</p>
              </CCardHeader>
              <CCardBody className="p-4">
                <CForm onSubmit={handleSubmit}>
                  <CRow>
                    <CCol md={12} className="mb-3">
                      <CInputGroup className="mb-3">
                        <CInputGroupText>
                          <CIcon icon={cilUser} />
                        </CInputGroupText>
                        <CFormInput
                          name="name"
                          placeholder="Name"
                          value={formData.name}
                          onChange={handleChange}
                          style={{ textTransform: "capitalize" }}
                          autoComplete="name"
                        />
                      </CInputGroup>
                      {errors.name && (
                        <p className="text-danger">{errors.name}</p>
                      )}

                      <CInputGroup className="mb-3">
                        <CInputGroupText>
                          <CIcon icon={cilUser} />
                        </CInputGroupText>
                        <CFormInput
                          name="fatherOrHusbandName"
                          placeholder="Father's/Husband Name"
                          value={formData.fatherOrHusbandName}
                          onChange={handleChange}
                          style={{ textTransform: "capitalize" }}
                          autoComplete="family-name"
                        />
                      </CInputGroup>
                      {errors.fatherOrHusbandName && (
                        <p className="text-danger">
                          {errors.fatherOrHusbandName}
                        </p>
                      )}

                      <CInputGroup className="mb-3">
                        <CInputGroupText>
                          <CIcon icon={cilCalendar} />
                        </CInputGroupText>
                        <CFormInput
                          name="dob"
                          placeholder="Date of Birth"
                          type="date"
                          value={formData.dob}
                          onChange={handleChange}
                          autoComplete="bday"
                        />
                      </CInputGroup>
                      {errors.dob && (
                        <p className="text-danger">{errors.dob}</p>
                      )}
                    </CCol>

                    <CCol md={6}>
                      <CInputGroup className="mb-3">
                        <CInputGroupText>Job Type</CInputGroupText>
                        <div className="d-flex m-2 align-items-center">
                          <CFormCheck
                            variant="inline"
                            type="radio"
                            name="salaryBasis"
                            id="salaryBased"
                            label="Salary Based"
                            value="salary based"
                            checked={formData.salaryBasis === "salary based"}
                            onChange={handleChange}
                          />
                          <CFormCheck
                            variant="inline"
                            type="radio"
                            name="salaryBasis"
                            id="comissionbased"
                            label="Commission Based"
                            value="commission based"
                            checked={
                              formData.salaryBasis === "commission based"
                            }
                            onChange={handleChange}
                          />
                        </div>
                      </CInputGroup>
                      {errors.salaryBasis && (
                        <p className="text-danger">{errors.salaryBasis}</p>
                      )}

                      <CInputGroup className="mb-3">
                        <CInputGroupText>Aadhar</CInputGroupText>
                        <CFormInput
                          name="aadharNumber"
                          placeholder="Aadhar Number"
                          type="number"
                          value={formData.aadharNumber}
                          onChange={handleChange}
                          autoComplete="off"
                        />
                      </CInputGroup>
                      {errors.aadharNumber && (
                        <p className="text-danger">{errors.aadharNumber}</p>
                      )}

                      <CInputGroup className="mb-3">
                        <CInputGroupText>PAN</CInputGroupText>
                        <CFormInput
                          name="panNumber"
                          placeholder="Pan Number"
                          value={formData.panNumber}
                          onChange={handleChange}
                          style={{ textTransform: "uppercase" }}
                          autoComplete="off"
                        />
                      </CInputGroup>
                      {errors.panNumber && (
                        <p className="text-danger">{errors.panNumber}</p>
                      )}

                      <CInputGroup className="mb-3">
                        <CInputGroupText>
                          <CIcon icon={cilPhone} />
                        </CInputGroupText>
                        <CFormInput
                          name="mobileNumber"
                          placeholder="Mobile Number"
                          type="number"
                          value={formData.mobileNumber}
                          onChange={handleChange}
                          autoComplete="tel"
                        />
                      </CInputGroup>
                      {errors.mobileNumber && (
                        <p className="text-danger">{errors.mobileNumber}</p>
                      )}

                      <CInputGroup className="mb-3">
                        <CInputGroupText>
                          <CIcon icon={cilEnvelopeClosed} />
                        </CInputGroupText>
                        <CFormInput
                          name="email"
                          placeholder="Email"
                          type="email"
                          value={formData.email}
                          onChange={handleChange}
                          autoComplete="email"
                        />
                      </CInputGroup>
                      {errors.email && (
                        <p className="text-danger">{errors.email}</p>
                      )}
                    </CCol>

                    <CCol md={6}>
                      <CInputGroup className="mb-3">
                        <CInputGroupText>Gender</CInputGroupText>
                        <div className="d-flex m-2 align-items-center">
                          <CFormCheck
                            variant="inline"
                            type="radio"
                            name="gender"
                            id="genderMale"
                            label="Male"
                            value="Male"
                            checked={formData.gender === "Male"}
                            onChange={handleChange}
                          />
                          <CFormCheck
                            variant="inline"
                            type="radio"
                            name="gender"
                            id="genderFemale"
                            label="Female"
                            value="Female"
                            checked={formData.gender === "Female"}
                            onChange={handleChange}
                          />
                          <CFormCheck
                            variant="inline"
                            type="radio"
                            name="gender"
                            id="genderOther"
                            label="Other"
                            value="Other"
                            checked={formData.gender === "Other"}
                            onChange={handleChange}
                          />
                        </div>
                      </CInputGroup>
                      {errors.gender && (
                        <p className="text-danger">{errors.gender}</p>
                      )}

                      <CInputGroup className="mb-3">
                        <CInputGroupText>Section Type</CInputGroupText>
                        <div className="d-flex m-2 align-items-center">
                          <CFormCheck
                            variant="inline"
                            type="radio"
                            name="sectionType"
                            id="sectionRural"
                            label="Rural"
                            value="Rural"
                            checked={formData.sectionType === "Rural"}
                            onChange={handleChange}
                          />
                          <CFormCheck
                            variant="inline"
                            type="radio"
                            name="sectionType"
                            id="sectionUrban"
                            label="Urban"
                            value="Urban"
                            checked={formData.sectionType === "Urban"}
                            onChange={handleChange}
                          />
                          <CFormCheck
                            variant="inline"
                            type="radio"
                            name="sectionType"
                            id="sectionBoth"
                            label="Both"
                            value="Both"
                            checked={formData.sectionType === "Both"}
                            onChange={handleChange}
                          />
                        </div>
                      </CInputGroup>
                      {errors.sectionType && (
                        <p className="text-danger">{errors.sectionType}</p>
                      )}

                      <CInputGroup className="mb-3">
                        <CInputGroupText>Marital Status</CInputGroupText>
                        <div className="d-flex m-2 align-items-center">
                          <CFormCheck
                            variant="inline"
                            type="radio"
                            name="maritalStatus"
                            id="maritalSingle"
                            label="Single"
                            value="Single"
                            checked={formData.maritalStatus === "Single"}
                            onChange={handleChange}
                          />
                          <CFormCheck
                            variant="inline"
                            type="radio"
                            name="maritalStatus"
                            id="maritalMarried"
                            label="Married"
                            value="Married"
                            checked={formData.maritalStatus === "Married"}
                            onChange={handleChange}
                          />
                          <CFormCheck
                            variant="inline"
                            type="radio"
                            name="maritalStatus"
                            id="maritalDivorced"
                            label="Divorced"
                            value="Divorced"
                            checked={formData.maritalStatus === "Divorced"}
                            onChange={handleChange}
                          />
                        </div>
                      </CInputGroup>
                      {errors.maritalStatus && (
                        <p className="text-danger">{errors.maritalStatus}</p>
                      )}

                      {/* <CInputGroup className="mb-3">
                        <CInputGroupText>
                          <CIcon icon={cilImage} />
                        </CInputGroupText>
                        <CFormInput
                          name="photograph"
                          type="file"
                          onChange={handleFileChange}
                        />
                      </CInputGroup> */}

                      <CInputGroup className="mb-3">
                        <CInputGroupText>
                          <CIcon icon={cilImage} />
                        </CInputGroupText>
                        <CFormInput
                          ref={fileInputRefs.photograph}
                          id="photograph"
                          name="photograph"
                          type="file"
                          onChange={handleFileChange}
                          style={{ display: "none" }} // Hide the default file input
                        />
                        <CButton
                          color="secondary"
                          onClick={() => handleButtonClick("photograph")}
                        >
                          {fileNames.photograph || "Photograph"}{" "}
                          {/* Display file name or default text */}
                        </CButton>
                      </CInputGroup>
                      {errors.photograph && (
                        <p className="text-danger">{errors.photograph}</p>
                      )}

                      <CInputGroup className="mb-3">
                        <CInputGroupText>
                          <CIcon icon={cilImage} />
                        </CInputGroupText>
                        <CFormInput
                          ref={fileInputRefs.signature}
                          id="signature" // Add an id to the input element
                          name="signature"
                          type="file"
                          onChange={handleFileChange}
                          style={{ display: "none" }} // Hide the default file input
                        />
                        <CButton
                          color="secondary"
                          onClick={() => handleButtonClick("signature")}
                        >
                          {fileNames.signature || "Signature"}{" "}
                          {/* Display file name or default text */}
                        </CButton>
                      </CInputGroup>
                      {errors.signature && (
                        <p className="text-danger">{errors.signature}</p>
                      )}
                    </CCol>

                    <CInputGroup className="mb-3">
                      <CInputGroupText>Education</CInputGroupText>
                      <div className="d-flex m-2 align-items-center">
                        <CFormCheck
                          type="checkbox"
                          name="education"
                          id="graduate"
                          label="Graduate"
                          value="Graduate"
                          checked={formData.education.includes("Graduate")}
                          onChange={handleCheckboxChange}
                        />
                        <CFormCheck
                          type="checkbox"
                          name="education"
                          id="above12th"
                          label="Above 12th Pass"
                          value="Above 12th Pass"
                          checked={formData.education.includes(
                            "Above 12th Pass"
                          )}
                          onChange={handleCheckboxChange}
                        />
                        <CFormCheck
                          type="checkbox"
                          name="education"
                          id="other"
                          label="Other"
                          value="Other"
                          checked={formData.education.includes("Other")}
                          onChange={handleCheckboxChange}
                        />
                      </div>
                    </CInputGroup>
                    {errors.education && (
                      <p className="text-danger">{errors.education}</p>
                    )}

                    <CCol md={12} className="mb-3">
                      <CInputGroup className="mb-3">
                        <CInputGroupText>Address</CInputGroupText>
                        <CFormInput
                          name="address"
                          placeholder="Full Address"
                          value={formData.address}
                          onChange={handleChange}
                          autoComplete="street-address"
                        />
                      </CInputGroup>
                      {errors.address && (
                        <p className="text-danger">{errors.address}</p>
                      )}

                      <CRow className="d-flex">
                        <CCol md={6}>
                          <CInputGroup className="mb-3">
                            <CInputGroupText>District</CInputGroupText>
                            <CFormInput
                              name="district"
                              placeholder="District"
                              value={formData.district}
                              onChange={handleChange}
                              autoComplete="street-address"
                            />
                          </CInputGroup>
                          {errors.district && (
                            <p className="text-danger">{errors.district}</p>
                          )}
                        </CCol>

                        <CCol md={6}>
                          <CInputGroup className="mb-3">
                            <CInputGroupText>Pin Code</CInputGroupText>
                            <CFormInput
                              name="pincode"
                              placeholder="Pin Code"
                              value={formData.pincode}
                              onChange={handleChange}
                              autoComplete="street-address"
                            />
                          </CInputGroup>
                          {errors.pincode && (
                            <p className="text-danger">{errors.pincode}</p>
                          )}
                        </CCol>
                      </CRow>

                      <CInputGroup className="mb-3">
                        <CInputGroupText>Bank Name</CInputGroupText>
                        <CFormInput
                          name="bank"
                          placeholder="Bank Name"
                          value={formData.bank}
                          onChange={handleChange}
                          autoComplete="off"
                        />
                      </CInputGroup>
                      {errors.bank && (
                        <p className="text-danger">{errors.bank}</p>
                      )}

                      <CInputGroup className="mb-3">
                        <CInputGroupText>Bank Account Number</CInputGroupText>
                        <CFormInput
                          name="accountno"
                          placeholder="Bank Account Number"
                          value={formData.accountno}
                          onChange={handleChange}
                          autoComplete="off"
                        />
                      </CInputGroup>
                      {errors.accountno && (
                        <p className="text-danger">{errors.accountno}</p>
                      )}

                      <CInputGroup className="mb-3">
                        <CInputGroupText>IFSC Code</CInputGroupText>
                        <CFormInput
                          name="ifsc"
                          placeholder="IFSC Code"
                          value={formData.ifsc}
                          onChange={handleChange}
                          autoComplete="off"
                        />
                      </CInputGroup>
                      {errors.ifsc && (
                        <p className="text-danger">{errors.ifsc}</p>
                      )}

                      <CInputGroup className="mb-3">
                        <CInputGroupText>Division</CInputGroupText>
                        <CFormInput
                          name="division"
                          placeholder="Division"
                          value={formData.division}
                          onChange={handleChange}
                          autoComplete="off"
                        />
                      </CInputGroup>
                      {errors.division && (
                        <p className="text-danger">{errors.division}</p>
                      )}

                      <CInputGroup className="mb-3">
                        <CInputGroupText>Sub Division</CInputGroupText>
                        <CFormInput
                          name="subDivision"
                          placeholder="Sub Division"
                          value={formData.subDivision}
                          onChange={handleChange}
                          autoComplete="off"
                        />
                      </CInputGroup>
                      {errors.subDivision && (
                        <p className="text-danger">{errors.subDivision}</p>
                      )}

                      <CInputGroup className="mb-3">
                        <CInputGroupText>Section</CInputGroupText>
                        <CFormInput
                          name="section"
                          placeholder="Section"
                          value={formData.section}
                          onChange={handleChange}
                          autoComplete="off"
                        />
                      </CInputGroup>
                      {errors.section && (
                        <p className="text-danger">{errors.section}</p>
                      )}
                    </CCol>

                    <CCol md={6}>
                      {/* <CInputGroup className="mb-3">
                        <CInputGroupText>
                          <CIcon icon={cilImage} />
                        </CInputGroupText>
                        <CFormInput
                          name="aadharCard"
                          type="file"
                          onChange={handleFileChange}
                        />
                      </CInputGroup> */}

                      <CInputGroup className="mb-3">
                        <CInputGroupText>
                          <CIcon icon={cilImage} />
                        </CInputGroupText>
                        <CFormInput
                          ref={fileInputRefs.aadharCard}
                          id="aadharCard" // Add an id to the input element
                          name="aadharCard"
                          type="file"
                          onChange={handleFileChange}
                          style={{ display: "none" }} // Hide the default file input
                        />
                        <CButton
                          color="secondary"
                          onClick={() => handleButtonClick("aadharCard")}
                        >
                          {fileNames.aadharCard || "AadharCard"}{" "}
                          {/* Display file name or default text */}
                        </CButton>
                      </CInputGroup>
                      {errors.aadharCard && (
                        <p className="text-danger">{errors.aadharCard}</p>
                      )}

                      {/* <CInputGroup className="mb-3">
                        <CInputGroupText>
                          <CIcon icon={cilImage} />
                        </CInputGroupText>
                        <CFormInput
                          name="panCard"
                          type="file"
                          onChange={handleFileChange}
                        />
                      </CInputGroup> */}

                      <CInputGroup className="mb-3">
                        <CInputGroupText>
                          <CIcon icon={cilImage} />
                        </CInputGroupText>
                        <CFormInput
                          ref={fileInputRefs.panCard}
                          id="panCard" // Add an id to the input element
                          name="panCard"
                          type="file"
                          onChange={handleFileChange}
                          style={{ display: "none" }} // Hide the default file input
                        />
                        <CButton
                          color="secondary"
                          onClick={() => handleButtonClick("panCard")}
                        >
                          {fileNames.panCard || "Pancard"}{" "}
                          {/* Display file name or default text */}
                        </CButton>
                      </CInputGroup>
                      {errors.panCard && (
                        <p className="text-danger">{errors.panCard}</p>
                      )}
                    </CCol>

                    <CCol md={6}>
                      {/* <CInputGroup className="mb-3">
                        <CInputGroupText>
                          <CIcon icon={cilImage} />
                        </CInputGroupText>
                        <CFormInput
                          name="educationCertificate"
                          type="file"
                          onChange={handleFileChange}
                        />
                      </CInputGroup> */}

                      <CInputGroup className="mb-3">
                        <CInputGroupText>
                          <CIcon icon={cilImage} />
                        </CInputGroupText>
                        <CFormInput
                          ref={fileInputRefs.educationCertificate}
                          id="educationCertificate" // Add an id to the input element
                          name="educationCertificate"
                          type="file"
                          onChange={handleFileChange}
                          style={{ display: "none" }} // Hide the default file input
                        />
                        <CButton
                          color="secondary"
                          onClick={() =>
                            handleButtonClick("educationCertificate")
                          }
                        >
                          {fileNames.educationCertificate ||
                            "EducationCertificate"}{" "}
                          {/* Display file name or default text */}
                        </CButton>
                      </CInputGroup>
                      {errors.educationCertificate && (
                        <p className="text-danger">
                          {errors.educationCertificate}
                        </p>
                      )}

                      {/* <CInputGroup className="mb-3">
                        <CInputGroupText>
                          <CIcon icon={cilImage} />
                        </CInputGroupText>
                        <CFormInput
                          name="cheque"
                          type="file"
                          onChange={handleFileChange}
                        />
                      </CInputGroup> */}

                      <CInputGroup className="mb-3">
                        <CInputGroupText>
                          <CIcon icon={cilImage} />
                        </CInputGroupText>
                        <CFormInput
                          ref={fileInputRefs.cheque}
                          id="cheque" // Add an id to the input element
                          name="cheque"
                          type="file"
                          onChange={handleFileChange}
                          style={{ display: "none" }} // Hide the default file input
                        />
                        <CButton
                          color="secondary"
                          onClick={() => handleButtonClick("cheque")}
                        >
                          {fileNames.cheque || "Cheque"}{" "}
                          {/* Display file name or default text */}
                        </CButton>
                      </CInputGroup>
                      {errors.cheque && (
                        <p className="text-danger">{errors.cheque}</p>
                      )}
                    </CCol>
                  </CRow>

                  <div className="d-grid">
                    <CButton color="warning" type="submit" size="lg">
                      Submit
                    </CButton>
                  </div>
                </CForm>
              </CCardBody>
              <CCardFooter className="text-center">
                <p className="text-muted">
                  Allready have Account?{" "}
                  <Link to={`/login`}>
                    <CButton color="link" className="px-0">
                      Login
                    </CButton>
                  </Link>
                </p>
              </CCardFooter>
            </CCard>
          </CCol>
        </CRow>
      </CContainer>

      {/* Modal */}
      <CModal visible={modalVisible} onClose={handleModalClose}>
        <CModalHeader onClose={handleModalClose}>
          <CModalTitle>Registration Successful</CModalTitle>
        </CModalHeader>
        <CModalBody>
          Thank you for registering! We will contact you shortly.
        </CModalBody>
        <CModalFooter>
          <CButton color="primary" onClick={handleModalClose}>
            OK
          </CButton>
        </CModalFooter>
      </CModal>
    </div>
  );
};

export default Register;
