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
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  const title = "Fund Reports";
  const pageWidth = doc.internal.pageSize.getWidth();
  doc.setFontSize(16);
  doc.text(title, pageWidth / 2, 15, { align: 'center' });
  doc.setFontSize(10);
  doc.text("Generated on: " + new Date().toLocaleDateString(), 14, 25);

  // Define table columns and rows with formatted dates
  const columns = [
    { header: 'User ID', dataKey: 'userId' },
    { header: 'Fund Amount', dataKey: 'fundAmount' },
    { header: 'Bank Reference', dataKey: 'bankReference' },
    { header: 'Payment Method', dataKey: 'paymentMethod' },
    { header: 'Bank Name', dataKey: 'bankName' },
    { header: 'Date of Payment', dataKey: 'datePayment' },
    { header: 'Status', dataKey: 'status' },
    { header: 'Created At', dataKey: 'createdAt' },
    { header: 'Updated At', dataKey: 'updatedAt' },
  ];

  const rows = data.map(row => ({
    userId: row.uniqueId,
    fundAmount: row.fundAmount,
    bankReference: row.bankReference,
    paymentMethod: row.paymentMethod,
    bankName: row.bankName,
    datePayment: new Date(row.datePayment).toLocaleDateString(),
    status: row.status,
    createdAt: new Date(row.createdAt).toLocaleDateString(),
    updatedAt: new Date(row.updatedAt).toLocaleDateString(),
  }));

  doc.autoTable({
    startY: 30,
    head: [columns.map(col => col.header)],
    body: rows.map(row => columns.map(col => row[col.dataKey])),
    styles: {
      fontSize: 8,
      cellPadding: 2,
    },
    headStyles: {
      fillColor: [52, 58, 64],
      textColor: [255, 255, 255],
      fontStyle: 'bold',
    },
    columnStyles: {
      0: { cellWidth: 20 },
      1: { cellWidth: 20 },
      2: { cellWidth: 30 },
      3: { cellWidth: 30 },
      4: { cellWidth: 30 },
      5: { cellWidth: 20 },
      6: { cellWidth: 20 },
      7: { cellWidth: 25 },
      8: { cellWidth: 25 },
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

  const wsData = data.map(row => ({
    "User ID": row.uniqueId,
    "Fund Amount": row.fundAmount,
    "Bank Reference": row.bankReference,
    "Payment Method": row.paymentMethod,
    "Bank Name": row.bankName,
    "Date of Payment": new Date(row.datePayment).toLocaleDateString(),
    "Status": row.status,
    "Created At": new Date(row.createdAt).toLocaleDateString(),
    "Updated At": new Date(row.updatedAt).toLocaleDateString(),
  }));

  const ws = XLSX.utils.json_to_sheet(wsData);

  // Define column widths
  const columnWidths = [
    { wch: 15 },
    { wch: 12 },
    { wch: 25 },
    { wch: 20 },
    { wch: 20 },
    { wch: 15 },
    { wch: 10 },
    { wch: 20 },
    { wch: 20 },
  ];

  ws['!cols'] = columnWidths;

  XLSX.utils.book_append_sheet(wb, ws, "Fund Reports");
  XLSX.writeFile(wb, 'fund_reports.xlsx');
};


const DataTableComponent = ({userId}) => {
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
        const response = await axios.get(`/fund-request/${userId}`); 
        console.log(userId)
        const result = response.data.fundRequest ? response.data.fundRequest.reverse() : []; 
        setData(result);
      } catch (error) {
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


 

  const handleSearch = () => {
    setFilterText(filterText);
  };

  const columns = [
    { name: 'userId', selector: 'uniqueId', sortable: true },
    { name: 'fundAmount', selector: 'fundAmount', sortable: true },
    { name: 'bankReference', selector: 'bankReference', sortable: true },
    { name: 'paymentMethod', selector: 'paymentMethod', sortable: true },
    { name: 'bankName', selector: 'bankName', sortable: true },
    { name: 'Date of Payment', selector: 'datePayment', sortable: true }, 
    { name: 'status', selector: 'status', sortable: true },
    { name: 'createdAt', selector: 'createdAt', sortable: true },
    { name: 'updatedAt', selector: 'updatedAt', sortable: true },
   
  ];

  const filteredItems = data.filter(item => 
    item.status && item.status.toLowerCase().includes(filterText.toLowerCase())
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
          title={<h2 style={{ fontSize: '24px', color: '#f36c23', fontFamily: 'sans-serif', fontWeight: '800', textAlign: 'center', }}>Fund Reports</h2>}
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
