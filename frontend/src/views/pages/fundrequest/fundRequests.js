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
      cursor: 'pointer', // Add pointer cursor for rows
    },
  },
  headCells: {
    style: {
      backgroundColor: '#f4f4f9', // Light background for header cells
      color: '#333', // Set font color to dark for header cells
      fontSize: '16px', // Adjust font size for header
      fontWeight: 'bold', // Make the header bold
      paddingLeft: '12px',
      paddingRight: '12px',
      borderBottom: '2px solid #e1e1e1', // Add a bottom border for header cells
    },
  },
  cells: {
    style: {
      paddingLeft: '12px',
      paddingRight: '12px',
    },
  },
};


// Function to generate and download PDF
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

  // Define all columns with their headers and data keys
  const columns = [
    { header: 'User ID', dataKey: 'uniqueId' },
    { header: 'Fund Amount', dataKey: 'fundAmount' },
    { header: 'Payment Method', dataKey: 'paymentMethod' },
    { header: 'Bank Name', dataKey: 'bankName' },
    // Add more columns here as needed
  ];

  // Prepare rows for PDF based on all columns
  const rows = data.map(row => {
    const formattedRow = {};
    columns.forEach(col => {
      formattedRow[col.dataKey] = row[col.dataKey];
    });
    return formattedRow;
  });

  // Use autoTable for PDF generation
  doc.autoTable({
    startY: 30,
    head: [columns.map(col => col.header)],
    body: rows.map(row => columns.map(col => row[col.dataKey])),
    margin: { top: 30 },
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

  doc.save('table_data.pdf');
};

// Function to generate and download Excel
// Function to generate and download Excel
const downloadExcel = (data) => {
  // Select and structure data
  const formattedData = data.map(row => ({
    'User ID': row.uniqueId,
    'Fund Amount': row.fundAmount,
    'Payment Method': row.paymentMethod,
    'Bank Name': row.bankName,
    'Date': new Date(row.createdAt).toLocaleDateString(),
  }));

  // Convert JSON data to worksheet
  const ws = XLSX.utils.json_to_sheet(formattedData);

  // Create a new workbook and append the worksheet
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Fund Requests");

  // Write and download Excel file
  XLSX.writeFile(wb, 'FundRequestsReport.xlsx');
};



const initialColumnsVisibility = {
  userId: true,
  fundAmount: true,
  paymentMethod: true,
  bankName: true,
};

const DataTableComponent = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [filterText, setFilterText] = useState('');
  const userId = localStorage.getItem('userId');
  const navigate = useNavigate();
  const [columnsVisibility, setColumnsVisibility] = useState(initialColumnsVisibility);



  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`/fundrequests`);
        const result = response.data.fundRequests || []; // Access the data array from the nested data object
        setData(result.reverse());
        } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [userId]);

  const handleColumnVisibilityChange = (column) => {
    setColumnsVisibility(prevState => ({
      ...prevState,
      [column]: !prevState[column]
    }));
  };



  const handleFetch = async (row) => {
    try {
      const response = await axios.get(`/fundrequests/${row._id}`);

      if (response.status === 200) {  // Check if the response is successful
        setData((prevData) =>
          prevData.filter((item) => item._id !== row._id)
        );
        navigate(`/fund-details/${row._id}`);
      }
    } catch (error) {
      console.error("Error approving fund request", error);
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
    columnsVisibility.userId && { name: 'User ID', selector: 'uniqueId', sortable: true },
    columnsVisibility.fundAmount && { name: 'Fund Amount', selector: 'fundAmount', sortable: true },
    columnsVisibility.paymentMethod && { name: 'Payment Method', selector: 'paymentMethod', sortable: true },
    columnsVisibility.bankName && { name: 'Bank Name', selector: 'bankName', sortable: true },
    {
      name: 'Actions',
      cell: (row) => (
        <div className="actions-cell">
          <button
            className="button-search"
            onClick={() => handleFetch(row)}
          >
            <FontAwesomeIcon icon={faCheckCircle} /> View Details
          </button>
        </div>
      ),
    },
  ].filter(Boolean); // Remove undefined columns


  const filteredItems = data.filter(
    (item) =>
      item.status === 'pending' &&
      (item.uniqueId && item.uniqueId.toLowerCase().includes(filterText.toLowerCase()) ||
        item.bankReference && item.bankReference.toLowerCase().includes(filterText.toLowerCase()))
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
      <div>

        <div className="column-visibility-controls">
          <label>
            <input
              type="checkbox"
              checked={columnsVisibility.userId}
              onChange={() => handleColumnVisibilityChange('userId')}
            />
            User ID
          </label>
          <label>
            <input
              type="checkbox"
              checked={columnsVisibility.fundAmount}
              onChange={() => handleColumnVisibilityChange('fundAmount')}
            />
            Fund Amount
          </label>
          <label>
            <input
              type="checkbox"
              checked={columnsVisibility.paymentMethod}
              onChange={() => handleColumnVisibilityChange('paymentMethod')}
            />
            Payment Method
          </label>
          <label>
            <input
              type="checkbox"
              checked={columnsVisibility.bankName}
              onChange={() => handleColumnVisibilityChange('bankName')}
            />
            Bank Name
          </label>

        </div>
      </div>

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
          title={<h2 style={{ fontSize: '24px', color: '#f36c23', fontFamily: 'sans-serif', fontWeight: '800', textAlign: 'center', }}>Fund Requests</h2>}
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
