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
  const pageHeight = doc.internal.pageSize.getHeight();
  const title = "Table Data";
  const titleXPos = pageWidth / 2;

  doc.setFontSize(14); // Reduced font size for title
  doc.text(title, titleXPos, 15, { align: 'center' });

  doc.setFontSize(8); // Smaller font size for date
  doc.text("Generated on: " + new Date().toLocaleDateString(), 14, 20);

  // Define the columns and their widths
  const columns = [
    { header: 'User ID', dataKey: 'userId' },
    { header: 'Fund Amount', dataKey: 'fundAmount' },
    { header: 'Bank Reference', dataKey: 'bankReference' },
    { header: 'Payment Method', dataKey: 'paymentMethod' },
    { header: 'Bank Name', dataKey: 'bankName' },
    { header: 'Status', dataKey: 'status' },
    { header: 'Created At', dataKey: 'createdAt' },
    { header: 'Updated At', dataKey: 'updatedAt' }
  ];

  // Prepare the data for autoTable
  const rows = data.map(row => ({
    userId: row.uniqueId,
    fundAmount: row.fundAmount,
    bankReference: row.bankReference,
    paymentMethod: row.paymentMethod,
    bankName: row.bankName,
    status: row.status,
    createdAt: new Date(row.createdAt).toLocaleDateString(),
    updatedAt: new Date(row.updatedAt).toLocaleDateString()
  }));

  // Auto table options with adjustments
  doc.autoTable({
    startY: 25, // Start position below the title and date
    head: [columns.map(col => col.header)],
    body: rows.map(row => Object.values(row)),
    margin: { top: 25, bottom: 10, left: 10, right: 10 }, // Reduced margins
    styles: {
      fontSize: 7, // Smaller font size for table
      cellPadding: 1, // Reduced padding
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
      fillColor: [240, 240, 240],
    },
    columnStyles: {
      // Dynamically calculate widths or assign percentages
      userId: { cellWidth: 15 },
      fundAmount: { cellWidth: 20 },
      bankReference: { cellWidth: 25 },
      paymentMethod: { cellWidth: 25 },
      bankName: { cellWidth: 30 },
      status: { cellWidth: 15 },
      createdAt: { cellWidth: 20 },
      updatedAt: { cellWidth: 20 }
    },
    didDrawPage: (data) => {
      const pageCount = doc.internal.getNumberOfPages();
      doc.setFontSize(8);
      doc.text(`Page ${pageCount}`, data.settings.margin.left, pageHeight - 5); // Smaller font size for footer
    }
  });

  // Download the PDF
  doc.save('table_data.pdf');
};



// Function to generate and download Excel
const downloadExcel = (data) => {
  // Convert JSON data to sheet
  const ws = XLSX.utils.json_to_sheet(data);

  // Define column widths to fit data within a single page
  const columnWidths = [
    { wch: 15 },  // User ID
    { wch: 12 },  // Fund Amount
    { wch: 25 },  // Bank Reference
    { wch: 20 },  // Payment Method
    { wch: 20 },  // Bank Name
    { wch: 10 },  // Status
    { wch: 20 },  // Created At
    { wch: 20 }   // Updated At
  ];
  ws['!cols'] = columnWidths; // Apply column widths to the sheet

  // Create a new workbook
  const wb = XLSX.utils.book_new();

  // Append sheet to workbook
  XLSX.utils.book_append_sheet(wb, ws, "Table Data");

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
  a.download = 'table_data.xlsx';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
};



const DataTableComponent = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filterText, setFilterText] = useState('');
  const userIdd = localStorage.getItem('userId');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`/fundrequests`); 
        const result = response.data.fundRequests || []; // Access the data array from the nested data object
        setData(result);
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [userIdd]);




  const handleSearch = () => {
    // Search logic is already implemented with the filter, just trigger re-render
    setFilterText(filterText);
  };

  const columns = [
    { name: 'userId', selector: 'uniqueId', sortable: true },
    { name: 'fundAmount', selector: 'fundAmount', sortable: true },
    { name: 'bankReference', selector: 'bankReference', sortable: true },
    { name: 'paymentMethod', selector: 'paymentMethod', sortable: true },
    { name: 'bankName', selector: 'bankName', sortable: true },
    { name: 'status', selector: 'status', sortable: true },
    { name: 'createdAt', selector: 'createdAt', sortable: true },
    { name: 'updatedAt', selector: 'updatedAt', sortable: true },
  ];

  const filteredItems = data.filter(
    (item) => item.status === 'approved' && item.userId && item.userId.toLowerCase().includes(filterText.toLowerCase())
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
