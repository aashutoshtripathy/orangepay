import React, { useEffect, useState } from 'react';
import DataTable from 'react-data-table-component';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {  faDownload, faFileExcel } from '@fortawesome/free-solid-svg-icons';
import { CCard, CCardBody, CCardHeader, CCol, CRow, CCardTitle, CCardText } from '@coreui/react';
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

const OrangePayReport = ({userId}) => {
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
        const response = await axios.get(`/getPayments/${userId}`);
        const result = response.data.balance ? response.data.balance : [];
        const reversedResult = result.reverse();
    setData(reversedResult);
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

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
    // { name: 'ID', selector: 'userId', sortable: true },
    { name: 'CANumber', selector: 'canumber', sortable: true },
    { name: 'InvoiceNO', selector: 'invoicenumber', sortable: true }, // Format date
    { name: 'BillMonth', selector: 'billmonth', sortable: true },
    { name: 'TxnId', selector: 'transactionId', sortable: true },
    { name: 'BankReferenceCode', selector: 'refrencenumber', sortable: true },
    { name: 'BankID', selector: 'bankid', sortable: true },
    { name: 'PaymentMode', selector: 'paymentmode', sortable: true },
    { name: 'PaymentStatus', selector: 'paymentstatus', sortable: true },
    {
      name: 'CreatedOn', selector: 'createdon', sortable: true, format: row => new Date(row.createdon).toLocaleString('en-IN', {
        timeZone: 'Asia/Kolkata',
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true
      })
    },
    { name: 'CreatedBy', selector: 'createdby', sortable: true },
    { name: 'BillPostStatus', selector: 'billpoststatus', sortable: true },
    { name: 'PaidAmount', selector: 'billamount', sortable: true },
    { name: 'ReceiptNo', selector: 'reciptno', sortable: true, },
    { name: 'BillPostOn', selector: 'billposton', sortable: true },
    { name: 'Gateway', selector: 'getway', sortable: true },
    { name: 'cardTxnTypeDesc', selector: 'cardtxntype', sortable: true },
    { name: 'TerminalID', selector: 'terminalid', sortable: true },
    { name: 'MId', selector: 'mid', sortable: true },
    { name: 'nameOnCard', selector: 'nameoncard', sortable: true },
    { name: 'Remarks', selector: 'remarks', sortable: true },
    { name: 'LoginId', selector: 'loginid', sortable: true },
    { name: 'RRN', selector: 'rrn', sortable: true },
    { name: 'VPA', selector: 'vpa', sortable: true },
    { name: 'BillAmount', selector: 'billamount', sortable: true },
    { name: 'paymentDate', selector: 'paymentdate', sortable: true },
    { name: 'latitude', selector: 'latitude', sortable: true },
    { name: 'longitude', selector: 'longitude', sortable: true },
    { name: 'FetchType', selector: 'fetchtype', sortable: true },
    { name: 'ConsumerMobileNo', selector: 'consumermob', sortable: true },
    { name: 'LT_HT', selector: 'ltht', sortable: true },
    { name: 'DueDate', selector: 'duedate', sortable: true },
    { name: 'BrandCode', selector: 'brandcode', sortable: true },
    { name: 'Division', selector: 'division', sortable: true },
    { name: 'SubDivision', selector: 'subdivision', sortable: true },
  ];

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

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
          title={<h2 style={{ fontSize: '24px', color: '#f36c23', fontFamily: 'sans-serif', fontWeight: '800', textAlign: 'center', }}>Bill Payment</h2>}
        columns={columns}
        data={filteredItems}
        pagination
        highlightOnHover
        customStyles={customStyles}
      />

      <div>
        </div>

        <CRow className="my-4">
          <CCol sm="6" md="3">
            <CCard>
              <CCardHeader>
                <CCardTitle>Total Paid Amount</CCardTitle>
              </CCardHeader>
              <CCardBody>
                <CCardText className="h4 text-success">
                  ₹{totalPaidAmount.toFixed(2)}
                </CCardText>
              </CCardBody>
            </CCard>
          </CCol>
          <CCol sm="6" md="3">
            <CCard>
              <CCardHeader>
                <CCardTitle>Total Commission</CCardTitle>
              </CCardHeader>
              <CCardBody>
                <CCardText className="h4 text-primary">
                  ₹{overallCommission.toFixed(2)}
                </CCardText>
              </CCardBody>
            </CCard>
          </CCol>
          <CCol sm="6" md="3">
            <CCard>
              <CCardHeader>
                <CCardTitle>TDS (5% of Commission)</CCardTitle>
              </CCardHeader>
              <CCardBody>
                <CCardText className="h4 text-danger">
                  ₹{overallTDS.toFixed(2)}
                </CCardText>
              </CCardBody>
            </CCard>
          </CCol>
          <CCol sm="6" md="3">
            <CCard>
              <CCardHeader>
                <CCardTitle>Net Commission</CCardTitle>
              </CCardHeader>
              <CCardBody>
                <CCardText className="h4 text-warning">
                  ₹{overallNetCommission.toFixed(2)}
                </CCardText>
              </CCardBody>
            </CCard>
          </CCol>
        </CRow>
      </div>

    </div>
  );
};

export default OrangePayReport;
