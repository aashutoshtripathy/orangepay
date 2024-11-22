import React, { useEffect, useState } from 'react';
import DataTable from 'react-data-table-component';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {  faDownload, faFileExcel } from '@fortawesome/free-solid-svg-icons';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from 'xlsx'; // Import XLSX for Excel export
import '../../../scss/dataTable.scss';
import TransactionHistoryyyy from './TransactionHistoryyyy';

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

const formatAmount = (amount) => Number(amount).toFixed(2);
const formatDate = (dateStr) => new Date(dateStr).toLocaleString();

const downloadPDF = (data) => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const title = "Transaction History";
  const titleXPos = pageWidth / 2;

  doc.setFontSize(18);
  doc.text(title, titleXPos, 15, { align: 'center' });

  doc.setFontSize(10);
  doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 25);

  // Define columns and format data with fixed decimal places for money and formatted dates
  const columns = [
    { header: 'Transaction ID', dataKey: 'transactionId' },
    { header: 'CANumber', dataKey: 'canumber' },
    { header: 'Paid Amount', dataKey: 'paidamount' },
    { header: 'Commission', dataKey: 'commission' },
    { header: 'TDS', dataKey: 'tds' },
    { header: 'Net Commission', dataKey: 'netCommission' },
    { header: 'Payment Date', dataKey: 'paymentdate' },
  ];

  const rows = data.map(row => {
    return {
      transactionId: row.transactionId || 'N/A',
      canumber: row.canumber || 'N/A',
      paidamount: row.paidamount ? parseFloat(row.paidamount).toFixed(2) : '0.00',
      commission: row.commission ? parseFloat(row.commission).toFixed(2) : '0.00',
      tds: row.tds ? parseFloat(row.tds).toFixed(2) : '0.00',
      netCommission: row.netCommission ? parseFloat(row.netCommission).toFixed(2) : '0.00',
      paymentdate: row.paymentdate ? new Date(row.paymentdate).toLocaleString() : 'N/A',
    };
  });

  doc.autoTable({
    startY: 30,
    head: [columns.map(col => col.header)],
    body: rows.map(row => Object.values(row)),
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
  });

  doc.save('transaction_history.pdf');
};

const downloadExcel = (data) => {
  const formattedData = data.map(row => ({
    'Transaction ID': row.transactionId,
    'CANumber': row.canumber,
    'Paid Amount': formatAmount(row.paidamount),
    'Commission': formatAmount(row.commission),
    'TDS': formatAmount(row.tds),
    'Net Commission': formatAmount(row.netCommission),
    'Payment Date': formatDate(row.paymentdate),
  }));

  const ws = XLSX.utils.json_to_sheet(formattedData);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Commission History");
  XLSX.writeFile(wb, 'commission_history.xlsx');
};


const TransactionHistory = ({userId}) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [filterText, setFilterText] = useState('');
  // const userId = localStorage.getItem('userId');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`/api/v1/users/getpaymentss/${userId}`);
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
    { name: 'Paid Amount', selector: row => formatAmount(row.paidamount), sortable: true },
    { name: 'Commission', selector: row => formatAmount(row.commission), sortable: true },
    { name: 'TDS', selector: row => formatAmount(row.tds), sortable: true },
    { name: 'Net Commission', selector: row => formatAmount(row.netCommission), sortable: true },
    { name: 'Payment Date', selector: row => formatDate(row.paymentdate), sortable: true },
  ];

  const rows = data.map(row => columns.map(col => row[col.dataKey]));

  

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <div className="cspinner"></div>
      </div>
    );
  }
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

export default TransactionHistory;
