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
  CFormSelect,
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
  const [selectedDiscom, setSelectedDiscom] = useState('');
  const [districts, setDistricts] = useState([]);
  const [districtOptions, setDistrictOptions] = useState([]);
  const [subDivisionOptions, setSubDivisionOptions] = useState([]);
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




  const northBiharDistricts = [
    "Araria",
    "Aurangabad",
    "Banka",
    "Begusarai",
    "Bhagalpur",
    "Bhojpur",
    "Buxar",
    "Darbhanga",
    "East Champaran (Purbi Champaran)",
    "Gopalganj",
    "Katihar",
    "Kishanganj",
    "Khagaria",
    "Madhepura",
    "Madhubani",
    "Muzaffarpur",
    "Purnia",
    "Saran",
    "Sheikhpura",
    "Sheohar",
    "Sitamarhi",
    "Supaul",
    "Vaishali",
    "West Champaran (Pashchim Champaran)",
    "Siwan"
  ];
  
  const southBiharDistricts = [
    "Arwal",
    "Aurangabad",
    "Banka",
    "Begusarai",
    "Bhojpur",
    "Kaimur (Bhabua)",
    "Gaya",
    "Jamui",
    "Jehanabad",
    "Nalanda",
    "Nawada",
    "Patna",
    "Rohtas",
    "Sheikhpura",
    "Siwan",
    "Saran",
    "Vaishali"
  ];

  

  const discomDistricts = {
    NBSL: northBiharDistricts,
    SBPDCL: southBiharDistricts
  };



  const handleDiscomChange = (event) => {
    const discom = event.target.value;
    setSelectedDiscom(discom);
    setDistricts(discomDistricts[discom] || []);
  };




  const divisionsData = {
    "ASHIYANA Division": {
      ASHIYANA: ["ASHIYANA"],
      KHAJPURA: ["IGIMS", "KHAJPURA", "VIJAYNAGAR"],
    },
    "PATNACITY Division": {
      CHOWK: ["CHOWK", "East Muzaffarpur", "West Muzaffarpur"],
      KATRA: ["Sitamarhi Sadar", "Pupri"],
      MAHRUFGANJ: ["Sheohar Sadar"],
    },
    "BANKIPUR Division": {
      "Saran (Chhapra)": ["Chhapra Sadar", "Marhaura", "Garkha"],
      Siwan: ["Siwan Sadar", "Maharajganj"],
      Gopalganj: ["Gopalganj Sadar", "Hathua"],
    },
    "RAJENDRANAGAR Division": {
      Darbhanga: ["Darbhanga Sadar", "Benipur", "Biraul"],
      Madhubani: ["Madhubani Sadar", "Jhanjharpur", "Benipatti"],
      Samastipur: ["Samastipur Sadar", "Dalsinghsarai", "Rosera"],
    },
    "KANKARBAGH(1) Division": {
      Saharsa: ["Saharsa Sadar", "Simri Bakhtiyarpur", "Sonbarsa"],
      Madhepura: ["Madhepura Sadar", "Uda Kishanganj"],
      Supaul: ["Supaul Sadar", "Birpur", "Tribeniganj"],
    },
    "KANKARBAGH(2) Division": {
      Purnia: ["Purnia Sadar", "Banmankhi", "Dhamdaha"],
      Araria: ["Araria Sadar", "Forbesganj"],
      Kishanganj: ["Kishanganj Sadar", "Bahadurganj"],
      Katihar: ["Katihar Sadar", "Barsoi", "Manihari"],
    },
    "GULZARBAGH Division": {
      Bhagalpur: ["Bhagalpur Sadar", "Kahalgaon", "Naugachhia"],
      Banka: ["Banka Sadar", "Amarpur"],
    },
    "NEW CAPITAL Division": {
      Munger: ["Munger Sadar", "Jamalpur", "Kharagpur"],
      Lakhisarai: ["Lakhisarai Sadar", "Barahiya"],
      Sheikhpura: ["Sheikhpura Sadar"],
      Jamui: ["Jamui Sadar", "Jhajha", "Sono"],
      Khagaria: ["Khagaria Sadar", "Gogri"],
      Begusarai: ["Begusarai Sadar", "Bachhwara", "Bakhri"],
    },
    "PATLIPUTRA Division": {
      Gaya: ["Gaya Sadar", "Tekari", "Sherghati"],
      Nawada: ["Nawada Sadar", "Rajauli"],
      Aurangabad: ["Aurangabad Sadar", "Daudnagar"],
      Jehanabad: ["Jehanabad Sadar", "Makhdumpur"],
      Arwal: ["Arwal Sadar", "Karpi"],
    },
    "DAKBUNGLOW Division": {
      Nalanda: ["Bihar Sharif", "Rajgir", "Hilsa"],
      Patna: ["Patna Sadar", "Barh", "Masaurhi", "Paliganj", "Danapur"],
    },
    "GARDANIBAGH Division": {
      Saharsa: ["Saharsa Sadar", "Simri Bakhtiyarpur", "Sonbarsa"],
      Madhepura: ["Madhepura Sadar", "Uda Kishanganj"],
      Supaul: ["Supaul Sadar", "Birpur", "Tribeniganj"],
    },
    "DANAPUR Division": {
      Purnia: ["Purnia Sadar", "Banmankhi", "Dhamdaha"],
      Araria: ["Araria Sadar", "Forbesganj"],
      Kishanganj: ["Kishanganj Sadar", "Bahadurganj"],
      Katihar: ["Katihar Sadar", "Barsoi", "Manihari"],
    },
    "BIHTA Division": {
      Bhagalpur: ["Bhagalpur Sadar", "Kahalgaon", "Naugachhia"],
      Banka: ["Banka Sadar", "Amarpur"],
    },
    "BARH Division": {
      Munger: ["Munger Sadar", "Jamalpur", "Kharagpur"],
      Lakhisarai: ["Lakhisarai Sadar", "Barahiya"],
      Sheikhpura: ["Sheikhpura Sadar"],
      Jamui: ["Jamui Sadar", "Jhajha", "Sono"],
      Khagaria: ["Khagaria Sadar", "Gogri"],
      Begusarai: ["Begusarai Sadar", "Bachhwara", "Bakhri"],
    },
    "FATUHA Division": {
      Gaya: ["Gaya Sadar", "Tekari", "Sherghati"],
      Nawada: ["Nawada Sadar", "Rajauli"],
      Aurangabad: ["Aurangabad Sadar", "Daudnagar"],
      Jehanabad: ["Jehanabad Sadar", "Makhdumpur"],
      Arwal: ["Arwal Sadar", "Karpi"],
    },
    "MASAURHI Division": {
      Gaya: ["Gaya Sadar", "Tekari", "Sherghati"],
      Nawada: ["Nawada Sadar", "Rajauli"],
      Aurangabad: ["Aurangabad Sadar", "Daudnagar"],
      Jehanabad: ["Jehanabad Sadar", "Makhdumpur"],
      Arwal: ["Arwal Sadar", "Karpi"],
    },
    "PATNA Division": {
      Gaya: ["Gaya Sadar", "Tekari", "Sherghati"],
      Nawada: ["Nawada Sadar", "Rajauli"],
      Aurangabad: ["Aurangabad Sadar", "Daudnagar"],
      Jehanabad: ["Jehanabad Sadar", "Makhdumpur"],
      Arwal: ["Arwal Sadar", "Karpi"],
    },
    "ARRAH Division": {
      Gaya: ["Gaya Sadar", "Tekari", "Sherghati"],
      Nawada: ["Nawada Sadar", "Rajauli"],
      Aurangabad: ["Aurangabad Sadar", "Daudnagar"],
      Jehanabad: ["Jehanabad Sadar", "Makhdumpur"],
      Arwal: ["Arwal Sadar", "Karpi"],
    },
    "BUXAR Division": {
      Gaya: ["Gaya Sadar", "Tekari", "Sherghati"],
      Nawada: ["Nawada Sadar", "Rajauli"],
      Aurangabad: ["Aurangabad Sadar", "Daudnagar"],
      Jehanabad: ["Jehanabad Sadar", "Makhdumpur"],
      Arwal: ["Arwal Sadar", "Karpi"],
    },
    "BIHARSARIF Division": {
      Gaya: ["Gaya Sadar", "Tekari", "Sherghati"],
      Nawada: ["Nawada Sadar", "Rajauli"],
      Aurangabad: ["Aurangabad Sadar", "Daudnagar"],
      Jehanabad: ["Jehanabad Sadar", "Makhdumpur"],
      Arwal: ["Arwal Sadar", "Karpi"],
    },
    "RAJGIR Division": {
      Gaya: ["Gaya Sadar", "Tekari", "Sherghati"],
      Nawada: ["Nawada Sadar", "Rajauli"],
      Aurangabad: ["Aurangabad Sadar", "Daudnagar"],
      Jehanabad: ["Jehanabad Sadar", "Makhdumpur"],
      Arwal: ["Arwal Sadar", "Karpi"],
    },
    "EKANGARSARAI Division": {
      Gaya: ["Gaya Sadar", "Tekari", "Sherghati"],
      Nawada: ["Nawada Sadar", "Rajauli"],
      Aurangabad: ["Aurangabad Sadar", "Daudnagar"],
      Jehanabad: ["Jehanabad Sadar", "Makhdumpur"],
      Arwal: ["Arwal Sadar", "Karpi"],
    },
    "NAWADA Division": {
      Gaya: ["Gaya Sadar", "Tekari", "Sherghati"],
      Nawada: ["Nawada Sadar", "Rajauli"],
      Aurangabad: ["Aurangabad Sadar", "Daudnagar"],
      Jehanabad: ["Jehanabad Sadar", "Makhdumpur"],
      Arwal: ["Arwal Sadar", "Karpi"],
    },
    "SASARAM Division": {
      Gaya: ["Gaya Sadar", "Tekari", "Sherghati"],
      Nawada: ["Nawada Sadar", "Rajauli"],
      Aurangabad: ["Aurangabad Sadar", "Daudnagar"],
      Jehanabad: ["Jehanabad Sadar", "Makhdumpur"],
      Arwal: ["Arwal Sadar", "Karpi"],
    },
    "DEHRIONSONE Division": {
      Gaya: ["Gaya Sadar", "Tekari", "Sherghati"],
      Nawada: ["Nawada Sadar", "Rajauli"],
      Aurangabad: ["Aurangabad Sadar", "Daudnagar"],
      Jehanabad: ["Jehanabad Sadar", "Makhdumpur"],
      Arwal: ["Arwal Sadar", "Karpi"],
    },
    "BHABUA Division": {
      Gaya: ["Gaya Sadar", "Tekari", "Sherghati"],
      Nawada: ["Nawada Sadar", "Rajauli"],
      Aurangabad: ["Aurangabad Sadar", "Daudnagar"],
      Jehanabad: ["Jehanabad Sadar", "Makhdumpur"],
      Arwal: ["Arwal Sadar", "Karpi"],
    },
    "GAYA(U) Division": {
      Gaya: ["Gaya Sadar", "Tekari", "Sherghati"],
      Nawada: ["Nawada Sadar", "Rajauli"],
      Aurangabad: ["Aurangabad Sadar", "Daudnagar"],
      Jehanabad: ["Jehanabad Sadar", "Makhdumpur"],
      Arwal: ["Arwal Sadar", "Karpi"],
    },
    "GAYA(R) Division": {
      Gaya: ["Gaya Sadar", "Tekari", "Sherghati"],
      Nawada: ["Nawada Sadar", "Rajauli"],
      Aurangabad: ["Aurangabad Sadar", "Daudnagar"],
      Jehanabad: ["Jehanabad Sadar", "Makhdumpur"],
      Arwal: ["Arwal Sadar", "Karpi"],
    },
    "BIHARSARIF(U) Division": {
      Gaya: ["Gaya Sadar", "Tekari", "Sherghati"],
      Nawada: ["Nawada Sadar", "Rajauli"],
      Aurangabad: ["Aurangabad Sadar", "Daudnagar"],
      Jehanabad: ["Jehanabad Sadar", "Makhdumpur"],
      Arwal: ["Arwal Sadar", "Karpi"],
    },
    "SHERGHATI Division": {
      Gaya: ["Gaya Sadar", "Tekari", "Sherghati"],
      Nawada: ["Nawada Sadar", "Rajauli"],
      Aurangabad: ["Aurangabad Sadar", "Daudnagar"],
      Jehanabad: ["Jehanabad Sadar", "Makhdumpur"],
      Arwal: ["Arwal Sadar", "Karpi"],
    },
    "AURANGABAD Division": {
      Gaya: ["Gaya Sadar", "Tekari", "Sherghati"],
      Nawada: ["Nawada Sadar", "Rajauli"],
      Aurangabad: ["Aurangabad Sadar", "Daudnagar"],
      Jehanabad: ["Jehanabad Sadar", "Makhdumpur"],
      Arwal: ["Arwal Sadar", "Karpi"],
    },
    "JAHANABAD Division": {
      Gaya: ["Gaya Sadar", "Tekari", "Sherghati"],
      Nawada: ["Nawada Sadar", "Rajauli"],
      Aurangabad: ["Aurangabad Sadar", "Daudnagar"],
      Jehanabad: ["Jehanabad Sadar", "Makhdumpur"],
      Arwal: ["Arwal Sadar", "Karpi"],
    },
    "ARWAL Division": {
      Gaya: ["Gaya Sadar", "Tekari", "Sherghati"],
      Nawada: ["Nawada Sadar", "Rajauli"],
      Aurangabad: ["Aurangabad Sadar", "Daudnagar"],
      Jehanabad: ["Jehanabad Sadar", "Makhdumpur"],
      Arwal: ["Arwal Sadar", "Karpi"],
    },
    "BHAGALPUR(U) Division": {
      Gaya: ["Gaya Sadar", "Tekari", "Sherghati"],
      Nawada: ["Nawada Sadar", "Rajauli"],
      Aurangabad: ["Aurangabad Sadar", "Daudnagar"],
      Jehanabad: ["Jehanabad Sadar", "Makhdumpur"],
      Arwal: ["Arwal Sadar", "Karpi"],
    },
    "BHAGALPUR(E) Division": {
      Gaya: ["Gaya Sadar", "Tekari", "Sherghati"],
      Nawada: ["Nawada Sadar", "Rajauli"],
      Aurangabad: ["Aurangabad Sadar", "Daudnagar"],
      Jehanabad: ["Jehanabad Sadar", "Makhdumpur"],
      Arwal: ["Arwal Sadar", "Karpi"],
    },
    "BANKA Division": {
      Gaya: ["Gaya Sadar", "Tekari", "Sherghati"],
      Nawada: ["Nawada Sadar", "Rajauli"],
      Aurangabad: ["Aurangabad Sadar", "Daudnagar"],
      Jehanabad: ["Jehanabad Sadar", "Makhdumpur"],
      Arwal: ["Arwal Sadar", "Karpi"],
    },
    "MUNGER Division": {
      Gaya: ["Gaya Sadar", "Tekari", "Sherghati"],
      Nawada: ["Nawada Sadar", "Rajauli"],
      Aurangabad: ["Aurangabad Sadar", "Daudnagar"],
      Jehanabad: ["Jehanabad Sadar", "Makhdumpur"],
      Arwal: ["Arwal Sadar", "Karpi"],
    },
    "LAKHISARAI Division": {
      Gaya: ["Gaya Sadar", "Tekari", "Sherghati"],
      Nawada: ["Nawada Sadar", "Rajauli"],
      Aurangabad: ["Aurangabad Sadar", "Daudnagar"],
      Jehanabad: ["Jehanabad Sadar", "Makhdumpur"],
      Arwal: ["Arwal Sadar", "Karpi"],
    },
    "SHEIKHPURA Division": {
      Gaya: ["Gaya Sadar", "Tekari", "Sherghati"],
      Nawada: ["Nawada Sadar", "Rajauli"],
      Aurangabad: ["Aurangabad Sadar", "Daudnagar"],
      Jehanabad: ["Jehanabad Sadar", "Makhdumpur"],
      Arwal: ["Arwal Sadar", "Karpi"],
    },
    "JAMUI Division": {
      Gaya: ["Gaya Sadar", "Tekari", "Sherghati"],
      Nawada: ["Nawada Sadar", "Rajauli"],
      Aurangabad: ["Aurangabad Sadar", "Daudnagar"],
      Jehanabad: ["Jehanabad Sadar", "Makhdumpur"],
      Arwal: ["Arwal Sadar", "Karpi"],
    },
    "KHAGAUL Division": {
      Gaya: ["Gaya Sadar", "Tekari", "Sherghati"],
      Nawada: ["Nawada Sadar", "Rajauli"],
      Aurangabad: ["Aurangabad Sadar", "Daudnagar"],
      Jehanabad: ["Jehanabad Sadar", "Makhdumpur"],
      Arwal: ["Arwal Sadar", "Karpi"],
    },
    "JAGDISHPUR Division": {
      Gaya: ["Gaya Sadar", "Tekari", "Sherghati"],
      Nawada: ["Nawada Sadar", "Rajauli"],
      Aurangabad: ["Aurangabad Sadar", "Daudnagar"],
      Jehanabad: ["Jehanabad Sadar", "Makhdumpur"],
      Arwal: ["Arwal Sadar", "Karpi"],
    },
    "DAUDNAGAR Division": {
      Gaya: ["Gaya Sadar", "Tekari", "Sherghati"],
      Nawada: ["Nawada Sadar", "Rajauli"],
      Aurangabad: ["Aurangabad Sadar", "Daudnagar"],
      Jehanabad: ["Jehanabad Sadar", "Makhdumpur"],
      Arwal: ["Arwal Sadar", "Karpi"],
    },
    "NAUGACHIA Division": {
      Gaya: ["Gaya Sadar", "Tekari", "Sherghati"],
      Nawada: ["Nawada Sadar", "Rajauli"],
      Aurangabad: ["Aurangabad Sadar", "Daudnagar"],
      Jehanabad: ["Jehanabad Sadar", "Makhdumpur"],
      Arwal: ["Arwal Sadar", "Karpi"],
    },
    "MANPUR Division": {
      Gaya: ["Gaya Sadar", "Tekari", "Sherghati"],
      Nawada: ["Nawada Sadar", "Rajauli"],
      Aurangabad: ["Aurangabad Sadar", "Daudnagar"],
      Jehanabad: ["Jehanabad Sadar", "Makhdumpur"],
      Arwal: ["Arwal Sadar", "Karpi"],
    },
    "AMARPUR Division": {
      Gaya: ["Gaya Sadar", "Tekari", "Sherghati"],
      Nawada: ["Nawada Sadar", "Rajauli"],
      Aurangabad: ["Aurangabad Sadar", "Daudnagar"],
      Jehanabad: ["Jehanabad Sadar", "Makhdumpur"],
      Arwal: ["Arwal Sadar", "Karpi"],
    },
    "RAJAULI Division": {
      Gaya: ["Gaya Sadar", "Tekari", "Sherghati"],
      Nawada: ["Nawada Sadar", "Rajauli"],
      Aurangabad: ["Aurangabad Sadar", "Daudnagar"],
      Jehanabad: ["Jehanabad Sadar", "Makhdumpur"],
      Arwal: ["Arwal Sadar", "Karpi"],
    },
  };








  const [formData, setFormData] = useState({
    name: "",
    fatherOrHusbandName: "",
    dob: "",
    role: "",
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
    consumerId: "",
  });


  const [errors, setErrors] = useState({
    name: "",
    fatherOrHusbandName: "",
    dob: "",
    role: "",
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
    consumerId: "",
  });

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



    if (!formData.section.trim()) {
      formErrors.section = "Section is required";
    }

    if (formData.education.length === 0) {
      formErrors.education = "Please select at least one education level.";
    }

    // Aadhar Number validation
    if (!formData.aadharNumber) {
      formErrors.aadharNumber = "Aadhar Number is required";
    } else if (formData.aadharNumber.length !== 14) {
      formErrors.aadharNumber = "Aadhar Number must be 12 digits long";
    }

    if (!formData.panNumber) {
      formErrors.panNumber = "PAN Number is required";
    } else if (formData.panNumber.length !== 10) {
      formErrors.panNumber = "PAN Number must be exactly 10 characters long";
    } else if (!/^[A-Z]{5}[0-9]{4}[A-Z]$/.test(formData.panNumber)) {
      formErrors.panNumber = "PAN Number must follow the format: 5 letters, 4 digits, 1 letter";
    }





    // Mobile Number validation
    if (!formData.mobileNumber) {
      formErrors.mobileNumber = "Mobile Number is required";
    } else if (formData.mobileNumber.length !== 10) {
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


    // Pincode validation
    if (!formData.pincode) {
      formErrors.pincode = "Pincode is required";
    } else if (formData.pincode.length !== 6) {
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

    if (!formData.role) {
      formErrors.role = "Role is required";
    }

    if (!formData.consumerId && !(formData.division && formData.district && formData.subDivision)) {
      formErrors.general = "You must provide either the division, district, and sub-division or your Consumer ID.";
    }

    setErrors(formErrors);
    return Object.keys(formErrors).length === 0;
  };

  const formatAadharNumber = (value) => {
    // Remove non-numeric characters
    value = value.replace(/\D/g, '');

    // Add dashes every four digits
    return value.replace(/(\d{4})(?=\d)/g, '$1-');
  };


  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;



    const formattedValue = name === 'aadharNumber' ? formatAadharNumber(value) : value;





    let updatedValue;

    if (name === 'aadharNumber') {
      // Format the Aadhaar number
      updatedValue = formatAadharNumber(value);
    } else if (type === 'checkbox') {
      updatedValue = checked; // For checkboxes, use the checked state (true/false)
    } else if (type === 'radio') {
      updatedValue = value; // For radio buttons, use the value
    } else {
      // For other input types
      updatedValue = name === "email" ? value : value.toUpperCase();
    }

    setFormData({ ...formData, [name]: updatedValue });




    if (name === "division") {
      const selectedDivision = divisionsData[value] || {};
      const districts = Object.keys(selectedDivision);
      setDistrictOptions(districts);
      setSubDivisionOptions([]);
      setFormData({ ...formData, division: value, district: "", subDivision: "" });
    } else if (name === "district") {
      const selectedSubDivisions = divisionsData[formData.division][value] || [];
      setSubDivisionOptions(selectedSubDivisions);
      setFormData({ ...formData, district: value, subDivision: "" });
    } else if (name === "subDivision") {
      setFormData({ ...formData, subDivision: value });
    }

    setErrors((prev) => ({ ...prev, [name]: '' }));

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
    setErrors((prev) => ({ ...prev, [name]: '' }));

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


  const handleRadioChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  }


  // const handleCheckboxChange = (e) => {
  //   const { value, checked } = e.target;

  //   setFormData((prev) => {
  //     // Update the array based on the checkbox state
  //     const updatedValues = checked
  //       ? [...prev.education, value] // Add value if checked
  //       : prev.education.filter((item) => item !== value); // Remove value if unchecked

  //     return {
  //       ...prev,
  //       education: updatedValues,
  //     };
  //   });

  //   // Optionally clear any associated errors
  //   setErrors((prev) => ({
  //     ...prev,
  //     education: "",
  //   }));
  // };







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


  const handleFocus = (e) => {
    const { name } = e.target;
    setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;

    // Initialize an error object
    let formErrors = {};

    // Define validation rules based on the name of the field
    if (name === "name" && !formData.name.trim()) {
      formErrors.name = "Name is required";
    }

    if (name === "fatherOrHusbandName" && !formData.fatherOrHusbandName.trim()) {
      formErrors.fatherOrHusbandName = "Father's/Husband's Name is required";
    }

    if (name === "dob" && !formData.dob) {
      formErrors.dob = "Date of Birth is required";
    }

    if (name === "section" && !formData.section.trim()) {
      formErrors.section = "Section is required";
    }

    if (name === "education" && formData.education.length === 0) {
      formErrors.education = "Please select at least one education level.";
    }

    if (name === "aadharNumber") {
      if (!formData.aadharNumber) {
        formErrors.aadharNumber = "Aadhar Number is required";
      } else if (formData.aadharNumber.length !== 14) {
        formErrors.aadharNumber = "Aadhar Number must be 12 digits long";
      }
    }

    if (name === "panNumber") {
      if (!formData.panNumber) {
        formErrors.panNumber = "PAN Number is required";
      } else if (formData.panNumber.length !== 10) {
        formErrors.panNumber = "PAN Number must be exactly 10 characters long";
      } else if (!/^[A-Z]{5}[0-9]{4}[A-Z]$/.test(formData.panNumber)) {
        formErrors.panNumber = "PAN Number must follow the format: 5 letters, 4 digits, 1 letter";
      }
    }

    if (name === "mobileNumber") {
      if (!formData.mobileNumber) {
        formErrors.mobileNumber = "Mobile Number is required";
      } else if (formData.mobileNumber.length !== 10) {
        formErrors.mobileNumber = "Mobile Number must be 10 digits long";
      }
    }

    if (name === "email") {
      if (!formData.email) {
        formErrors.email = "Email is required";
      } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
        formErrors.email = "Email address is invalid";
      }
    }

    if (name === "salaryBasis" && !formData.salaryBasis) {
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


    // Pincode validation
    if (!formData.pincode) {
      formErrors.pincode = "Pincode is required";
    } else if (formData.pincode.length !== 6) {
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

    if (!formData.role) {
      formErrors.role = "Role is required";
    }

    // Add other field validations as needed

    // Set the specific field's error
    setErrors((prev) => ({
      ...prev,
      [name]: formErrors[name] || "" // Set the error for the specific field or clear it
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
          formData[key].forEach((value) => formDataToSend.append(key, value));
        } else if (typeof formData[key] === "boolean") {
          // Convert boolean (for checkboxes) to string "true" or "false"
          formDataToSend.append(key, formData[key] ? "true" : "false");
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
    navigate("/login");
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
                          onFocus={handleFocus}
                          onBlur={handleBlur}
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
                          onFocus={handleFocus}
                          onBlur={handleBlur}
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
                          onFocus={handleFocus}
                          onBlur={handleBlur}
                          autoComplete="bday"
                        />
                      </CInputGroup>
                      {errors.dob && (
                        <p className="text-danger">{errors.dob}</p>
                      )}
                    </CCol>
                    <CInputGroup className="mb-3">
                      <CInputGroupText>Select Role</CInputGroupText>
                      <CFormSelect
                        id="role"
                        name="role"
                        onChange={handleChange}
                        onFocus={handleFocus}
                        onBlur={handleBlur}
                        aria-label="Select Role"
                      >
                        <option value="">Select Role</option>
                        <option value="distributor" disabled>Distributor</option>
                        <option value="agent">Agent</option>
                      </CFormSelect>
                    </CInputGroup>
                    {errors.role && (
                      <p className="text-danger">{errors.role}</p>
                    )}



                    <CCol md={6}>


                      {/* <CInputGroup className="mb-3">
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
                            onChange={handleRadioChange}
                          />
                          <CFormCheck
                            variant="inline"
                            type="radio"
                            name="salaryBasis"
                            id="comissionbased"
                            label="Commission Based"
                            value="commission based"
                            checked={formData.salaryBasis === "commission based"}
                            onChange={handleRadioChange}
                          />
                        </div>
                      </CInputGroup>
                      {errors.salaryBasis && <p className="text-danger">{errors.salaryBasis}</p>} */}



                      <CInputGroup className="mb-3">
                        <CInputGroupText>Aadhar</CInputGroupText>
                        <CFormInput
                          name="aadharNumber"
                          placeholder="Aadhar Number"
                          type="text"
                          value={formData.aadharNumber}
                          onChange={handleChange}
                          onFocus={handleFocus}
                          onBlur={handleBlur}

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
                          onFocus={handleFocus}
                          onBlur={handleBlur}

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
                        <CInputGroupText>+91</CInputGroupText>
                        <CFormInput
                          name="mobileNumber"
                          placeholder="Mobile Number"
                          type="number"
                          value={formData.mobileNumber}
                          onChange={handleChange}
                          onFocus={handleFocus}
                          onBlur={handleBlur}

                          autoComplete="tel"
                          style={{ paddingLeft: '1rem' }}
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
                          onFocus={handleFocus}
                          onBlur={handleBlur}

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
                            onChange={handleRadioChange}


                          />
                          <CFormCheck
                            variant="inline"
                            type="radio"
                            name="gender"
                            id="genderFemale"
                            label="Female"
                            value="Female"
                            checked={formData.gender === "Female"}
                            onChange={handleRadioChange}


                          />
                          <CFormCheck
                            variant="inline"
                            type="radio"
                            name="gender"
                            id="genderOther"
                            label="Other"
                            value="Other"
                            checked={formData.gender === "Other"}
                            onChange={handleRadioChange}


                          />
                        </div>
                      </CInputGroup>
                      {errors.gender && (
                        <p className="text-danger">{errors.gender}</p>
                      )}

                      {/* <CInputGroup className="mb-3">
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
                            onChange={handleRadioChange}
                            

                          />
                          <CFormCheck
                            variant="inline"
                            type="radio"
                            name="sectionType"
                            id="sectionUrban"
                            label="Urban"
                            value="Urban"
                            checked={formData.sectionType === "Urban"}
                            onChange={handleRadioChange}
                            

                          />
                          <CFormCheck
                            variant="inline"
                            type="radio"
                            name="sectionType"
                            id="sectionBoth"
                            label="Both"
                            value="Both"
                            checked={formData.sectionType === "Both"}
                            onChange={handleRadioChange}
                          

                          />
                        </div>
                      </CInputGroup>
                      {errors.sectionType && (
                        <p className="text-danger">{errors.sectionType}</p>
                      )} */}

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
                            onChange={handleRadioChange}


                          />
                          <CFormCheck
                            variant="inline"
                            type="radio"
                            name="maritalStatus"
                            id="maritalMarried"
                            label="Married"
                            value="Married"
                            checked={formData.maritalStatus === "Married"}
                            onChange={handleRadioChange}

                          />
                          <CFormCheck
                            variant="inline"
                            type="radio"
                            name="maritalStatus"
                            id="maritalDivorced"
                            label="Divorced"
                            value="Divorced"
                            checked={formData.maritalStatus === "Divorced"}
                            onChange={handleRadioChange}


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
                          onFocus={handleFocus}
                          onBlur={handleBlur}

                          style={{ display: "none" }}
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
                          onFocus={handleFocus}
                          onBlur={handleBlur}

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
                          checked={formData.education.includes("Above 12th Pass")}
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
                    {errors.education && <p className="text-danger">{errors.education}</p>}


                    <CCol md={12} className="mb-3">
                      <CInputGroup className="mb-3">
                        <CInputGroupText>Address</CInputGroupText>
                        <CFormInput
                          name="address"
                          placeholder="Full Address"
                          value={formData.address}
                          onChange={handleChange}
                          onFocus={handleFocus}
                          onBlur={handleBlur}

                          autoComplete="street-address"
                        />
                      </CInputGroup>
                      {errors.address && (
                        <p className="text-danger">{errors.address}</p>
                      )}

                      <CRow className="d-flex">



                        <CCol md={6}>
                          <CInputGroup className="mb-3">
                            <CInputGroupText>Pin Code</CInputGroupText>
                            <CFormInput
                              name="pincode"
                              placeholder="Pin Code"
                              value={formData.pincode}
                              onChange={handleChange}
                              onFocus={handleFocus}
                              onBlur={handleBlur}

                              autoComplete="street-address"
                            />
                          </CInputGroup>
                          {errors.pincode && (
                            <p className="text-danger">{errors.pincode}</p>
                          )}


                          <CInputGroup className="mb-3">
                            <CInputGroupText>District</CInputGroupText>
                            <CFormSelect
                              name="district"
                              value={formData.district}
                              onChange={handleChange}
                              onFocus={handleFocus}
                              onBlur={handleBlur}

                              aria-label="Select District"
                            >
                              <option value="" disabled>
                                Select a district
                              </option>
                              {districts.map((district, index) => (
                                <option key={index} value={district}>
                                  {district}
                                </option>
                              ))}
                            </CFormSelect>
                          </CInputGroup>
                        </CCol>



                        <CCol md={6}>

                          <CInputGroup className="mb-3">
                            <CInputGroupText>Discom</CInputGroupText>
                            <CFormSelect
                              name="discom"
                              value={formData.discom}
                              onChange={handleDiscomChange}
                            >
                              <option value="">Select Discom</option>
                              <option value="NBSL">NBSL</option>
                              <option value="SBPDCL">SBSL</option>
                            </CFormSelect>
                          </CInputGroup>


                          


                          {/* <CInputGroup className="mb-3">
                            <CInputGroupText>District</CInputGroupText>
                            <CFormSelect
                              name="district"
                              value={formData.district}
                              onChange={handleChange}
                              onFocus={handleFocus}
                              onBlur={handleBlur}

                              aria-label="Select District"
                            >
                              <option value="" disabled>
                                Select a district
                              </option>
                              {biharDistricts.map((district, index) => (
                                <option key={index} value={district}>
                                  {district}
                                </option>
                              ))}
                            </CFormSelect>
                          </CInputGroup> */}
                          {/* <CInputGroup className="mb-3">
                            <CInputGroupText>Division</CInputGroupText>
                            <CFormSelect
                              name="division"
                              value={formData.division}
                              onChange={handleChange}
                              onFocus={handleFocus}
                              onBlur={handleBlur}

                              aria-label="Select Division"
                            >
                              <option value="" disabled>
                                Select a division
                              </option>
                              {Object.keys(divisionsData).map((division, index) => (
                                <option key={index} value={division}>
                                  {division}
                                </option>
                              ))}
                            </CFormSelect>
                          </CInputGroup> */}
                        </CCol>
                      </CRow>





                      {/* 
                      {formData.division && (
                        <> */}
                      <CRow className="d-flex">
                        <CCol md={6}>
                          {/* <CInputGroup className="mb-3">
                                <CInputGroupText>District</CInputGroupText>
                                <CFormSelect
                                  name="district"
                                  value={formData.district}
                                  onChange={handleChange}
                                  onFocus={handleFocus}
                                  onBlur={handleBlur}

                                  aria-label="Select District"
                                  disabled={!formData.division} // Disable until a division is selected
                                >
                                  <option value="" disabled>
                                    Select a district
                                  </option>
                                  {districtOptions.map((district, index) => (
                                    <option key={index} value={district}>
                                      {district}
                                    </option>
                                  ))}
                                </CFormSelect>
                              </CInputGroup> */}
                        </CCol>



                        <CCol md={6}>
                          {/* <CInputGroup className="mb-3">
                                <CInputGroupText>Sub Division</CInputGroupText>
                                <CFormSelect
                                  name="subDivision"
                                  value={formData.subDivision}
                                  onChange={handleChange}
                                  onFocus={handleFocus}
                                  onBlur={handleBlur}

                                  aria-label="Select Sub-Division"
                                  disabled={!formData.district} // Disable until a district is selected
                                >
                                  <option value="" disabled>
                                    Select a sub-division
                                  </option>
                                  {subDivisionOptions.map((subDivision, index) => (
                                    <option key={index} value={subDivision}>
                                      {subDivision}
                                    </option>
                                  ))}
                                </CFormSelect>
                              </CInputGroup> */}

                        </CCol>
                      </CRow>
                      {/* </>
                      )} */}

                      <CInputGroup className="mb-3">
                        <CInputGroupText>Select Any One</CInputGroupText>
                        <div className="d-flex m-2 align-items-center">
                          <CFormCheck
                            variant="inline"
                            type="radio"
                            name="selection"
                            id="consumerId"
                            label="Consumer Id"
                            value="ConsumerId"
                            checked={formData.selection === "ConsumerId"}
                            onChange={handleRadioChange}
                          />
                          <CFormCheck
                            variant="inline"
                            type="radio"
                            name="selection"
                            id="division"
                            label="Division"
                            value="Division"
                            checked={formData.selection === "Division"}
                            onChange={handleRadioChange}
                          />
                        </div>
                      </CInputGroup>

                      {/* Conditional rendering based on selection */}
                      {formData.selection === "ConsumerId" && (
                        <CInputGroup className="mb-3">
                          <CInputGroupText>Consumer ID</CInputGroupText>
                          <CFormInput
                            type="text"
                            name="consumerId"
                            value={formData.consumerId}
                            onChange={handleChange}
                            placeholder="Enter Consumer ID"
                          />
                        </CInputGroup>
                      )}

                      {formData.selection === "Division" && (
                        <>
                          <CInputGroup className="mb-3">
                            <CInputGroupText>Select Division</CInputGroupText>
                            <CFormSelect
                              name="division"
                              value={formData.division}
                              onChange={handleChange}
                            >
                              <option value="">Select Division</option>
                              {divisionsData && Object.keys(divisionsData).map((division) => (
                                <option key={division} value={division}>
                                  {division}
                                </option>
                              ))}
                            </CFormSelect>
                          </CInputGroup>

                          {/* District Dropdown */}
                          <CInputGroup className="mb-3">
                            <CInputGroupText>Select Sub-Division</CInputGroupText>
                            <CFormSelect
                              name="district"
                              value={formData.district}
                              onChange={handleChange}
                              disabled={!formData.division}
                            >
                              <option value="">Select Sub-Division</option>
                              {formData.division && divisionsData[formData.division] && Object.keys(divisionsData[formData.division]).map((district) => (
                                <option key={district} value={district}>
                                  {district}
                                </option>
                              ))}
                            </CFormSelect>
                          </CInputGroup>

                          {/* Sub-Division Dropdown */}
                          <CInputGroup className="mb-3">
                            <CInputGroupText>Select Section</CInputGroupText>
                            <CFormSelect
                              name="subDivision"
                              value={formData.subDivision}
                              onChange={handleChange}
                              disabled={!formData.district}
                            >
                              <option value="">Select Section-Division</option>
                              {formData.district && divisionsData[formData.division] && divisionsData[formData.division][formData.district] && divisionsData[formData.division][formData.district].map((subDivision) => (
                                <option key={subDivision} value={subDivision}>
                                  {subDivision}
                                </option>
                              ))}
                            </CFormSelect>
                          </CInputGroup>
                        </>

                      )}

                      {/* <CInputGroup className="mb-3">
                        <CInputGroupText>Consumer ID</CInputGroupText>
                        <CFormInput
                          name="consumerId"
                          placeholder="Enter your Consumer ID"
                          value={formData.consumerId}
                          onChange={handleChange}
                          onFocus={handleFocus}
                          onBlur={handleBlur}

                          autoComplete="off"
                        />
                      </CInputGroup> */}

                      {errors.general && <p className="text-danger">{errors.general}</p>}


                      <CInputGroup className="mb-3">
                        <CInputGroupText>Bank Name</CInputGroupText>
                        <CFormInput
                          name="bank"
                          placeholder="Bank Name"
                          value={formData.bank}
                          onChange={handleChange}
                          onFocus={handleFocus}
                          onBlur={handleBlur}

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
                          onFocus={handleFocus}
                          onBlur={handleBlur}

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
                          onFocus={handleFocus}
                          onBlur={handleBlur}

                          autoComplete="off"
                        />
                      </CInputGroup>
                      {errors.ifsc && (
                        <p className="text-danger">{errors.ifsc}</p>
                      )}



                      {/* <CInputGroup className="mb-3">
                        <CInputGroupText>Section</CInputGroupText>
                        <CFormInput
                          name="section"
                          placeholder="Section"
                          value={formData.section}
                          onChange={handleChange}
                          onFocus={handleFocus}
                          onBlur={handleBlur}

                          autoComplete="off"
                        />
                      </CInputGroup>
                      {errors.section && (
                        <p className="text-danger">{errors.section}</p>
                      )} */}
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
                          onFocus={handleFocus}
                          onBlur={handleBlur}

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
    </div >
  );
};

export default Register;
