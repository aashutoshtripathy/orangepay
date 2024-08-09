import React, { useState } from "react";
import { registerUser } from "../../../api/apiservice.js";
import {
  CButton,
  CCard,
  CCardBody,
  CCol,
  CContainer,
  CForm,
  CFormInput,
  CInputGroup,
  CInputGroupText,
  CRow,
  CFormCheck,
} from "@coreui/react";
import CIcon from "@coreui/icons-react";
import {
  cilUser,
  cilCalendar,
  cilPhone,
  cilEnvelopeClosed,
  cilImage,
} from "@coreui/icons";

const Register = () => {
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
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    setFormData({ ...formData, [name]: files[0] });
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    // console.log('Form data:', formData);
    try {
      const response = await registerUser(formData);
      console.log('User registered successfully:', response);

      setFormData({
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
      });

    } catch (error) {
      console.error('Error registering user:', error);
    }

   
  };

  return (
    <div className="bg-body-tertiary min-vh-100 d-flex flex-row align-items-center">
      <CContainer>
        <CRow className="justify-content-center">
          <CCol md={10} lg={8} xl={7}>
            <CCard className="mx-4">
              <CCardBody className="p-4">
                <CForm onSubmit={handleSubmit}>
                  <h1>Register</h1>
                  <p className="text-body-secondary">Request to create your account</p>

                  <CRow>
                    <CCol md={6}>
                      {/* Name Field */}
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

                      {/* Father's/Husband Name Field */}
                      <CInputGroup className="mb-3">
                        <CInputGroupText>
                          <CIcon icon={cilUser} />
                        </CInputGroupText>
                        <CFormInput
                          name="fatherOrHusbandName"
                          placeholder="Father's/Husband Name"
                          value={formData.fatherOrHusbandName}
                          onChange={handleChange}
                          autoComplete="family-name"
                        />
                      </CInputGroup>

                      {/* Date of Birth Field */}
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

                      {/* Aadhar Number Field */}
                      <CInputGroup className="mb-3">
                        <CInputGroupText>
                          Aadhar
                        </CInputGroupText>
                        <CFormInput
                          name="aadharNumber"
                          placeholder="Aadhar Number"
                          type="number"
                          value={formData.aadharNumber}
                          onChange={handleChange}
                          autoComplete="off"
                        />
                      </CInputGroup>

                      {/* Pan Number Field */}
                      <CInputGroup className="mb-3">
                        <CInputGroupText>
                          PAN
                        </CInputGroupText>
                        <CFormInput
                          name="panNumber"
                          placeholder="Pan Number"
                          value={formData.panNumber}
                          onChange={handleChange}
                          style={{ textTransform: "uppercase" }}
                          autoComplete="off"
                        />
                      </CInputGroup>

                      {/* Mobile Number Field */}
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

                      {/* Gender Field */}
                      <CInputGroup className="mb-3">
                        <CInputGroupText>Gender</CInputGroupText>
                        <div className="d-flex align-items-center">
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

                      {/* Marital Status Field */}
                      <CInputGroup className="mb-3">
                        <CInputGroupText>Marital Status</CInputGroupText>
                        <div className="d-flex align-items-center">
                          <CFormCheck
                            variant="inline"
                            type="radio"
                            name="maritalStatus"
                            id="statusSingle"
                            label="Single"
                            value="Single"
                            checked={formData.maritalStatus === "Single"}
                            onChange={handleChange}
                          />
                          <CFormCheck
                            variant="inline"
                            type="radio"
                            name="maritalStatus"
                            id="statusMarried"
                            label="Married"
                            value="Married"
                            checked={formData.maritalStatus === "Married"}
                            onChange={handleChange}
                          />
                          <CFormCheck
                            variant="inline"
                            type="radio"
                            name="maritalStatus"
                            id="statusOther"
                            label="Other"
                            value="Other"
                            checked={formData.maritalStatus === "Other"}
                            onChange={handleChange}
                          />
                        </div>
                      </CInputGroup>

                      {/* Education Field */}
                      <CInputGroup className="mb-3">
                        <CInputGroupText>Education</CInputGroupText>
                        <div className="d-flex flex-wrap">
                          <CFormCheck
                            variant="inline"
                            type="checkbox"
                            name="education"
                            id="educationHighSchool"
                            label="Graduate & Above"
                            value="Graduate & Above"
                            checked={formData.education.includes("Graduate & Above")}
                            onChange={handleCheckboxChange}
                          />
                          <CFormCheck
                            variant="inline"
                            type="checkbox"
                            name="education"
                            id="educationBachelors"
                            label="Class 12th"
                            value="Class 12th"
                            checked={formData.education.includes("Class 12th")}
                            onChange={handleCheckboxChange}
                          />
                          <CFormCheck
                            variant="inline"
                            type="checkbox"
                            name="education"
                            id="educationMasters"
                            label="Other"
                            value="Other"
                            checked={formData.education.includes("Other")}
                            onChange={handleCheckboxChange}
                          />
                        </div>
                      </CInputGroup>
                    </CCol>

                    <CCol md={6}>
                      {/* Address Field */}
                      <CInputGroup className="mb-3">
                        <CInputGroupText>Address</CInputGroupText>
                        <CFormInput
                          name="address"
                          placeholder="Address"
                          value={formData.address}
                          onChange={handleChange}
                          autoComplete="address"
                        />
                      </CInputGroup>

                      {/* Salary Basis Field */}
                      <CInputGroup className="mb-3">
                        <CInputGroupText>Salary Basis</CInputGroupText>
                        <CFormInput
                          name="salaryBasis"
                          placeholder="Salary Basis"
                          value={formData.salaryBasis}
                          onChange={handleChange}
                          autoComplete="off"
                        />
                      </CInputGroup>

                      {/* Email Field */}
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

                      {/* Division Field */}
                      <CInputGroup className="mb-3">
                        <CInputGroupText>Division</CInputGroupText>
                        <CFormInput
                          name="division"
                          placeholder="Division"
                          value={formData.division}
                          onChange={handleChange}
                          autoComplete="division"
                        />
                      </CInputGroup>

                      {/* Sub-Division Field */}
                      <CInputGroup className="mb-3">
                        <CInputGroupText>Sub-Division</CInputGroupText>
                        <CFormInput
                          name="subDivision"
                          placeholder="Sub-Division"
                          value={formData.subDivision}
                          onChange={handleChange}
                          autoComplete="subdivision"
                        />
                      </CInputGroup>

                      {/* Section Field */}
                      <CInputGroup className="mb-3">
                        <CInputGroupText>Section</CInputGroupText>
                        <CFormInput
                          name="section"
                          placeholder="Section"
                          value={formData.section}
                          onChange={handleChange}
                          autoComplete="section"
                        />
                      </CInputGroup>

                      {/* Section Type Field */}
                      <CInputGroup className="mb-3">
                        <CInputGroupText>Section Type</CInputGroupText>
                        <CFormInput
                          name="sectionType"
                          placeholder="Section Type"
                          value={formData.sectionType}
                          onChange={handleChange}
                          autoComplete="sectionType"
                        />
                      </CInputGroup>

                      {/* File Upload Fields */}
                      <CInputGroup className="mb-3">
                        <CInputGroupText>
                          <CIcon icon={cilImage} />
                        </CInputGroupText>
                        <CFormInput
                          name="photograph"
                          type="file"
                          onChange={handleFileChange}
                          autoComplete="off"
                        />
                      </CInputGroup>

                      <CInputGroup className="mb-3">
                        <CInputGroupText>Aadhar Card</CInputGroupText>
                        <CFormInput
                          name="aadharCard"
                          type="file"
                          onChange={handleFileChange}
                          autoComplete="off"
                        />
                      </CInputGroup>

                      <CInputGroup className="mb-3">
                        <CInputGroupText>PAN Card</CInputGroupText>
                        <CFormInput
                          name="panCard"
                          type="file"
                          onChange={handleFileChange}
                          autoComplete="off"
                        />
                      </CInputGroup>

                      <CInputGroup className="mb-3">
                        <CInputGroupText>Education Certificate</CInputGroupText>
                        <CFormInput
                          name="educationCertificate"
                          type="file"
                          onChange={handleFileChange}
                          autoComplete="off"
                        />
                      </CInputGroup>

                      <CInputGroup className="mb-3">
                        <CInputGroupText>Cheque</CInputGroupText>
                        <CFormInput
                          name="cheque"
                          type="file"
                          onChange={handleFileChange}
                          autoComplete="off"
                        />
                      </CInputGroup>
                    </CCol>
                  </CRow>

                  <div className="d-flex justify-content-center mt-4">
                    <CButton type="submit" color="success">
                      Request
                    </CButton>
                  </div>
                </CForm>
              </CCardBody>
            </CCard>
          </CCol>
        </CRow>
      </CContainer>
    </div>
  );
};

export default Register;
