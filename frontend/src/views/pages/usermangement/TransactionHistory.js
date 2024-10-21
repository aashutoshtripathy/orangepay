import React, { useEffect, useState } from 'react';
import DataTable from 'react-data-table-component';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle, faTimesCircle, faDownload, faFileExcel, faSearch } from '@fortawesome/free-solid-svg-icons';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from 'xlsx'; // Import XLSX for Excel export
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

// Function to generate and download PDF
const downloadPDF = (data) => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const title = "Table Data";
  const titleXPos = pageWidth / 2;

  doc.setFontSize(18);
  doc.text(title, titleXPos, 15, { align: 'center' });

  doc.setFontSize(10);
  doc.text("Generated on: " + new Date().toLocaleDateString(), 14, 25);

  const columns = [
    { header: 'ID', dataKey: '_id' },
    { header: 'Transaction ID', dataKey: 'transactionId' },
    { header: 'Reference Number', dataKey: 'referenceNumber' },
    { header: 'Transaction DateTime', dataKey: 'transactionDateTime' },
    { header: 'Service Name', dataKey: 'serviceName' },
    { header: 'Consumer ID', dataKey: 'consumerId' },
    { header: 'Meter ID', dataKey: 'meterId' },
    { header: 'Request Amount', dataKey: 'requestAmount' },
    { header: 'Total Service Charge', dataKey: 'totalServiceCharge' },
    { header: 'Total Commission', dataKey: 'totalCommission' },
    { header: 'Net Amount', dataKey: 'netAmount' },
    { header: 'Action On Amount', dataKey: 'actionOnAmount' },
    { header: 'Status', dataKey: 'status' },
    { header: 'Payment Method', dataKey: 'paymentMethod' },
    { header: 'Payment Date', dataKey: 'paymentDate' },
  ];

  const rows = data.map(row => columns.map(col => row[col.dataKey]));

  doc.autoTable({
    startY: 30,
    head: [columns.map(col => col.header)],
    body: rows,
    styles: {
      fontSize: 8,
      cellPadding: 3,
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
      0: { cellWidth: 'auto' },
    },
    didDrawPage: (data) => {
      const pageCount = doc.internal.getNumberOfPages();
      doc.setFontSize(10);
      doc.text(`Page ${pageCount}`, data.settings.margin.left, doc.internal.pageSize.getHeight() - 10);
    }
  });

  doc.save('table_data.pdf');
};

// Function to generate and download Excel
const downloadExcel = (data) => {
  const ws = XLSX.utils.json_to_sheet(data);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Table Data");
  XLSX.writeFile(wb, 'table_data.xlsx');
};

const OrangePayReport = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [filterText, setFilterText] = useState('');
  const userId = localStorage.getItem('userId');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`/getpaymentss/${userId}`);
        const balanceData = Array.isArray(response.data.balance) ? response.data.balance : [];

        const sortedData = balanceData.sort((a, b) => {
          return new Date(a.createdon) - new Date(b.createdon);
        });
    
        // Reverse the sorted data to get it in descending order
        const reversedData = sortedData.reverse();
    
        setData(reversedData);
      } catch (error) {
        console.error('Fetch error:', error);
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [userId]);
  
  
  const handleClearDates = () => {
    setFromDate(''); // Clear fromDate
    setToDate('');   // Clear toDate
  };

  // Filtering and rendering the data table...
  const filteredItems = data.filter(item =>
    Object.values(item).some(val =>
      val && val.toString().toLowerCase().includes(filterText.toLowerCase())
    )
  );

  const columns = [
    { name: 'Transaction ID', selector: row => row.transactionId, sortable: true },
    { name: 'CANumber', selector: row => row.canumber, sortable: true },
    { name: 'Paid Amount', selector: row => row.paidamount, sortable: true },
    { name: 'Commission', selector: row => row.commission, sortable: true },
    { name: 'TDS', selector: row => row.tds, sortable: true },
    { name: 'Net Commission', selector: row => row.netCommission, sortable: true },
    { name: 'Payment Date', selector: row => row.paymentdate, sortable: true },
  ];

  const rows = data.map(row => columns.map(col => row[col.dataKey]));

  

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      <div className="button-container">
        <input
          type="text"
          placeholder="Search by CANumber..."
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
          title={<h2 style={{ fontSize: '24px', color: '#f36c23', fontFamily: 'sans-serif', fontWeight: '800', textAlign: 'center', }}>Commission History</h2>}
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

export default OrangePayReport;
