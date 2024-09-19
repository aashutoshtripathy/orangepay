import React, { useEffect, useState } from 'react';
import DataTable from 'react-data-table-component';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle, faTimesCircle, faDownload, faFileExcel, faSearch } from '@fortawesome/free-solid-svg-icons';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from 'xlsx';  // Import XLSX for Excel export
import '../../../scss/dataTable.scss';
import { useNavigate } from 'react-router-dom';

// Define custom styles for the table
const customStyles = {
  rows: {
    style: {
      minHeight: '72px', // Set the minimum row height
    },
  },
  headCells: {
    style: {
      paddingLeft: '8px',
      paddingRight: '8px',
    },
  },
  cells: {
    style: {
      paddingLeft: '8px',
      paddingRight: '8px',
    },
  },
};

// Function to generate and download PDF
const downloadPDF = (data) => {
  // Create a new PDF document with landscape orientation
  const doc = new jsPDF({ orientation: 'landscape' });

  // Define table columns and data
  const columns = [
    { header: 'User ID', dataKey: 'userId' },
    { header: 'Name', dataKey: 'name' },
    { header: 'Father/Husband Name', dataKey: 'fatherOrHusbandName' },
    { header: 'Date of Birth', dataKey: 'dob' },
    { header: 'Aadhar Number', dataKey: 'aadharNumber' },
    { header: 'PAN Number', dataKey: 'panNumber' },
    { header: 'Mobile Number', dataKey: 'mobileNumber' },
    { header: 'Gender', dataKey: 'gender' },
    { header: 'Marital Status', dataKey: 'maritalStatus' },
    { header: 'Education', dataKey: 'education' },
    { header: 'Address', dataKey: 'address' },
    { header: 'District', dataKey: 'district' },
    { header: 'Pin Code', dataKey: 'pincode' },
    { header: 'Bank Name', dataKey: 'bank' },
    { header: 'Account no', dataKey: 'accountno' },
    { header: 'Ifsc Code', dataKey: 'ifsc' },
    { header: 'Job Type', dataKey: 'salaryBasis' },
    { header: 'Email', dataKey: 'email' },
    { header: 'Division', dataKey: 'division' },
    { header: 'Sub-Division', dataKey: 'subDivision' },
    { header: 'Section', dataKey: 'section' },
    { header: 'Password', dataKey: 'password' },
    { header: 'Section Type', dataKey: 'sectionType' }
  ];

  const rows = data.map(item => ({
    userId: item.userId,
    name: item.name,
    fatherOrHusbandName: item.fatherOrHusbandName,
    dob: item.dob,
    aadharNumber: item.aadharNumber,
    panNumber: item.panNumber,
    mobileNumber: item.mobileNumber,
    gender: item.gender,
    maritalStatus: item.maritalStatus,
    education: item.education,
    address: item.address,
    district: item.district,
    pincode: item.pincode,
    bank: item.bank,
    accountno: item.accountno,
    ifsc: item.ifsc,
    salaryBasis: item.salaryBasis,
    email: item.email,
    division: item.division,
    subDivision: item.subDivision,
    section: item.section,
    password: item.password,
    sectionType: item.sectionType
  }));

  // Add table to the PDF with landscape orientation
  doc.autoTable({
    columns: columns,
    body: rows,
    startY: 10,
    margin: { top: 1, bottom: 1, left: 1, right: 1 }, // Tighter margins
    styles: {
      fontSize: 4,   // Further reduce font size
      cellPadding: 0.5, // Reduce cell padding
      overflow: 'linebreak',
    },
    columnStyles: {
      name: { cellWidth: 10 },
      fatherOrHusbandName: { cellWidth: 15 },
      dob: { cellWidth: 10 },
      aadharNumber: { cellWidth: 14 },
      panNumber: { cellWidth: 14 },
      mobileNumber: { cellWidth: 14 },
      gender: { cellWidth: 8 },
      maritalStatus: { cellWidth: 10 },
      education: { cellWidth: 15 },
      address: { cellWidth: 20 },
      district: { cellWidth: 12 },
      pincode: { cellWidth: 8 },
      bank: { cellWidth: 14 },
      accountno: { cellWidth: 14 },
      ifsc: { cellWidth: 10 },
      salaryBasis: { cellWidth: 10 },
      email: { cellWidth: 15 },
      division: { cellWidth: 12 },
      subDivision: { cellWidth: 12 },
      section: { cellWidth: 12 },
      sectionType: { cellWidth: 12 }
    },
    pageBreak: 'auto',
  });

  // Save the PDF
  doc.save('users.pdf');
};

