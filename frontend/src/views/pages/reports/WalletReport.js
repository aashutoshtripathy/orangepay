import React, { useEffect, useState } from 'react';
import DataTable from 'react-data-table-component';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDownload, faFileExcel } from '@fortawesome/free-solid-svg-icons';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from 'xlsx';
import '../../../scss/dataTable.scss';

// Define custom styles for the table
const customStyles = {
  rows: {
    style: {
      minHeight: '72px',
    },
  },
  headCells: {
    style: {
      color: 'black',
      fontSize: '16px',
      fontWeight: 'bold',
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
    { header: 'Date', dataKey: 'date' },
    { header: 'Opening Balance', dataKey: 'openingBalance' },
    { header: 'Closing Balance', dataKey: 'closingBalance' },
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

const WalletReport = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [filterText, setFilterText] = useState('');
  const userId = localStorage.getItem('userId');
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`/walletreport/${userId}`);
        const result = response.data.balance || [];
         const sortedData = result.sort((a, b) => new Date(b.date) - new Date(a.date));

      setData(sortedData);
      } catch (error) {
        console.error('Error fetching data:', error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [userId]);

  

  // const formatDate = (dateString) => {
  //   const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
  //   return new Date(dateString).toLocaleDateString('en-US', options);
  // };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      // Handle cases where the dateString is invalid
      console.warn(`Invalid date encountered: ${dateString}`);
      return 'Invalid Date'; // Fallback to a default or message if needed
    }
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    });
  };
  

  const formatAmount = (amount) => {
    return parseFloat(amount).toFixed(2);
  };


  console.log(transactions)


  
  
  
  // Convert grouped transactions to an array
 
  
  
  

  // Convert grouped transactions to an array
  

  // Filter by date range and text
  const filteredItems = data.filter(item => {
    const transactionDate = new Date(item.date);
    const isDateMatch = (!fromDate || transactionDate >= new Date(fromDate)) &&
      (!toDate || transactionDate <= new Date(toDate));
    const isTextMatch = item.date.includes(filterText.toLowerCase());
    return isTextMatch && isDateMatch;
  });
  

  const handleClearDates = () => {
    setFromDate('');
    setToDate('');
  };

 
  const columns = [
    {
      name: 'Date',
      selector: row => formatDate(row.date),
      sortable: true,
    },
    {
      name: 'Opening Balance',
      selector: row => formatAmount(row.openingBalance),
      sortable: true,
    },
    {
      name: 'Closing Balance',
      selector: row => formatAmount(row.closingBalance),
      sortable: true,
    },
  ];
  

  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      <div className="button-container">
        <input
          type="text"
          placeholder="Search by date..."
          value={filterText}
          onChange={(e) => setFilterText(e.target.value)}
        />
        <button
          className="button-download"
          onClick={() => downloadPDF(filteredItems)}
        >
          <FontAwesomeIcon icon={faDownload} /> Download PDF
        </button>
        <button
          className="button-download-excel"
          onClick={() => downloadExcel(filteredItems)}
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
          title={<h2 style={{ fontSize: '24px', color: '#f36c23', fontFamily: 'sans-serif', fontWeight: '800', textAlign: 'center' }}>Wallet Report</h2>}
          columns={columns}
          data={filteredItems}
          pagination
          highlightOnHover
          progressPending={loading}
          customStyles={customStyles}
        />
      </div>
    </div>
  );
};

export default WalletReport;
