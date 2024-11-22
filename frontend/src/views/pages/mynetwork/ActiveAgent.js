import React, { useEffect, useState } from 'react';
import DataTable from 'react-data-table-component';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle, faTimesCircle, faUnlock, faLock, faDownload, faFileExcel, faSearch } from '@fortawesome/free-solid-svg-icons';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from 'xlsx';  
import '../../../scss/dataTable.scss';

const customStyles = {
  rows: {
    style: {
      minHeight: '72px', // Set the minimum row height
    },
  },
  headCells: {
    style: {
      // backgroundColor: '#333', // Dark background for header cells
      color: 'black', // Set font color to orange for header cells
      fontSize: '16px', // Adjust font size for header
      fontWeight: 'bold', // Make the header bold
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
  const formattedData = data.map(row => ({
    ID: row._id,
    Name: row.name,
    'Father/Husband Name': row.fatherorHusbandName,
    DOB: row.dob,
    'Aadhar No.': row.aadharNumber,
    'Pan No.': row.panNumber,
    'Mobile No.': row.mobileNumber,
    Gender: row.gender,
    'Marital Status': row.maritalStatus,
    Education: row.education,
    Address: row.address,
    'Job Type': row.salaryBasis,
    Email: row.email,
    Division: row.division,
    'Sub-Division': row.subDivision,
    Section: row.section,
    'Section Type': row.sectionType,
    'Created At': row.createdAt,
    'Updated At': row.updatedAt,
  }));

  const ws = XLSX.utils.json_to_sheet(formattedData);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Table Data");

  // Adjust column widths
  ws['!cols'] = [
    { wpx: 50 },  // Width for ID column
    { wpx: 100 }, // Width for Name column
    { wpx: 150 }, // Width for Father/Husband Name column
    { wpx: 80 },  // Width for DOB column
    { wpx: 100 }, // Width for Aadhar No. column
    { wpx: 100 }, // Width for Pan No. column
    { wpx: 100 }, // Width for Mobile No. column
    { wpx: 50 },  // Width for Gender column
    { wpx: 100 }, // Width for Marital Status column
    { wpx: 100 }, // Width for Education column
    { wpx: 150 }, // Width for Address column
    { wpx: 100 }, // Width for Job Type column
    { wpx: 150 }, // Width for Email column
    { wpx: 100 }, // Width for Division column
    { wpx: 120 }, // Width for Sub-Division column
    { wpx: 100 }, // Width for Section column
    { wpx: 100 }, // Width for Section Type column
    { wpx: 120 }, // Width for Created At column
    { wpx: 120 }, // Width for Updated At column
  ];

  XLSX.writeFile(wb, 'table_data.xlsx');
};


const DataTableComponent = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [filterText, setFilterText] = useState('');
  const userId = localStorage.getItem('userId');

   useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      // Clear any previous error
      setError(null);
  
      const response = await axios.get('/api/v1/users/fetchUserList');
      
      // Handle response if status is 404
      if (response.status === 404) {
        setError(undefined);  // Set error to undefined
      } else {
        setData(response.data.fetchUser);
      }
    } catch (error) {
      setError(error);
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };
  

  const handleBlockUnblock = async (row, action) => {
    try {
      const url = action === 'block' ? `/block/${row._id}` : `/unblock/${row._id}`;
      console.log(url)
      const response = await axios.post(url , { userId: row._id });
      if (response.status === 200) {
        fetchData();  // Refresh data after blocking/unblocking
      }
    } catch (error) {
      console.error(`Error ${action}ing user:`, error);
    }
  };
  
  const handleClearDates = () => {
    setFromDate(''); // Clear fromDate
    setToDate('');   // Clear toDate
  };
 

  const handleSearch = () => {
    setFilterText(filterText); 
  };

  const columns = [
    { name: 'userId', selector: 'userId', sortable: true },
    { name: 'Name', selector: 'name', sortable: true },
    { name: 'Father/Husband Name', selector: 'fatherOrHusbandName', sortable: true },
    // { name: 'Date of Birth', selector: 'dob', sortable: true },
    { name: 'Aadhar Number', selector: 'aadharNumber', sortable: true },
    { name: 'PAN Number', selector: 'panNumber', sortable: true },
    { name: 'Mobile Number', selector: 'mobileNumber', sortable: true },
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
    // { name: 'userId', selector: 'userId', sortable: true },
    // { name: 'password', selector: 'password', sortable: true },
    { name: 'Actions', 
      cell: (row) => (
        <div className="actions-cell">
          {row.isBlocked ? (
          <button 
            className="block-unblock-btn unblock-btn" 
            onClick={() => handleBlockUnblock(row, 'unblock')}
          >
            Unblock
          </button>
        ) : (
          <button 
            className="block-unblock-btn block-btn" 
            onClick={() => handleBlockUnblock(row, 'block')}
          >
            Block
          </button>
        )}
      </div>
      ),
      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
    }    
  ];

  const filteredItems = data.filter((item) =>
    item.userId && item.userId.toLowerCase().includes(filterText.toLowerCase())
  );

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <div className="cspinner"></div>
      </div>
    );
  }
  

  return (
    <div>
      <div className="button-container">
        <input
          type="text"
          placeholder="Search by status..."
          value={filterText}
          onChange={(e) => setFilterText(e.target.value)}
        />
        {/* <button 
          className="button-search" 
          onClick={handleSearch}
        >
          <FontAwesomeIcon icon={faSearch} /> Search
        </button> */}
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
          <button
            className="button-clear-dates"
            onClick={handleClearDates}
          >
            Clear Dates
          </button>
        </div>
      </div>
      <div className="data-table-container">
      
      <DataTable
        title={<h2 style={{ fontSize: '24px', color: '#f36c23', fontFamily: 'sans-serif', fontWeight: '800', textAlign: 'center', }}>Active Agents</h2>}
        columns={columns}
        data={filteredItems}
        customStyles={customStyles}
        pagination
        // selectableRows
        highlightOnHover
        striped
      />
      {error && <p>Error loading data: {error.message}</p>}
    </div>
    </div>
  );
};

export default DataTableComponent;
