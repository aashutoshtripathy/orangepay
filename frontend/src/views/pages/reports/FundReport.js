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
      minHeight: '40px', // Set the minimum row height
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
  const doc = new jsPDF({
    orientation: 'p', // Portrait mode
    unit: 'mm',
    format: 'a4' // A4 paper size
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const title = "Fund Reports";
  const titleXPos = pageWidth / 2;

  doc.setFontSize(16);
  doc.text(title, titleXPos, 15, { align: 'center' });

  doc.setFontSize(10);
  doc.text("Generated on: " + new Date().toLocaleString(), 14, 25);

  const columns = [
    { header: 'User ID', dataKey: 'userId' },
    { header: 'Fund Amount', dataKey: 'fundAmount' },
    { header: 'Bank Reference', dataKey: 'bankReference' },
    { header: 'Payment Method', dataKey: 'paymentMethod' },
    { header: 'Bank Name', dataKey: 'bankName' },
    { header: 'Status', dataKey: 'status' },
    { header: 'Created At', dataKey: 'createdAt' },
    { header: 'Updated At', dataKey: 'updatedAt' },
  ];

  const formatDate = (date) => {
    return new Date(date).toLocaleString(); // Format to include date and time
  };

  const rows = data.map(row => ({
    userId: row.uniqueId,
    fundAmount: row.fundAmount,
    bankReference: row.bankReference,
    paymentMethod: row.paymentMethod,
    bankName: row.bankName,
    status: row.status,
    createdAt: formatDate(row.createdAt),
    updatedAt: formatDate(row.updatedAt),
  }));

  doc.autoTable({
    startY: 30,
    head: [columns.map(col => col.header)], // Table headers
    body: rows.map(row => columns.map(col => row[col.dataKey])), // Table data
    margin: { top: 30, bottom: 10 },
    styles: {
      fontSize: 7,
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
      0: { cellWidth: 20 },
      1: { cellWidth: 20 },
      2: { cellWidth: 25 },
      3: { cellWidth: 30 },
      4: { cellWidth: 30 },
      5: { cellWidth: 20 },
      6: { cellWidth: 25 },
      7: { cellWidth: 25 },
    },
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

  const headers = [
    "User ID",
    "Fund Amount",
    "Bank Reference",
    "Payment Method",
    "Bank Name",
    "Status",
    "Created At",
    "Updated At"
  ];

  const formatDate = (date) => {
    return new Date(date).toLocaleString();
  };

  const wsData = data.map(row => ({
    "User ID": row.uniqueId,
    "Fund Amount": row.fundAmount,
    "Bank Reference": row.bankReference,
    "Payment Method": row.paymentMethod,
    "Bank Name": row.bankName,
    "Status": row.status,
    "Created At": formatDate(row.createdAt),
    "Updated At": formatDate(row.updatedAt),
  }));

  const ws = XLSX.utils.json_to_sheet(wsData, { header: headers });

  const columnWidths = [
    { wch: 15 },
    { wch: 12 },
    { wch: 25 },
    { wch: 20 },
    { wch: 20 },
    { wch: 10 },
    { wch: 25 }, // Widen for date-time display
    { wch: 25 }
  ];

  ws['!cols'] = columnWidths;

  XLSX.utils.book_append_sheet(wb, ws, "Fund Reports");

  const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'binary' });

  function s2ab(s) {
    const buf = new ArrayBuffer(s.length);
    const view = new Uint8Array(buf);
    for (let i = 0; i < s.length; i++) view[i] = s.charCodeAt(i) & 0xFF;
    return buf;
  }

  const blob = new Blob([s2ab(wbout)], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'fund_reports.xlsx';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
};



const FundReport = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [filterText, setFilterText] = useState('');
  const userIdd = localStorage.getItem('userId');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`/api/v1/users/fundrequests`); 
        const result = response.data.fundRequests || []; // Access the data array from the nested data object
        setData(result.reverse());
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [userIdd]);


  
  const handleClearDates = () => {
    setFromDate(''); // Clear fromDate
    setToDate('');   // Clear toDate
  };


  const handleSearch = (event) => {
    setFilterText(event.target.value); // Update filter text on input change
  };

  const filterByDate = (item) => {
    const itemDate = new Date(item.createdAt); // Use 'createdAt' field for filtering
    const start = fromDate ? new Date(fromDate) : null;
    const end = toDate ? new Date(toDate) : null;

    if (start && end) {
      return itemDate >= start && itemDate <= end;
    } else if (start) {
      return itemDate >= start;
    } else if (end) {
      return itemDate <= end;
    }
    return true; // No date filter applied
  };

  const columns = [
    { name: 'userId', selector: 'uniqueId', sortable: true },
    { name: 'fundAmount', selector: 'fundAmount', sortable: true },
    { name: 'bankReference', selector: 'bankReference', sortable: true },
    { name: 'paymentMethod', selector: 'paymentMethod', sortable: true },
    { name: 'bankName', selector: 'bankName', sortable: true },
    { name: 'Transaction Id', selector: 'txnId' },
    { name: 'Date of Payment', selector: 'datePayment', sortable: true }, 
    { name: 'status', selector: 'status', sortable: true },
    { name: 'createdAt', selector: 'createdAt', sortable: true },
    { name: 'updatedAt', selector: 'updatedAt', sortable: true },
  ];

  const filteredItems = data.filter((item) => {
    return (
      item.uniqueId && item.uniqueId.toLowerCase().includes(filterText.toLowerCase()) &&
      filterByDate(item) // Apply date filter
    );
  });

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
          title={<h2 style={{ fontSize: '24px', color: '#f36c23', fontFamily: 'sans-serif', fontWeight: '800', textAlign: 'center', }}>Fund Reports</h2>}
          columns={columns}
        data={filteredItems} // Use filtered items for the table data
        pagination
        highlightOnHover
        customStyles={customStyles}
      />
    </div>
    </div>
  );
};

export default FundReport;
