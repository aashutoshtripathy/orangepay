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
  const doc = new jsPDF({
    orientation: 'landscape', // Use landscape for better width fit
    unit: 'mm',
    format: 'a4'
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const title = "Fund Reports";
  const titleXPos = pageWidth / 2;

  doc.setFontSize(16);
  doc.text(title, titleXPos, 15, { align: 'center' });
  doc.setFontSize(10);
  doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 25);

  const columns = [
    { header: 'User ID', dataKey: 'userId' },
    { header: 'Transaction ID', dataKey: 'transactionId' },
    { header: 'Consumer Name', dataKey: 'consumerName' },
    { header: 'Consumer Number', dataKey: 'consumerNumber' },
    { header: 'Payment Mode', dataKey: 'paymentMode' },
    { header: 'Payment Status', dataKey: 'paymentStatus' },
    { header: 'Created On', dataKey: 'createdOn' }
  ];

  const rows = data.map(row => ({
    userId: row.userId,
    transactionId: row.transactionId,
    consumerName: row.consumerName,
    consumerNumber: row.consumerNumber,
    paymentMode: row.paymentMode,
    paymentStatus: row.paymentStatus,
    createdOn: row.createdOn
  }));

  doc.autoTable({
    startY: 30,
    head: [columns.map(col => col.header)],
    body: rows.map(row => columns.map(col => row[col.dataKey])),
    margin: { top: 30, bottom: 10 },
    styles: { fontSize: 8, cellPadding: 2, overflow: 'linebreak' },
    headStyles: { fillColor: [52, 58, 64], textColor: [255, 255, 255] },
    alternateRowStyles: { fillColor: [240, 240, 240] },
    columnStyles: { 0: { cellWidth: 30 }, 1: { cellWidth: 30 }, 2: { cellWidth: 30 }, 3: { cellWidth: 30 }, 4: { cellWidth: 30 }, 5: { cellWidth: 30 }, 6: { cellWidth: 30 } },
    didDrawPage: (data) => {
      const pageCount = doc.internal.getNumberOfPages();
      doc.setFontSize(8);
      doc.text(`Page ${pageCount}`, data.settings.margin.left, doc.internal.pageSize.getHeight() - 10);
    }
  });

  doc.save('fund_reports.pdf');
};






const downloadExcel = (data) => {
  const wb = XLSX.utils.book_new();
  const wsData = data.map(row => ({
    "User ID": row.userId,
    "Transaction ID": row.transactionId,
    "Consumer Name": row.consumerName,
    "Consumer Number": row.consumerNumber,
    "Payment Mode": row.paymentMode,
    "Payment Status": row.paymentStatus,
    "Created On": row.createdOn,
  }));

  const ws = XLSX.utils.json_to_sheet(wsData);

  ws['!cols'] = [
    { wch: 15 },  // User ID
    { wch: 20 },  // Transaction ID
    { wch: 20 },  // Consumer Name
    { wch: 20 },  // Consumer Number
    { wch: 15 },  // Payment Mode
    { wch: 15 },  // Payment Status
    { wch: 20 }   // Created On
  ];

  XLSX.utils.book_append_sheet(wb, ws, "Fund Reports");

  const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'binary' });
  const blob = new Blob([s2ab(wbout)], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'fund_reports.xlsx';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
};

function s2ab(s) {
  const buf = new ArrayBuffer(s.length);
  const view = new Uint8Array(buf);
  for (let i = 0; i < s.length; i++) view[i] = s.charCodeAt(i) & 0xFF;
  return buf;
}


const DataTableComponent = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [filterText, setFilterText] = useState('');
  const userId = localStorage.getItem('userId');
  const username = localStorage.getItem('username');


  const navigate = useNavigate();





  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`/cancellationHistoryy`);
        const result = response.data.data || []; // Ensure to get data array
        setData(result); // Set the fetched data
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    };
  
    fetchData();
  }, [username]);
  



  const handleViewDetails = (row) => {
    // Logic to view details (redirect, modal, etc.)
    console.log('Viewing details for:', row);
    navigate(`/cancellation-details`,{ state: { row } })
    // Example: history.push(`/details/${row.transactionId}`);
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
    { name: 'transactionId', selector: 'transactionId', sortable: true },
    { name: 'consumerName', selector: 'consumerName', sortable: true },
    { name: 'consumerNumber', selector: 'consumerNumber', sortable: true },
    { name: 'billpostonpaymentMode', selector: 'paymentMode', sortable: true },
    { name: 'paymentStatus', selector: 'paymentStatus', sortable: true },
    
    { name: 'createdOn', selector: 'createdOn', sortable: true }, 
    {
        name: 'Actions',
        cell: row => (
          <button 
            onClick={() => handleViewDetails(row)}
            style={{ padding: '8px 12px', backgroundColor: '#6362e1', color: 'white', border: 'none', borderRadius: '4px' }}
          >
            View Details
          </button>
        ),
      },
  ];

  const filteredItems = data.filter(item => 
    item.transactionId.toLowerCase().includes(filterText.toLowerCase()) || // Example filter by transactionId
    item.consumerName.toLowerCase().includes(filterText.toLowerCase()) // Example filter by consumerName
  );
  


  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <div className="cspinner"></div>
      </div>
    );
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
        title={<h2 style={{ fontSize: '24px', color: '#f36c23', fontFamily: 'sans-serif', fontWeight: '800', textAlign: 'center', }}>Cancellation Requests</h2>}
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