const downloadExcel = (data) => {
  // Define headers and their corresponding keys
  const headers = [
    "Name",
    "Father/Husband Name",
    "Date of Birth",
    "Aadhar Number",
    "PAN Number",
    "Mobile Number",
    "Gender",
    "Marital Status",
    "Education",
    "Address",
    "District",
    "Pin Code",
    "Bank Name",
    "Account no",
    "Ifsc Code",
    "Job Type",
    "Email",
    "Division",
    "Sub-Division",
    "Section",
    "Section Type",
    "Created At",
    "Updated At"
  ];

  // Convert JSON data to sheet
  const wsData = data.map(row => ({
    "Name": row.name,
    "Father/Husband Name": row.fatherOrHusbandName,
    "Date of Birth": row.dob,
    "Aadhar Number": row.aadharNumber,
    "PAN Number": row.panNumber,
    "Mobile Number": row.mobileNumber,
    "Gender": row.gender,
    "Marital Status": row.maritalStatus,
    "Education": row.education,
    "Address": row.address,
    "District": row.district,
    "Pin Code": row.pincode,
    "Bank Name": row.bank,
    "Account no": row.accountno,
    "Ifsc Code": row.ifsc,
    "Job Type": row.salaryBasis,
    "Email": row.email,
    "Division": row.division,
    "Sub-Division": row.subDivision,
    "Section": row.section,
    "Section Type": row.sectionType,
    "Created At": row.createdAt,
    "Updated At": row.updatedAt,
  }));

  // Create a worksheet
  const ws = XLSX.utils.json_to_sheet(wsData, { header: headers });

  // Define column widths manually
  const columnWidths = [
    { wch: 15 },  // User ID
    { wch: 20 },  // Name
    { wch: 25 },  // Father/Husband Name
    { wch: 20 },  // Date of Birth
    { wch: 15 },  // Aadhar Number
    { wch: 15 },  // PAN Number
    { wch: 15 },  // Mobile Number
    { wch: 10 },  // Gender
    { wch: 15 },  // Marital Status
    { wch: 20 },  // Education
    { wch: 30 },  // Address
    { wch: 20 },  // District
    { wch: 10 },  // Pin Code
    { wch: 20 },  // Bank Name
    { wch: 20 },  // Account no
    { wch: 15 },  // Ifsc Code
    { wch: 15 },  // Job Type
    { wch: 25 },  // Email
    { wch: 20 },  // Division
    { wch: 20 },  // Sub-Division
    { wch: 20 },  // Section
    { wch: 20 },  // Password
    { wch: 20 },  // Section Type
    { wch: 20 },  // Created At
    { wch: 20 }   // Updated At
  ];

  // Apply column widths to the worksheet
  ws['!cols'] = columnWidths;

  // Create a new workbook
  const wb = XLSX.utils.book_new();

  // Append sheet to workbook
  XLSX.utils.book_append_sheet(wb, ws, "User Data");

  // Convert workbook to binary format
  const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'binary' });

  // Create a Blob object from the binary data
  function s2ab(s) {
    const buf = new ArrayBuffer(s.length);
    const view = new Uint8Array(buf);
    for (let i = 0; i < s.length; i++) view[i] = s.charCodeAt(i) & 0xFF;
    return buf;
  }

  // Create and trigger the download
  const blob = new Blob([s2ab(wbout)], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'requested_user_data.xlsx'; // File name
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
};


const DataTableComponent = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filterText, setFilterText] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('/fetch_data'); 
        const result = response.data.data || []; // Access the data array from the nested data object
        setData(result);
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Handle Accept Fund Request
const handleAccept = async (row) => {
  try {
    const response = await axios.patch(`/users/${row._id}/approve`);

    if (response.status === 200) {  // Check if the response is successful
      setData((prevData) => prevData.filter((item) => item._id !== row._id));
    }
  } catch (error) {
    console.error("Error approving fund request", error);
  }
};

// Handle Reject Fund Request
const handleReject = async (row) => {
  try {
    const response = await axios.patch(`/users/${row._id}/reject`);

    if (response.status === 200) {  // Check if the response is successful
      setData((prevData) => prevData.filter((item) => item._id !== row._id));
    }
  } catch (error) {
    console.error("Error rejecting fund request", error);
  }
};



