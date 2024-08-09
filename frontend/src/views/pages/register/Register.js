import React, { useState } from "react";
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
  cilLockLocked,
} from "@coreui/icons";

const Register = () => {
  // State for form fields
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

  // Handle change for text inputs
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle change for file inputs
  const handleFileChange = (e) => {
    const { name, files } = e.target;
    setFormData({ ...formData, [name]: files[0] });
  };

  // Handle change for checkboxes
  const handleCheckboxChange = (e) => {
    const { name, value, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: checked
        ? [...prev[name], value]
        : prev[name].filter((item) => item !== value),
    }));
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form data:', formData);
  };

  return (
    <div className="bg-body-tertiary min-vh-100 d-flex flex-row align-items-center">
      <CContainer>
        <CRow className="justify-content-center">
          <CCol md={9} lg={7} xl={8}>
            <CCard className="mx-4">
              <CCardBody className="p-4">
                <CForm onSubmit={handleSubmit}>
                  <h1>Register</h1>
                  <p className="text-body-secondary">Create your account</p>

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
                      {/* <CIcon icon={cilIdCard} /> */}
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
                      {/* <CIcon icon={cilIdCard} /> */}
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
                    <div className="d-flex align-items-center">
                      <CFormCheck
                        variant="inline"
                        type="radio"
                        name="salaryBasis"
                        id="basisSalary"
                        label="Salary"
                        value="Salary"
                        checked={formData.salaryBasis === "Salary"}
                        onChange={handleChange}
                      />
                      <CFormCheck
                        variant="inline"
                        type="radio"
                        name="salaryBasis"
                        id="basisCommission"
                        label="Commission"
                        value="Commission"
                        checked={formData.salaryBasis === "Commission"}
                        onChange={handleChange}
                      />
                    </div>
                  </CInputGroup>

                  {/* Email Field */}
                  <CInputGroup className="mb-3">
                    <CInputGroupText>
                      <CIcon icon={cilEnvelopeClosed} />
                    </CInputGroupText>
                    <CFormInput
                      name="email"
                      placeholder="Email"
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
                      autoComplete="off"
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
                      autoComplete="off"
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
                      autoComplete="off"
                    />
                  </CInputGroup>

                  {/* Section Type Field */}
                  <CInputGroup className="mb-3">
                    <CInputGroupText>Section Type</CInputGroupText>
                    <div className="d-flex align-items-center">
                      <CFormCheck
                        variant="inline"
                        type="radio"
                        name="sectionType"
                        id="typeUrban"
                        label="Urban"
                        value="Urban"
                        checked={formData.sectionType === "Urban"}
                        onChange={handleChange}
                      />
                      <CFormCheck
                        variant="inline"
                        type="radio"
                        name="sectionType"
                        id="typeRural"
                        label="Rural"
                        value="Rural"
                        checked={formData.sectionType === "Rural"}
                        onChange={handleChange}
                      />
                      <CFormCheck
                        variant="inline"
                        type="radio"
                        name="sectionType"
                        id="typeBoth"
                        label="Both"
                        value="Both"
                        checked={formData.sectionType === "Both"}
                        onChange={handleChange}
                      />
                    </div>
                  </CInputGroup>

                  {/* Photograph Field */}
                  <CInputGroup className="mb-3">
                    <CInputGroupText>
                      <CIcon icon={cilImage} />
                    </CInputGroupText>
                    <label className="custom-file-upload">
                      <input
                        type="file"
                        name="photograph"
                        onChange={handleFileChange}
                      />
                      Upload Photograph
                    </label>
                  </CInputGroup>

                  {/* Aadhar Card Field */}
                  <CInputGroup className="mb-3">
                    <CInputGroupText>
                      <CIcon icon={cilImage} />
                    </CInputGroupText>
                    <label className="custom-file-upload">
                      <input
                        type="file"
                        name="aadharCard"
                        onChange={handleFileChange}
                      />
                      Upload Aadhar Card
                    </label>
                  </CInputGroup>

                  {/* Pan Card Field */}
                  <CInputGroup className="mb-3">
                    <CInputGroupText>
                      <CIcon icon={cilImage} />
                    </CInputGroupText>
                    <label className="custom-file-upload">
                      <input
                        type="file"
                        name="panCard"
                        onChange={handleFileChange}
                      />
                      Upload Pan Card
                    </label>
                  </CInputGroup>

                  {/* Education Certificate Field */}
                  <CInputGroup className="mb-3">
                    <CInputGroupText>
                      <CIcon icon={cilImage} />
                    </CInputGroupText>
                    <label className="custom-file-upload">
                      <input
                        type="file"
                        name="educationCertificate"
                        onChange={handleFileChange}
                      />
                      Upload Education Certificate
                    </label>
                  </CInputGroup>

                  {/* Cheque Field */}
                  <CInputGroup className="mb-3">
                    <CInputGroupText>
                      <CIcon icon={cilImage} />
                    </CInputGroupText>
                    <label className="custom-file-upload">
                      <input
                        type="file"
                        name="cheque"
                        onChange={handleFileChange}
                      />
                      Upload Cheque
                    </label>
                  </CInputGroup>


                  {/* Submit Button */}
                  <div className="d-grid">
                    <CButton color="success" type="submit">
                      Create Account
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
