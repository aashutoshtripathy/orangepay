import React, { useRef, useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { CFormCheck } from "@coreui/react";
import { cilUser } from "@coreui/react";

import axios from "axios";
import {
    CButton,
    CCard,
    CCardBody,
    CCardHeader,
    CInputGroup,
    CInputGroupText,
    CForm,
    CFormInput,
    CRow,
    CCol,
    CModal,
    CModalBody,
    CModalFooter,
    CModalHeader,
    CModalTitle,
    CContainer,
} from "@coreui/react";
import {
    cilCalendar,
    cilEnvelopeClosed,
    cilImage,
} from "@coreui/icons";
import CIcon from "@coreui/icons-react";
import { cilPhone } from "@coreui/icons";

const UpdateProfile = () => {
    const { userId } = useParams();

    const [modalVisible, setModalVisible] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [formData, setFormData] = useState({});
    const [errors, setErrors] = useState({});

    const navigate = useNavigate();

    useEffect(() => {
        const fetchUserData = async () => {
            if (!userId) {
                setError('Invalid User ID');
                setLoading(false);
                return;
            }

            try {
                const response = await axios.get(`/fetchUserById/${userId}`);
                setFormData(response.data.user);
            } catch (err) {
                console.error('Error fetching user data:', err.message);
                setError('Failed to load user data. Please try again later.');
            } finally {
                setLoading(false);
            }
        };

        fetchUserData();
    }, [userId]);

    const validateForm = () => {
        let formErrors = {};

        // Validate form fields
        if (!formData.mobileNumber) formErrors.mobileNumber = "Mobile Number is required";
        if (!formData.address) formErrors.address = "Address is required";
        if (!formData.pincode) formErrors.pincode = "Pin Code is required";
        if (!formData.bank) formErrors.bank = "Bank Name is required";
        if (!formData.accountno) formErrors.accountno = "Account Number is required";
        if (!formData.ifsc) formErrors.ifsc = "IFSC code is required";
        if (!formData.email) formErrors.email = "Email is required";
        if (!formData.district) formErrors.district = "District is required";
      
        setErrors(formErrors);
        return Object.keys(formErrors).length === 0;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        
        // Clear error for the field when typing
        if (value) {
            setErrors((prevErrors) => {
                const updatedErrors = { ...prevErrors };
                delete updatedErrors[name]; // Remove the error for the field
                return updatedErrors;
            });
        }
        
        setFormData({ ...formData, [name]: value });
    };


    const handleBlur = (e) => {
        const { name, value } = e.target;
    
        // Validate the specific field
        let error = "";
    
        if (name === "mobileNumber" && !value) {
            error = "Mobile Number is required";
        } else if (name === "address" && !value) {
            error = "Address is required";
        } else if (name === "district" && !value) {
            error = "District is required";
        } else if (name === "pincode" && !value) {
            error = "Pin Code is required";
        } else if (name === "bank" && !value) {
            error = "Bank Name is required";
        } else if (name === "accountno" && !value) {
            error = "Account number is required";
        } else if (name === "ifsc" && !value) {
            error = "IFSC Code is required";
        } else if (name === "email" && !value) {
            error = "Email is required";
        } 
    
        // Update errors state for this field only
        setErrors((prevErrors) => ({
            ...prevErrors,
            [name]: error,
        }));
    };
    

    


    const handleCheckboxChange = (e) => {
        const { name, value, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: checked
                ? [...prev[name], value]
                : prev[name].filter(item => item !== value),
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        const formDataToSend = new FormData();
        for (const key in formData) {
            if (formData.hasOwnProperty(key) && formData[key] !== null) {
                if (Array.isArray(formData[key])) {
                    formData[key].forEach(value =>
                        formDataToSend.append(key, value)
                    );
                } else {
                    formDataToSend.append(key, formData[key]);
                }
            }
        }

        try {
                const response = await axios.put(`/updateProfile/${userId}`, formDataToSend, {

                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });
            console.log(response.data);
            setModalVisible(true);
        } catch (error) {
            console.error("Error in posting the data:", error);
            setError("Failed to update profile.");
        }
    };

    const handleModalClose = () => {
        setModalVisible(false);
        navigate(`/profile/${userId}`); // Redirect to profile page after closing modal
    };

  

    if (loading) return <p>Loading...</p>;
    if (error) return <p className="text-danger">{error}</p>;

    return (
        <div className="bg-light min-vh-10 d-flex flex-row align-items-center">
            <CContainer>
                <CRow className="justify-content-center">
                    <CCol md={10} lg={8} xl={7}>
                        <CCard className="shadow-lg">
                            <CCardHeader className="text-center">
                                <h2>Update User</h2>
                                {/* <p className="text-muted">Fill in the details below</p> */}
                            </CCardHeader>
                            <CCardBody className="p-4">
                                <CForm onSubmit={handleSubmit}>
                                    <CRow>
                                        <CCol md={12} className="mb-3">







                                        </CCol>

                                        <CCol md={6}>

                                            







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
                                                    onBlur={handleBlur}
                                                />
                                            </CInputGroup>
                                            {errors.mobileNumber && <p className="text-danger">{errors.mobileNumber}</p>}


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
                                                    onBlur={handleBlur}

                                                    autoComplete="email"
                                                />
                                            </CInputGroup>
                                            {errors.email && <p className="text-danger">{errors.email}</p>}

                                        </CCol>

                                        <CCol md={6}>




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
                                            {errors.maritalStatus && <p className="text-danger">{errors.maritalStatus}</p>}

















                                        </CCol>





                                        <CCol md={12} className="mb-3">
                                            <CInputGroup className="mb-3">
                                                <CInputGroupText>Address</CInputGroupText>
                                                <CFormInput
                                                    name="address"
                                                    placeholder="Full Address"
                                                    value={formData.address}
                                                    onChange={handleChange}
                                                    onBlur={handleBlur}

                                                    autoComplete="street-address"
                                                />
                                            </CInputGroup>
                                            {errors.address && <p className="text-danger">{errors.address}</p>}


                                            <CRow className="d-flex">
                                                <CCol md={6}>


                                                    <CInputGroup className="mb-3">
                                                        <CInputGroupText>District</CInputGroupText>
                                                        <CFormInput
                                                            name="district"
                                                            placeholder="District"
                                                            value={formData.district}
                                                            onChange={handleChange}
                                                    onBlur={handleBlur}

                                                            autoComplete="street-address"
                                                        />
                                                    </CInputGroup>
                                                    {errors.district && <p className="text-danger">{errors.district}</p>}


                                                </CCol>

                                                <CCol md={6}>


                                                    <CInputGroup className="mb-3">
                                                        <CInputGroupText>Pin Code</CInputGroupText>
                                                        <CFormInput
                                                            name="pincode"
                                                            placeholder="Pin Code"
                                                            value={formData.pincode}
                                                            onChange={handleChange}
                                                    onBlur={handleBlur}

                                                            autoComplete="street-address"
                                                        />
                                                    </CInputGroup>
                                                    {errors.pincode && <p className="text-danger">{errors.pincode}</p>}


                                                </CCol>
                                            </CRow>


                                            <CInputGroup className="mb-3">
                                                <CInputGroupText>Bank Name</CInputGroupText>
                                                <CFormInput
                                                    name="bank"
                                                    placeholder="Bank Name"
                                                    value={formData.bank}
                                                    onChange={handleChange}
                                                    onBlur={handleBlur}

                                                    autoComplete="off"
                                                />

                                            </CInputGroup>
                                            {errors.bank && <p className="text-danger">{errors.bank}</p>}


                                            <CInputGroup className="mb-3">
                                                <CInputGroupText>Bank Account Number</CInputGroupText>
                                                <CFormInput
                                                    name="accountno"
                                                    placeholder="Bank Account Number"
                                                    value={formData.accountno}
                                                    onChange={handleChange}
                                                    onBlur={handleBlur}

                                                    autoComplete="off"
                                                />

                                            </CInputGroup>
                                            {errors.accountno && <p className="text-danger">{errors.accountno}</p>}


                                            <CInputGroup className="mb-3">
                                                <CInputGroupText>IFSC Code</CInputGroupText>
                                                <CFormInput
                                                    name="ifsc"
                                                    placeholder="IFSC Code"
                                                    value={formData.ifsc}
                                                    onChange={handleChange}
                                                    onBlur={handleBlur}
                                                    autoComplete="off"
                                                />

                                            </CInputGroup>
                                            {errors.ifsc && <p className="text-danger">{errors.ifsc}</p>}













                                        </CCol>

                                        <CCol md={6}>












                                        </CCol>


                                    </CRow>

                                    <div className="d-grid">
                                        <CButton color="warning" type="submit" size="lg">
                                            Submit
                                        </CButton>
                                    </div>
                                </CForm>
                            </CCardBody>
                        </CCard>
                    </CCol>
                </CRow>
            </CContainer>


            {/* Modal */}
            <CModal visible={modalVisible} onClose={handleModalClose}>
                <CModalHeader onClose={handleModalClose}>
                    <CModalTitle>Successfully Updated</CModalTitle>
                </CModalHeader>
                <CModalFooter>
                    <CButton color="primary" onClick={handleModalClose}>
                        OK
                    </CButton>
                </CModalFooter>
            </CModal>
        </div>
    );
};

export default UpdateProfile;
