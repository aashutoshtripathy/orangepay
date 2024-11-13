import React, { useEffect, useState } from 'react';
import DataTable from 'react-data-table-component';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle, faTimesCircle, faDownload, faFileExcel, faSearch } from '@fortawesome/free-solid-svg-icons';
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

// Function to generate and download PDF
const downloadPDF = (data) => {
  const doc = new jsPDF();

  // Set up title and other static text
  const pageWidth = doc.internal.pageSize.getWidth();
  const title = "Table Data";
  const titleXPos = pageWidth / 2;

  doc.setFontSize(18);
  doc.text(title, titleXPos, 15, { align: 'center' });

  doc.setFontSize(10);
  doc.text("Generated on: " + new Date().toLocaleDateString(), 14, 25);

  // Define columns and their corresponding data keys
  const columns = [
    { header: 'ID', dataKey: '_id' },
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

  // Map data to match the column structure
  const rows = data.map(row => ({
    _id: row._id,
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

  // Define autoTable options
  const tableOptions = {
    startY: 35, // Start after title and date
    head: [columns.map(col => col.header)], // Header row
    body: rows.map(row => columns.map(col => row[col.dataKey])), // Data rows
    margin: { top: 5, left: 10, right: 10 },
    styles: {
      fontSize: 6, // Reduced font size
      cellPadding: 2, // Reduced padding
      overflow: 'linebreak', // Handle text overflow
      halign: 'left', // Align text in cells
      valign: 'middle', // Vertical alignment
      lineWidth: 0.1, // Set thinner borders
    },
    headStyles: {
      fillColor: [52, 58, 64], // Dark gray background for headers
      textColor: [255, 255, 255], // White text for headers
      fontStyle: 'bold', // Bold font for headers
    },
    alternateRowStyles: {
      fillColor: [240, 240, 240], // Light gray for alternate rows
    },
    columnStyles: {
      0: { cellWidth: 10 }, // ID column
      1: { cellWidth: 10 }, // Automatically adjust for Name
      2: { cellWidth: 10 }, // Automatically adjust for Father/Husband Name
      3: { cellWidth: 10 }, // Date of Birth column
      4: { cellWidth: 25 }, // Aadhar Number column
      5: { cellWidth: 15 }, // Pan Number column
      6: { cellWidth: 20 }, // Mobile Number column
      7: { cellWidth: 15 }, // Gender column
      8: { cellWidth: 25 }, // Marital Status column
      9: { cellWidth: 20 }, // Education column
      10: { cellWidth: 30 }, // Address column (wider for address text)
      11: { cellWidth: 20 }, // Job Type column
      12: { cellWidth: 25 }, // Email column
      13: { cellWidth: 20 }, // Division column
      14: { cellWidth: 20 }, // Sub-Division column
      15: { cellWidth: 20 }, // Section column
      16: { cellWidth: 20 }, // Section Type column
      17: { cellWidth: 25 }, // Created At column
      18: { cellWidth: 25 }, // Updated At column
    },
    didDrawPage: (data) => {
      // Add page number at the bottom
      const pageCount = doc.internal.getNumberOfPages();
      doc.setFontSize(8);
      doc.text(`Page ${pageCount}`, data.settings.margin.left, doc.internal.pageSize.getHeight() - 10);
    },
    pageBreak: 'auto', // Ensure page breaks when necessary
    width: pageWidth - 20, // Ensure table fits within page width
  };

  // Add table to the PDF
  doc.autoTable(tableOptions);

  // Download the PDF
  doc.save('table_data.pdf');
};





// Function to generate and download Excel
const downloadExcel = (data) => {
  const headers = [
    ["ID", "Name", "Father/Husband Name", "DOB", "Aadhar No.", "Pan No.", "Mobile No.", "Gender", 
     "Marital Status", "Education", "Address", "Job Type", "Email", "Division", "Sub-Division", 
     "Section", "Section Type", "Created At", "Updated At"]
  ];
  
  const rows = data.map(row => [
    row._id, row.name, row.fatherorHusbandName, row.dob, row.aadharNumber, row.panNumber, 
    row.mobileNumber, row.gender, row.maritalStatus, row.education, row.address, row.salaryBasis, 
    row.email, row.division, row.subDivision, row.section, row.sectionType, row.createdAt, row.updatedAt
  ]);

  const ws = XLSX.utils.aoa_to_sheet([...headers, ...rows]); // Add headers to sheet
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Rejected User Data");

  // Set custom column widths (adjust as needed)
  ws['!cols'] = headers[0].map(() => ({ wpx: 100 }));

  XLSX.writeFile(wb, 'table_data.xlsx');
};


const DataTableComponent = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [filterText, setFilterText] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('/fetch_data_rejected');
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




  const handleClearDates = () => {
    setFromDate(''); // Clear fromDate
    setToDate('');   // Clear toDate
  };





  const handleSearch = () => {
    // Search logic is already implemented with the filter, just trigger re-render
    setFilterText(filterText);
  };

  const columns = [
    { name: 'Name', selector: 'name', sortable: true },
    { name: 'Father or Husband Name', selector: 'fatherOrHusbandName', sortable: true },
    { name: 'Date Of Birth', selector: 'dob', sortable: true },
    { name: 'Aadhar No.', selector: 'aadharNumber', sortable: true },
    { name: 'Pan No.', selector: 'panNumber', sortable: true },
    { name: 'Mobile No.', selector: 'mobileNumber', sortable: true },
    { name: 'Gender', selector: 'gender', sortable: true },
    { name: 'Marital Status', selector: 'maritalStatus', sortable: true },
    { name: 'Education', selector: 'education', sortable: true },
    { name: 'Address', selector: 'address', sortable: true },
    { name: 'Job Type', selector: 'salaryBasis', sortable: true },
    { name: 'Email', selector: 'email', sortable: true },
    { name: 'Division', selector: 'division', sortable: true },
    { name: 'Sub-Division', selector: 'subDivision', sortable: true },
    { name: 'Section', selector: 'section', sortable: true },
    { name: 'Section Type', selector: 'sectionType', sortable: true },
    { name: 'Created At', selector: 'createdAt', sortable: true },
    { name: 'Updated At', selector: 'updatedAt', sortable: true },
    {
      name: 'Actions',
      cell: (row) => (
        <div className="button-containerr">
          <button
            className="button-search"
            onClick={() => handleAccept(row)}
          >
            <FontAwesomeIcon icon={faCheckCircle} /> Accept
          </button>

          <button
            className="button-download"
            onClick={() => handleDownload(row)}
          >
            <FontAwesomeIcon icon={faDownload} /> Download File
          </button>
        </div>
      ),
    },
  ];

  const filteredItems = data.filter(
    item => item.name && item.name.toLowerCase().includes(filterText.toLowerCase())
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
          title={<h2 style={{ fontSize: '24px', color: '#f36c23', fontFamily: 'sans-serif', fontWeight: '800', textAlign: 'center', }}>Rejected User</h2>}
        columns={columns}
        data={filteredItems}
        pagination
        highlightOnHover
        customStyles={customStyles}
      />
    </div>
    </div>
  );
};

export default DataTableComponent;
