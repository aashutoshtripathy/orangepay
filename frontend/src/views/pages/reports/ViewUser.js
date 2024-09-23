import React, { useEffect, useState } from 'react';
import DataTable from 'react-data-table-component';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle, faTimesCircle, faUnlock, faLock, faDownload, faFileExcel, faSearch } from '@fortawesome/free-solid-svg-icons';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { CDropdown, CDropdownToggle, CDropdownMenu, CDropdownItem } from '@coreui/react'; // Import CoreUI components
import * as XLSX from 'xlsx';  // Import XLSX for Excel export
import '../../../scss/dataTable.scss';

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
    { header: 'Satus', dataKey: 'status' },
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
      userId: { cellWidth: 7 },
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
      password: { cellWidth: 12 },
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
    "User ID",
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
    "Password",
    "Section Type",
    "Created At",
    "Updated At"
  ];

  // Convert JSON data to sheet
  const wsData = data.map(row => ({
    "User ID": row.userId,
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
    "Password": row.password,
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
  a.download = 'user_data.xlsx'; // File name
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
};


const DataTableComponent = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [statusFilter, setStatusFilter] = useState('all');
  const [filterText, setFilterText] = useState('');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const userId = localStorage.getItem('userId');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`/fetchUserList`); 
        const result = response.data.fetchUser || [];
        console.log(result)
        setData(result);
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [userId]);

  const filteredItems = data.filter(item => {
    // Check status filter
    const matchesStatus =
      statusFilter === 'all' ||
      (statusFilter === 'Approved' && item.status === 'Approved') ||
      (statusFilter === 'Blocked' && item.status === 'Blocked') ||
      (statusFilter === 'Rejected' && item.status === 'Rejected') ||
      (statusFilter === 'Pending' && item.status === 'Pending');
  
    // Check userId filter
    const matchesUserId =
      item.userId &&
      item.userId.toString().toLowerCase().includes(filterText.toLowerCase());
  
      const itemDate = new Date(item.createdAt);
    const fromDateMatch = fromDate ? new Date(fromDate) <= itemDate : true;
    const toDateMatch = toDate ? new Date(toDate) >= itemDate : true;

    return (
      matchesStatus &&
      matchesUserId &&
      fromDateMatch &&
      toDateMatch
    );
  });

  const handleBlockUnblock = async (row) => {
    try {
      const action = row.isBlocked ? 'unblock' : 'block';
      const response = await axios.patch(`/users/${row._id}/${action}`);
      const updatedUser = response.data;
      // Update the data after block/unblock
      setData((prevData) =>
        prevData.map((item) =>
          item._id === updatedUser._id ? updatedUser : item
        )
      );
    } catch (error) {
      console.error(`Error ${row.isBlocked ? 'unblocking' : 'blocking'} user`, error);
    }
  };









  const handleDownload = (row) => {
    console.log('Downloading file for:', row);
    // Implement download logic here
  };

  const handleSearch = () => {
    // Search logic is already implemented with the filter, just trigger re-render
    setFilterText(filterText);
  };

  const columns = [
    // { name: 'ID', selector: '_id', sortable: true },
    { name: 'userId', selector: 'userId', sortable: true },
    { name: 'Name', selector: 'name', sortable: true },
    { name: 'Father/Husband Name', selector: 'fatherOrHusbandName', sortable: true },
    { name: 'Date of Birth', selector: 'dob', sortable: true },
    { name: 'Aadhar Number', selector: 'aadharNumber', sortable: true },
    { name: 'PAN Number', selector: 'panNumber', sortable: true },
    { name: 'Mobile Number', selector: 'mobileNumber', sortable: true },
    { name: 'Gender', selector: 'gender', sortable: true },
    { name: 'Marital Status', selector: 'maritalStatus', sortable: true },
    { name: 'Education', selector: 'education', sortable: true },
    { name: 'Address', selector: 'address', sortable: true },
    { name: 'District', selector: 'district', sortable: true },
    { name: 'Pin Code', selector: 'pincode', sortable: true },
    { name: 'Bank Name', selector: 'bank', sortable: true },
    { name: 'Account no', selector: 'accountno', sortable: true },
    { name: 'Ifsc Code', selector: 'ifsc', sortable: true },
    { name: 'Job Type', selector: 'salaryBasis', sortable: true },
    { name: 'Email', selector: 'email', sortable: true },
    { name: 'Status', selector: 'status', sortable: true },
    { name: 'Division', selector: 'division', sortable: true },
    { name: 'Sub-Division', selector: 'subDivision', sortable: true },
    { name: 'Section', selector: 'section', sortable: true },
    // { name: 'userId', selector: 'userId', sortable: true },
    { name: 'password', selector: 'password', sortable: true },
    { name: 'Section Type', selector: 'sectionType', sortable: true },
    { name: 'Created At', selector: 'createdAt', sortable: true },
    { name: 'Updated At', selector: 'updatedAt', sortable: true },
    {
      name: 'Actions',
      cell: (row) => (
        <div className="actions-cell">
      <button 
      className="button-Accept" 
      onClick={() => handleBlockUnblock(row)}
    >
      {row.isBlocked ? 'Details' : 'Details'}
    </button>
    </div>
      ),
    }
  ];
