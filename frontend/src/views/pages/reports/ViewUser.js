import React, { useEffect, useState } from 'react';
import DataTable from 'react-data-table-component';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle, faTimesCircle, faUnlock, faLock, faDownload, faFileExcel, faSearch } from '@fortawesome/free-solid-svg-icons';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
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
  const doc = new jsPDF({
    orientation: 'landscape', // Use landscape orientation
    unit: 'mm',
    format: 'a4'
  });

  // Title and date
  const title = "Table Data";
  doc.setFontSize(16);
  doc.text(title, doc.internal.pageSize.getWidth() / 2, 15, { align: 'center' });
  doc.setFontSize(10);
  doc.text("Generated on: " + new Date().toLocaleDateString(), 14, 25);

  // Define columns
  const columns = [
    { header: 'Name', dataKey: 'name' },
    { header: 'Father/Husband Name', dataKey: 'fatherorHusbandName' },
    { header: 'DOB', dataKey: 'dob' },
    { header: 'Aadhar No.', dataKey: 'aadharNumber' },
    { header: 'Pan No.', dataKey: 'panNumber' },
    { header: 'Mobile No.', dataKey: 'mobileNumber' },
    { header: 'Gender', dataKey: 'gender' },
    { header: 'Marital Status', dataKey: 'maritalStatus' },
    { header: 'Education', dataKey: 'education' },
    { header: 'Address', dataKey: 'address' },
    { header: 'Job Type', dataKey: 'salaryBasis' },
    { header: 'Email', dataKey: 'email' },
    { header: 'Division', dataKey: 'division' },
    { header: 'Sub-Division', dataKey: 'subDivision' },
    { header: 'Section', dataKey: 'section' },
    { header: 'Section Type', dataKey: 'sectionType' },
    { header: 'Created At', dataKey: 'createdAt' },
    { header: 'Updated At', dataKey: 'updatedAt' },
  ];

  const rows = data.map(row => ({
    name: row.name,
    fatherorHusbandName: row.fatherorHusbandName,
    dob: row.dob,
    aadharNumber: row.aadharNumber,
    panNumber: row.panNumber,
    mobileNumber: row.mobileNumber,
    gender: row.gender,
    maritalStatus: row.maritalStatus,
    education: row.education,
    address: row.address,
    salaryBasis: row.salaryBasis,
    email: row.email,
    division: row.division,
    subDivision: row.subDivision,
    section: row.section,
    sectionType: row.sectionType,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
  }));

  // Auto table options
  doc.autoTable({
    startY: 30, // Starting y position
    head: [columns.map(col => col.header)],
    body: rows.map(row => columns.map(col => row[col.dataKey])),
    margin: { top: 30, left: 10, right: 10, bottom: 10 }, // Adjust margins
    styles: {
      fontSize: 7, // Smaller font size
      cellPadding: 1,
      overflow: 'linebreak',
      halign: 'left',
      valign: 'middle',
    },
    headStyles: {
      fillColor: [52, 58, 64],
      textColor: [255, 255, 255],
      fontStyle: 'bold',
    },
    alternateRowStyles: {
      fillColor: [220, 220, 220],
    },
    columnStyles: {
      name: { cellWidth: 25 },
      fatherorHusbandName: { cellWidth: 25 },
      dob: { cellWidth: 15 },
      aadharNumber: { cellWidth: 20 },
      panNumber: { cellWidth: 20 },
      mobileNumber: { cellWidth: 20 },
      gender: { cellWidth: 15 },
      maritalStatus: { cellWidth: 20 },
      education: { cellWidth: 20 },
      address: { cellWidth: 30 },
      salaryBasis: { cellWidth: 20 },
      email: { cellWidth: 30 },
      division: { cellWidth: 20 },
      subDivision: { cellWidth: 20 },
      section: { cellWidth: 20 },
      sectionType: { cellWidth: 20 },
      createdAt: { cellWidth: 20 },
      updatedAt: { cellWidth: 20 },
    },
    didDrawPage: (data) => {
      const pageCount = doc.internal.getNumberOfPages();
      doc.setFontSize(8);
      doc.text(`Page ${pageCount}`, data.settings.margin.left, doc.internal.pageSize.getHeight() - 10);
    }
  });

  // Download the PDF
  doc.save('table_data.pdf');
};

// Function to generate and download Excel
const downloadExcel = (data) => {
  const ws = XLSX.utils.json_to_sheet(data); // Convert JSON data to sheet
  const wb = XLSX.utils.book_new(); // Create a new workbook
  XLSX.utils.book_append_sheet(wb, ws, "Table Data"); // Append sheet to workbook
  XLSX.writeFile(wb, 'table_data.xlsx'); // Write and download Excel file
};

const DataTableComponent = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filterText, setFilterText] = useState('');
  const userId = localStorage.getItem('userId');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`/fetchUserList`); 
        const result = response.data.fetchUser || []; // Access the data array from the nested data object
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
    { name: 'Salary Basis', selector: 'salaryBasis', sortable: true },
    { name: 'Email', selector: 'email', sortable: true },
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
        <div className="button-containerr">
      <button 
      className="button-Accept" 
      onClick={() => handleBlockUnblock(row)}
    >
      <FontAwesomeIcon icon={row.isBlocked ? faUnlock : faLock} /> 
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
  

  const filteredItems = data.filter(item => 
    item._id && item._id .toLowerCase().includes(filterText.toLowerCase())
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
          placeholder="Search by name..."
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
        title="My Data Table"
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
