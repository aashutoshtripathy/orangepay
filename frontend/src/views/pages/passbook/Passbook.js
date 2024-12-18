import React, { useEffect, useState } from 'react';
import DataTable from 'react-data-table-component';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle, faTimesCircle, faDownload, faFileExcel, faSearch } from '@fortawesome/free-solid-svg-icons';
import { CCard, CCardBody, CCardHeader, CCol, CRow, CCardTitle, CCardText } from '@coreui/react';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from 'xlsx'; // Import XLSX for Excel export
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



const formatDate = (dateString) => {
  const options = { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit' };
  return new Date(dateString).toLocaleDateString('en-US', options);
};

// Function to limit the amount to two decimal places
const formatAmount = (amount) => {
  return parseFloat(amount).toFixed(2);
};


// Function to generate and download PDF
const downloadPDF = (data) => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();

  const title = "Passbook Transactions";
  const titleXPos = pageWidth / 2;

  doc.setFontSize(18);
  doc.text(title, titleXPos, 15, { align: 'center' });

  doc.setFontSize(10);
  doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 25);

  const columns = [
    { header: 'Date/Time', dataKey: 'date' },
    { header: 'Service', dataKey: 'description' },
    { header: 'Type', dataKey: 'type' },
    { header: 'Transaction ID', dataKey: 'transactionId' },
    { header: 'Opening Balance', dataKey: 'openingBalance' },
    { header: 'Requested Amount', dataKey: 'amount' },
    { header: 'Commission Earned', dataKey: 'commission' },
    { header: 'Final Balance', dataKey: 'closingBalance' },
  ];

  // Prepare the rows with formatted data
  const rows = data.map(row => ({
    date: formatDate(row.date),
    description: row.description,
    type: row.type,
    transactionId: row.transactionId,
    openingBalance: formatAmount(row.openingBalance),
    amount: formatAmount(row.amount),
    commission: formatAmount(row.commission),
    closingBalance: formatAmount(row.closingBalance),
  }));

  // Use autoTable with customized styling
  doc.autoTable({
    startY: 30,
    head: [columns.map(col => col.header)],
    body: rows.map(row => Object.values(row)),
    styles: {
      fontSize: 8,
      cellPadding: 3,
      halign: 'center',
    },
    headStyles: {
      fillColor: [52, 58, 64],
      textColor: [255, 255, 255],
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

  doc.save('passbook_transactions.pdf');
};


// Function to generate and download Excel
const downloadExcel = (data) => {
  // Prepare data for Excel with headers
  const worksheetData = [
    [
      'Date/Time', 'Service', 'Type', 'Transaction ID', 
      'Opening Balance', 'Requested Amount', 
      'Commission Earned', 'Final Balance'
    ],
    ...data.map(row => [
      formatDate(row.date),
      row.description,
      row.type,
      row.transactionId,
      formatAmount(row.openingBalance),
      formatAmount(row.amount),
      formatAmount(row.commission),
      formatAmount(row.closingBalance),
    ])
  ];

  const ws = XLSX.utils.aoa_to_sheet(worksheetData);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Passbook Transactions");

  // Adjust column width for better readability
  const columnWidths = [
    { wch: 20 }, { wch: 20 }, { wch: 10 }, { wch: 20 },
    { wch: 15 }, { wch: 15 }, { wch: 15 }, { wch: 15 }
  ];
  ws['!cols'] = columnWidths;

  XLSX.writeFile(wb, 'passbook_transactions.xlsx');
};




const Passbook = ({userId}) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [filterText, setFilterText] = useState('');
  const [transactions, setTransactions] = useState([]);

// const userId = localStorage.getItem('userId');



  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`/api/v1/users/getPayment/${userId}`);
        const result = response.data.balance
          ? response.data.balance.flatMap(balance => balance.transactions).reverse() // Merge and reverse transactions
          : [];
        setTransactions(result);
        setData(result); // Assuming you use `data` elsewhere for filtered results
      } catch (error) {
        console.error('Error fetching data:', error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };
  
    fetchData();
  }, [userId]);
  





  


  const filteredItems = data.filter(item => {
    const isTextMatch = Object.values(item).some(val =>
      val && val.toString().toLowerCase().includes(filterText.toLowerCase())
    );

    // Ensure transactionDateTime is a valid date before filtering
    const transactionDate = new Date(item.createdon);
    const isDateMatch = (!fromDate || transactionDate >= new Date(fromDate)) &&
      (!toDate || transactionDate <= new Date(toDate));

    return isTextMatch && isDateMatch;
  });



  const handleClearDates = () => {
    setFromDate(''); // Clear fromDate
    setToDate('');   // Clear toDate
  };




  const totalPaidAmount = filteredItems.reduce((total, item) => total + (parseFloat(item.billamount) || 0), 0);
  const totalCommission = filteredItems.reduce((total, item) => total + (parseFloat(item.totalCommission) || 0), 0);

  // Calculate the overall commission, TDS, and net commission
  const overallCommission = totalPaidAmount * 0.01;
  const overallTDS = overallCommission * 0.05;
  const overallNetCommission = overallCommission - overallTDS;

  const columns = [

    { name: 'Date/Time', selector:  row => formatDate(row.date), sortable: true },
    { name: 'Service', selector: 'description', sortable: true },
    { name: 'Type', selector: 'type', sortable: true },
    { name: 'TransactionId', selector: 'transactionId', sortable: true },
    { name: 'Opening Balance', selector:  row => formatAmount(row.openingBalance), sortable: true },
    { name: 'Requested Amount', selector: row => formatAmount(row.amount), sortable: true },
    { name: 'Commission Earned',  selector: row => (parseFloat(row.commission) || 0).toFixed(2), sortable: true },
    { name: 'Final Balance', selector: row => formatAmount(row.closingBalance), sortable: true },
  ]



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
          placeholder="Search by TransactionID..."
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
          title={<h2 style={{ fontSize: '24px', color: '#f36c23', fontFamily: 'sans-serif', fontWeight: '800', textAlign: 'center', }}>Passbook</h2>}
          columns={columns}
          data={filteredItems}
          pagination
          highlightOnHover
          // progressPending={loading}
          customStyles={customStyles}
        />




      </div>

    </div>
  );
};

export default Passbook;