//   {
//     name: 'Actions',
//     cell: (row) => (
//       <div className="button-containerr">
//         <button 
//           className="button-search" 
//           onClick={() => handleAccept(row)}
//         >
//           <FontAwesomeIcon icon={faCheckCircle} /> Accept
//         </button>
//         <button 
//           className="button-reject" 
//           onClick={() => handleReject(row)}
//         >
//           <FontAwesomeIcon icon={faTimesCircle} /> Reject
//         </button>
//         <button 
//           className="button-download" 
//           onClick={() => handleDownload(row)}
//         >
//           <FontAwesomeIcon icon={faDownload} /> Download File
//         </button>
//       </div>
//     ),
//   },
// ];
  

// const filteredItems = data.filter(item => {
//   return item.userId && typeof item.userId === 'string' &&
//          item.userId.toLowerCase().includes(filterText.toLowerCase());
// });

  

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
          placeholder="Search by userId..."
          value={filterText}
          onChange={(e) => setFilterText(e.target.value)}
        />
        <button 
          className="button-search" 
          onClick={handleSearch}
        >
          <FontAwesomeIcon icon={faSearch} /> Search
        </button>

        <CDropdown>
          <CDropdownToggle color="secondary">
            {statusFilter === 'all' ? 'All Users' : 
             statusFilter === 'Approved' ? 'Active Users' :
             statusFilter === 'Blocked' ? 'Blocked Users' :
             statusFilter === 'Rejected' ? 'Rejected Users' : 
             statusFilter === 'Pending' ? 'Pending Users' : 
             'Pending Users'}
          </CDropdownToggle>
          <CDropdownMenu>
          <CDropdownItem onClick={() => setStatusFilter('all')}>All Users</CDropdownItem>
          <CDropdownItem onClick={() => setStatusFilter('Approved')}>Active Users</CDropdownItem>
          <CDropdownItem onClick={() => setStatusFilter('Blocked')}>Blocked Users</CDropdownItem>
          <CDropdownItem onClick={() => setStatusFilter('Rejected')}>Rejected Users</CDropdownItem>
          <CDropdownItem onClick={() => setStatusFilter('Pending')}>Requested Users</CDropdownItem>
          </CDropdownMenu>
        </CDropdown>

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
        <div className="date-filter-container">
        <label>From Date:</label>
        <input
          type="date"
          value={fromDate}
          onChange={e => setFromDate(e.target.value)}
        />
        <label>To Date:</label>
        <input
          type="date"
          value={toDate}
          onChange={e => setToDate(e.target.value)}
        />
      </div>
      </div>
      <DataTable
        title="View Users"
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
