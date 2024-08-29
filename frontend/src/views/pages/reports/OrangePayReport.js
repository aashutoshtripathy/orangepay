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

  // Set up margins and title
  const pageWidth = doc.internal.pageSize.getWidth();
  const title = "Table Data";
  const titleXPos = pageWidth / 2;

  doc.setFontSize(18);
  doc.text(title, titleXPos, 15, { align: 'center' });

  doc.setFontSize(10);
  doc.text("Generated on: " + new Date().toLocaleDateString(), 14, 25);

  // Define the columns and their widths
  const columns = [
    { header: 'ID', dataKey: '_id' },
    { header: 'transaction_id', dataKey: 'transaction_id' },
    { header: 'Father/Husband Name', dataKey: 'reference_number' },
    { header: 'lower_level', dataKey: 'lower_level' },
    { header: 'upper_level', dataKey: 'upper_level' },
    { header: 'Pan No.', dataKey: 'transaction_datetime' },
    { header: 'Mobile No.', dataKey: 'service_name' },
    { header: 'Mobile No.', dataKey: 'amount_before_due_date' },
    { header: 'request_amount', dataKey: 'request_amount' },
    { header: 'total_service_charge', dataKey: 'total_service_charge' },
    { header: 'total_commission', dataKey: 'total_commission' },
    { header: 'net_amount', dataKey: 'net_amount' },
    { header: 'action_on_amount', dataKey: 'action_on_amount' },
    { header: 'status', dataKey: 'status' },
    { header: 'final_bal_amount', dataKey: 'final_bal_amount' },
    { header: 'update_date', dataKey: 'update_date' },
    { header: 'portal_name', dataKey: 'portal_name' },
    { header: 'gst_charge', dataKey: 'gst_charge' },
    { header: 'Created At', dataKey: 'createdAt' },
    { header: 'Updated At', dataKey: 'updatedAt' },
  ];

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

  // Auto table options
  doc.autoTable({
    startY: 30, // Starting y position
    head: columns.map(col => col.header), // Table headers
    body: rows.map(row => columns.map(col => row[col.dataKey])), // Table data
    margin: { top: 30 }, // Top margin to align with title
    styles: {
      fontSize: 8,
      cellPadding: 3,
      overflow: 'linebreak',
      halign: 'left', // Horizontal alignment
      valign: 'middle', // Vertical alignment
    },
    headStyles: {
      fillColor: [52, 58, 64], // Dark gray background
      textColor: [255, 255, 255], // White text
      fontStyle: 'bold',
    },
    alternateRowStyles: {
      fillColor: [220, 220, 220], // Light gray alternating row background
    },
    columnStyles: {
      0: { cellWidth: 'auto' }, // Adjust column width automatically
      1: { cellWidth: 'auto' }, // Adjust column width automatically
    },
    didDrawPage: (data) => {
      // Add page number at the bottom
      const pageCount = doc.internal.getNumberOfPages();
      doc.setFontSize(10);
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

const OrangePayReport = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filterText, setFilterText] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('/reports'); 
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

 

  const handleSearch = () => {
    // Search logic is already implemented with the filter, just trigger re-render
    setFilterText(filterText);
  };

  const columns = [
    { name: 'ID', selector: '_id', sortable: true },
    { name: 'transaction_id', selector: 'transaction_id', sortable: true },
    { name: 'reference_number', selector: 'reference_number', sortable: true },
    { name: 'lower_level', selector: 'lower_level', sortable: true },
    { name: 'upper_level', selector: 'upper_level', sortable: true },
    { name: 'transaction_datetime', selector: 'transaction_datetime', sortable: true },
    { name: 'service_name', selector: 'service_name', sortable: true },
    { name: 'amount_before_due_date', selector: 'amount_before_due_date', sortable: true },
    { name: 'request_amount', selector: 'request_amount', sortable: true },
    { name: 'total_service_charge', selector: 'total_service_charge', sortable: true },
    { name: 'total_commission', selector: 'total_commission', sortable: true },
    { name: 'net_amount', selector: 'net_amount', sortable: true },
    { name: 'action_on_amount', selector: 'action_on_amount', sortable: true },
    { name: 'status', selector: 'status', sortable: true },
    { name: 'final_bal_amount', selector: 'final_bal_amount', sortable: true },
    { name: 'update_date', selector: 'update_date', sortable: true },
    { name: 'portal_name', selector: 'portal_name', sortable: true },
    { name: 'gst_charge', selector: 'gst_charge', sortable: true },
    { name: 'Created At', selector: 'createdAt', sortable: true },
    { name: 'Updated At', selector: 'updatedAt', sortable: true },
    
  ];

  const filteredItems = data.filter(item => 
    item.name && item.name.toLowerCase().includes(filterText.toLowerCase())
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

export default OrangePayReport;
