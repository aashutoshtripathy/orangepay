import React, { useState } from "react";
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
} from "@coreui/react";
import CIcon from "@coreui/icons-react";
import {
  cilUser,
  cilCalendar,
  cilPhone,
  cilEnvelopeClosed,
  cilImage,
} from "@coreui/icons";
import { Link } from "react-router-dom";

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

    const formDataToSend = new FormData();

    for (const key in formData) {
        if (formData.hasOwnProperty(key) && formData[key] !== null) {
            if (Array.isArray(formData[key])) {
                formData[key].forEach((value) =>
                    formDataToSend.append(key, value)
                );
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
    } catch (error) {
        console.error("Error in posting the data:", error);
    }
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
                            checked={formData.salaryBasis === "commission based"}
                            onChange={handleChange}
                          />
                        </div>
                      </CInputGroup>


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
                            name="maritalMarried"
                            id="genderFemale"
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


                      <CInputGroup className="mb-3">
                        <CInputGroupText>
                          <CIcon icon={cilImage} />
                        </CInputGroupText>
                        <CFormInput
                          name="photograph"
                          type="file"
                          onChange={handleFileChange}
                        />
                      </CInputGroup>
                    </CCol>

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

                      <CInputGroup className="mb-3">
                        <CInputGroupText>Section Type</CInputGroupText>
                        <CFormInput
                          name="sectionType"
                          placeholder="Section Type"
                          value={formData.sectionType}
                          onChange={handleChange}
                          autoComplete="off"
                        />
                      </CInputGroup>
                    </CCol>

                    <CCol md={6}>

                   
                      

                      <CInputGroup className="mb-3">
                        <CInputGroupText>
                          <CIcon icon={cilImage} />
                        </CInputGroupText>
                        <CFormInput
                          name="aadharCard"
                          type="file"
                          onChange={handleFileChange}
                        />
                      </CInputGroup>

                      <CInputGroup className="mb-3">
                        <CInputGroupText>
                          <CIcon icon={cilImage} />
                        </CInputGroupText>
                        <CFormInput
                          name="panCard"
                          type="file"
                          onChange={handleFileChange}
                        />
                      </CInputGroup>
                    </CCol>

                    <CCol md={6}>
                      

                      <CInputGroup className="mb-3">
                        <CInputGroupText>
                          <CIcon icon={cilImage} />
                        </CInputGroupText>
                        <CFormInput
                          name="educationCertificate"
                          type="file"
                          onChange={handleFileChange}
                        />
                      </CInputGroup>

                      <CInputGroup className="mb-3">
                        <CInputGroupText>
                          <CIcon icon={cilImage} />
                        </CInputGroupText>
                        <CFormInput
                          name="cheque"
                          type="file"
                          onChange={handleFileChange}
                        />
                      </CInputGroup>
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
                <p className="text-muted">Allready have Account? <Link to={`/login`}><CButton color="link"  className="px-0">
                        Login
                        </CButton></Link></p>
              </CCardFooter>
            </CCard>
          </CCol>
        </CRow>
      </CContainer>
    </div>
  );
};

export default Register;
