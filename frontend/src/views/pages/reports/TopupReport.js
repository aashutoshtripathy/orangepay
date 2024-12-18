import React, { useEffect, useState } from 'react';
import DataTable from 'react-data-table-component';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDownload, faFileExcel } from '@fortawesome/free-solid-svg-icons';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from 'xlsx';
import '../../../scss/dataTable.scss';

// Custom styles for the table
const customStyles = {
  rows: {
    style: {
      minHeight: '40px',
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

// Format date for display
const formatDate = (dateString) => {
  const date = new Date(dateString);
  if (isNaN(date.getTime())) {
    console.warn(`Invalid date encountered: ${dateString}`);
    return 'Invalid Date';
  }
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  });
};

// Limit amounts to two decimal places
const formatAmount = (amount) => parseFloat(amount).toFixed(2);

const TopupReport = ({ userId }) => {
  const [data, setData] = useState([]); // Initial empty state
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [filterText, setFilterText] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`/api/v1/users/topupreport/${userId}`);

        // Check if the API response indicates success
        if (!response.data.success) {
          console.warn(response.data.message || 'Unknown error from API');
          setData([]); // Set data to an empty array
          setError(response.data.message || 'No transactions available.');
          return;
        }

        const balance = response.data.balance || [];
        if (balance.length === 0) {
          setData([]); // Set data to an empty array
          setError('No data available.');
          return;
        }

        // Flatten transactions from all balances
        const transactions = balance.flatMap((wallet) =>
          wallet.transactions.map((txn) => ({
            ...txn,
            date: txn.date,
            openingBalance: txn.openingBalance,
            closingBalance: txn.closingBalance,
          }))
        );

        if (transactions.length === 0) {
          setData([]); // Set data to an empty array
          setError('No transactions available.');
          return;
        }

        // Sort transactions by date (newest first)
        const sortedData = transactions.sort(
          (a, b) => new Date(b.date) - new Date(a.date)
        );

        setData(sortedData);
        setError(null); // Clear any previous error
      } catch (error) {
        console.error('Error fetching data:', error);
        setData([]); // Set data to an empty array
        // setError(error.response?.data?.message || error.message || 'An error occurred.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [userId]);

  // Filter data based on date range and text
  const filteredItems = data.filter((item) => {
    const transactionDate = new Date(item.date);
    const isDateMatch =
      (!fromDate || transactionDate >= new Date(fromDate)) &&
      (!toDate || transactionDate <= new Date(toDate));
    const isTextMatch = item.date.toLowerCase().includes(filterText.toLowerCase());
    return isTextMatch && isDateMatch;
  });

  const handleClearDates = () => {
    setFromDate('');
    setToDate('');
  };

  const columns = [
    {
      name: 'Date',
      selector: (row) => formatDate(row.date),
      sortable: true,
    },
    {
      name: 'Opening Balance',
      selector: (row) => formatAmount(row.openingBalance),
      sortable: true,
    },
    {
      name: 'Amount',
      selector: (row) => formatAmount(row.amount),
      sortable: true,
    },
    {
      name: 'Closing Balance',
      selector: (row) => formatAmount(row.closingBalance),
      sortable: true,
    },
  ];

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
          placeholder="Search by date..."
          value={filterText}
          onChange={(e) => setFilterText(e.target.value)}
        />
        <button
          className="button-download"
          onClick={() => console.log('Downloading PDF')}
        >
          <FontAwesomeIcon icon={faDownload} /> Download PDF
        </button>
        <button
          className="button-download-excel"
          onClick={() => console.log('Downloading Excel')}
        >
          <FontAwesomeIcon icon={faFileExcel} /> Download Excel
        </button>
        <div className="date-filter-container">
          <label>From Date:</label>
          <input
            type="date"
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
          />
          <label>To Date:</label>
          <input
            type="date"
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
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
        {error && <div className="error-message">Error: {error}</div>}
        <DataTable
          title={<h2 style={{ fontSize: '24px', color: '#f36c23', fontFamily: 'sans-serif', fontWeight: '800', textAlign: 'center', }}>TopUp Reports</h2>}
          columns={columns}
          data={filteredItems}
          pagination
          highlightOnHover
          progressPending={loading}
          noDataComponent={<div>No records found.</div>} // Custom message for empty table
          customStyles={customStyles}
        />
      </div>
    </div>
  );
};

export default TopupReport;
