import React, { useEffect, useState } from 'react';
import DataTable from 'react-data-table-component';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle, faTimesCircle, faDownload, faFileExcel, faSearch } from '@fortawesome/free-solid-svg-icons';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from 'xlsx'; // Import XLSX for Excel export
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
  const pageWidth = doc.internal.pageSize.getWidth();
  const title = "Ezetap Payment Reports";
  const titleXPos = pageWidth / 2;

  doc.setFontSize(18);
  doc.text(title, titleXPos, 15, { align: 'center' });

  doc.setFontSize(10);
  doc.text("Generated on: " + new Date().toLocaleDateString(), 14, 25);

  const columns = [
    { header: 'Transaction ID', dataKey: 'transactionId' },
    { header: 'Amount', dataKey: 'amount' },
    { header: 'Payment Mode', dataKey: 'paymentMode' },
    { header: 'Customer Name', dataKey: 'customerName' },
    { header: 'Mobile No.', dataKey: 'customerMobile' },
    { header: 'Email', dataKey: 'customerEmail' },
    { header: 'Status', dataKey: 'status' },
    { header: 'Date', dataKey: 'date' },
  ];

  const rows = data.map(row => ({
    transactionId: row.transactionId,
    amount: row.amount,
    paymentMode: row.paymentMode,
    customerName: row.customer.name,
    customerMobile: row.customer.mobileNo,
    customerEmail: row.customer.email,
    status: row.status,
    date: row.date,
  }));

  doc.autoTable({
    startY: 30,
    head: columns.map(col => col.header),
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
    didDrawPage: (data) => {
      const pageCount = doc.internal.getNumberOfPages();
      doc.setFontSize(10);
      doc.text(`Page ${pageCount}`, data.settings.margin.left, doc.internal.pageSize.getHeight() - 10);
    }
  });

  doc.save('ezetap_payment_reports.pdf');
};

// Function to generate and download Excel
const downloadExcel = (data) => {
  const ws = XLSX.utils.json_to_sheet(data);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Payment Reports");
  XLSX.writeFile(wb, 'ezetap_payment_reports.xlsx');
};

const EzeTapReport = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filterText, setFilterText] = useState('');

  useEffect(() => {
    const fetchEzeTapReports = async () => {
      try {
        const jsonRequest = {
          demoAppKey: 'Your demo app key',
          prodAppKey: 'Your demo app key',
          merchantName: 'Your Merchant Name',
          userName: 'As provided in email',
          currencyCode: 'INR',
          appMode: 'DEMO',
          captureSignature: 'false',
          prepareDevice: 'true',
          amount: '123',
          options: {
            serviceFee: 100,
            paymentBy: 'ANY',
            paymentMode: 'CARD',
            references: {
              reference1: '1234',
              additionalReferences: ['addRef_xx1', 'addRef_xx2']
            },
            customer: {
              name: 'xyz',
              mobileNo: '1234567890',
              email: 'abc@xyz.com'
            }
          }
        };

        const response = await axios.post('https://api.ezetap.com/universalpay', jsonRequest, {
          headers: { 'Content-Type': 'application/json' }
        });

        const result = response.data; // Modify this based on the actual response format
        setData(result.transactions); // Assume the response has a 'transactions' array
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchEzeTapReports();
  }, []);

  const handleAccept = (row) => {
    console.log('Accepted:', row);
  };

  const handleReject = (row) => {
    console.log('Rejected:', row);
    setData(prevData => prevData.filter(item => item.transactionId !== row.transactionId));
  };

  const handleDownload = (row) => {
    console.log('Downloading file for:', row);
  };

  const handleSearch = () => {
    setFilterText(filterText);
  };

  const columns = [
    { name: 'Transaction ID', selector: 'transactionId', sortable: true },
    { name: 'Amount', selector: 'amount', sortable: true },
    { name: 'Payment Mode', selector: 'paymentMode', sortable: true },
    { name: 'Customer Name', selector: 'customerName', sortable: true },
    { name: 'Mobile No.', selector: 'customerMobile', sortable: true },
    { name: 'Email', selector: 'customerEmail', sortable: true },
    { name: 'Status', selector: 'status', sortable: true },
    { name: 'Date', selector: 'date', sortable: true },
  ];

  const filteredItems = data.filter(item =>
    item.customerName && item.customerName.toLowerCase().includes(filterText.toLowerCase())
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
          placeholder="Search by customer name..."
          value={filterText}
          onChange={(e) => setFilterText(e.target.value)}
        />
        <button className="button-search" onClick={handleSearch}>
          <FontAwesomeIcon icon={faSearch} /> Search
        </button>
        <button className="button-download" onClick={() => downloadPDF(data)}>
          <FontAwesomeIcon icon={faDownload} /> Download PDF
        </button>
        <button className="button-download-excel" onClick={() => downloadExcel(data)}>
          <FontAwesomeIcon icon={faFileExcel} /> Download Excel
        </button>
      </div>
      <DataTable
        title="Ezetap Payment Reports"
        columns={columns}
        data={filteredItems}
        pagination
        highlightOnHover
        customStyles={customStyles}
      />
    </div>
  );
};

export default EzeTapReport;