const handleDownload = async (row) => {
  try {
    // Use the Aadhar number from the row object to request the ZIP file
    const response = await axios.get(`/download-images/${row.aadharNumber}`, {
      responseType: 'blob', // Important for binary response type (like a ZIP file)
    });

    // Create a URL for the file blob
    const url = window.URL.createObjectURL(new Blob([response.data]));
    
    // Create a link element and set the URL to download
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `photos_${row.aadharNumber}.zip`); // Use Aadhar number for file name

    // Append the link to the body and trigger the click
    document.body.appendChild(link);
    link.click();

    // Clean up
    link.parentNode.removeChild(link);
  } catch (error) {
    console.error('Error downloading file', error);
  }
};

  const handleSearch = () => {
    // Search logic is already implemented with the filter, just trigger re-render
    setFilterText(filterText);
  };

  const handleView = (row) => {
    navigate(`/view-details/${row._id}`)
  };


  const columns = [
    { name: 'Name', selector: 'name', sortable: true },
    { name: 'Father or Husband Name', selector: 'fatherOrHusbandName', sortable: true },
    { name: 'Mobile No.', selector: 'mobileNumber', sortable: true },
    // { name: 'Date Of Birth', selector: 'dob', sortable: true },
    // { name: 'Aadhar No.', selector: 'aadharNumber', sortable: true },
    // { name: 'Pan No.', selector: 'panNumber', sortable: true },
    // { name: 'Mobile No.', selector: 'mobileNumber', sortable: true },
    // { name: 'Gender', selector: 'gender', sortable: true },
    // { name: 'Marital Status', selector: 'maritalStatus', sortable: true },
    // { name: 'Education', selector: 'education', sortable: true },
    // { name: 'Address', selector: 'address', sortable: true },
    // { name: 'District', selector: 'district', sortable: true },
    // { name: 'Pin Code', selector: 'pincode', sortable: true },
    // { name: 'Bank Name', selector: 'bank', sortable: true },
    // { name: 'Account no', selector: 'accountno', sortable: true },
    // { name: 'Ifsc Code', selector: 'ifsc', sortable: true },
    // { name: 'Job Type', selector: 'salaryBasis', sortable: true },
    // { name: 'Email', selector: 'email', sortable: true },
    // { name: 'Division', selector: 'division', sortable: true },
    // { name: 'Sub-Division', selector: 'subDivision', sortable: true },
    // { name: 'Section', selector: 'section', sortable: true },
    // { name: 'Section Type', selector: 'sectionType', sortable: true },
    // { name: 'Created At', selector: 'createdAt', sortable: true },
    // { name: 'Updated At', selector: 'updatedAt', sortable: true },
    {
      name: 'Actions',
      cell: (row) => (
        <div className='actions-cell'>
        {/* <div className="button-containerr"> */}
          <button 
            className="button-search" 
            onClick={() => handleView(row)}
          >
            <FontAwesomeIcon icon={faCheckCircle} /> View Details
          </button>
          {/* <button 
            className="button-reject" 
            onClick={() => handleReject(row)}
          >
            <FontAwesomeIcon icon={faTimesCircle} /> Reject
          </button>
          <button 
            className="button-download" 
            onClick={() => handleDownload(row)}
          >
            <FontAwesomeIcon icon={faDownload} /> Download File
          </button> */}
        {/* </div> */}
        </div>
      ),
    },
  ];

  const filteredItems = data.filter(item =>
    item.name.toLowerCase().includes(filterText.toLowerCase())
  );

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <div>
      <div className="button-container">
      <input
          type="text"
          placeholder="Search by name"
          value={filterText}
          onChange={(e) => setFilterText(e.target.value)}
        />
        <button 
          className="button-search" 
          onClick={handleSearch}
        >
          <FontAwesomeIcon icon={faSearch} /> Search
        </button>
        <button 
          className="button-download" 
          onClick={() => downloadPDF(data)}
        >
          <FontAwesomeIcon icon={faDownload} /> Download PDF
        </button>
        <button 
          className="button-download-excel" 
          onClick={() => downloadExcel(data)}
        >
          <FontAwesomeIcon icon={faFileExcel} /> Download Excel
        </button>
      </div>
      <DataTable
        title="Requested Users"
        columns={columns}
        data={filteredItems}
        pagination
        highlightOnHover
        customStyles={customStyles}
      />
    </div>
  );
};

export default DataTableComponent;
