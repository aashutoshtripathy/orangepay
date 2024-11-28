import React, { useEffect, useState } from 'react';
import DataTable from 'react-data-table-component';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {  faDownload, faFileExcel } from '@fortawesome/free-solid-svg-icons';
import {
  CDropdown,
  CDropdownToggle,
  CDropdownMenu,
  CDropdownItem,
} from '@coreui/react';
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

// Function to generate and download PDF
const downloadPDF = (data) => {
  // Create a PDF document with portrait orientation
  const doc = new jsPDF({ orientation: 'portrait' });
  const pageWidth = doc.internal.pageSize.getWidth();
  const title = "Bill Payment Report";
  const titleXPos = pageWidth / 2;

  doc.setFontSize(18);
  doc.text(title, titleXPos, 15, { align: 'center' });

  doc.setFontSize(10);
  doc.text("Generated on: " + new Date().toLocaleDateString(), 14, 25);

  // Define columns with reduced widths to fit on a single page
  const columns = [
    { header: 'CANumber', dataKey: 'canumber' },
    { header: 'Invoice Number', dataKey: 'invoicenumber' },
    { header: 'Bill Month', dataKey: 'billmonth' },
    { header: 'Transaction ID', dataKey: 'transactionId' },
    { header: 'Bank Ref Code', dataKey: 'refrencenumber' },
    { header: 'Payment Mode', dataKey: 'paymentmode' },
    { header: 'Payment Status', dataKey: 'paymentstatus' },
    {
      header: 'Created On', dataKey: 'createdon',
      format: row => new Date(row.createdon).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })
    },
    { header: 'Paid Amount', dataKey: 'billamount' },
    { header: 'Remarks', dataKey: 'remarks' },
  ];

  const rows = data.map(row => ({
    ...row,
    createdon: new Date(row.createdon).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }),
  }));

  doc.autoTable({
    startY: 30,
    head: [columns.map(col => col.header)],
    body: rows.map(row => columns.map(col => row[col.dataKey])),
    styles: {
      fontSize: 9, // Reduce font size to fit more content
      cellPadding: 2,
      overflow: 'linebreak',
      halign: 'left',
      valign: 'middle',
    },
    columnStyles: {
      0: { cellWidth: '10px' },
      1: { cellWidth: 'auto' },
      2: { cellWidth: 'auto' },
      3: { cellWidth: 'auto' },
      4: { cellWidth: 'auto' },
      5: { cellWidth: 'auto' },
      6: { cellWidth: 'auto' },
      7: { cellWidth: 'auto' },
      8: { cellWidth: 'auto' },
      9: { cellWidth: 'auto' },
    },
    headStyles: {
      fillColor: [52, 58, 64],
      textColor: [255, 255, 255],
      fontStyle: 'bold',
    },
    alternateRowStyles: {
      fillColor: [240, 240, 240],
    },
    tableWidth: 'wrap', // Adjust table to fit page width
    didDrawPage: (data) => {
      const pageCount = doc.internal.getNumberOfPages();
      doc.setFontSize(10);
      doc.text(`Page ${pageCount}`, data.settings.margin.left, doc.internal.pageSize.getHeight() - 10);
    },
  });

  // Add summary information
  const totalPaidAmount = rows.reduce((total, row) => total + (parseFloat(row.billamount) || 0), 0);
  doc.text(`Total Paid Amount: ₹${totalPaidAmount.toFixed(2)}`, 14, doc.autoTable.previous.finalY + 10);

  doc.save('bill_payment_report.pdf');
};




const downloadExcel = (data) => {
  const formattedData = data.map(row => ({
    ...row,
    createdon: new Date(row.createdon).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }), // Format createdon date
  }));

  const ws = XLSX.utils.json_to_sheet(formattedData);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Bill Payment Report");

  // Add summary information
  const totalPaidAmount = formattedData.reduce((total, row) => total + (parseFloat(row.billamount) || 0), 0);
  const summary = [
    { CANumber: '', InvoiceNumber: '', BillMonth: '', TransactionID: '', BankReferenceCode: '', PaymentMode: '', PaymentStatus: '', CreatedOn: '', PaidAmount: 'Total Paid Amount', Remarks: totalPaidAmount.toFixed(2) }
  ];

  const summarySheet = XLSX.utils.json_to_sheet(summary);
  XLSX.utils.book_append_sheet(wb, summarySheet, "Summary");

  XLSX.writeFile(wb, 'bill_payment_report.xlsx');
};



const initialColumnsVisibility = {
  canumber: true,
  invoicenumber: true,
  billmonth: true,
  transactionId: true,
  refrencenumber: true,
  bankid: true,
  paymentmode: true,
  paymentstatus: true,
  createdon: true,
  createdby: true,
  billpoststatus: true,
  billamount: true,
  reciptno: true,
  billposton: true,
  getway: true,
  cardtxntype: true,
  terminalid: true,
  mid: true,
  nameoncard: true,
  remarks: true,
  loginid: true,
  rrn: true,
  vpa: true,
  paymentdate: true,
  latitude: true,
  longitude: true,
  fetchtype: true,
  consumermob: true,
  ltht: true,
  duedate: true,
  brandcode: true,
  division: true,
  subdivision: true,
};



const Reports = ({userId}) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [filterText, setFilterText] = useState('');
  const [menuOpen, setMenuOpen] = useState(null);
  const [columnsVisibility, setColumnsVisibility] = useState(initialColumnsVisibility);

  // const userId = localStorage.getItem('userId');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`/api/v1/users/getTotalPayments`);
        const result = response.data.data || [];
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

  const handleColumnVisibilityChange = (column) => {
    setColumnsVisibility(prevState => ({
      ...prevState,
      [column]: !prevState[column] 
    }));
  };


  const toggleMenu = (index) => {
    if (menuOpen === index) {
      setMenuOpen(null); 
    } else {
      setMenuOpen(index); 
    }
  };


  const totalPaidAmount = filteredItems.reduce((total, item) => total + (parseFloat(item.billamount) || 0), 0);
  const totalCommission = filteredItems.reduce((total, item) => total + (parseFloat(item.totalCommission) || 0), 0);

  // Calculate the overall commission, TDS, and net commission
  const overallCommission = totalPaidAmount * 0.01;
  const overallTDS = overallCommission * 0.05;
  const overallNetCommission = overallCommission - overallTDS;

  const columns = [

    
    columnsVisibility.canumber && { name: 'AgentId', selector: 'userId', sortable: true },
    columnsVisibility.canumber && { name: 'CANumber', selector: 'canumber', sortable: true },
    columnsVisibility.invoicenumber && { name: 'InvoiceNO', selector: 'invoicenumber', sortable: true },
    columnsVisibility.billmonth && { name: 'BillMonth', selector: 'billmonth', sortable: true },
    columnsVisibility.transactionId && { name: 'TxnId', selector: 'transactionId', sortable: true },
    columnsVisibility.refrencenumber && { name: 'BankReferenceCode', selector: 'refrencenumber', sortable: true },
    columnsVisibility.bankid && { name: 'BankID', selector: 'bankid', sortable: true },
    columnsVisibility.paymentmode && { name: 'PaymentMode', selector: 'paymentmode', sortable: true },
    columnsVisibility.paymentstatus && { name: 'PaymentStatus', selector: 'paymentstatus', sortable: true },
    columnsVisibility.createdon && {
      name: 'CreatedOn',
      selector: 'createdon',
      sortable: true,
      format: row => new Date(row.createdon).toLocaleString('en-IN', {
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
    columnsVisibility.createdby && { name: 'CreatedBy', selector: 'createdby', sortable: true },
    columnsVisibility.billpoststatus && { name: 'BillPostStatus', selector: 'billpoststatus', sortable: true },
    columnsVisibility.billamount && { name: 'PaidAmount', selector: 'billamount', sortable: true },
    columnsVisibility.reciptno && { name: 'ReceiptNo', selector: 'reciptno', sortable: true },
    columnsVisibility.billposton && { name: 'BillPostOn', selector: 'billposton', sortable: true },
    columnsVisibility.getway && { name: 'Gateway', selector: 'getway', sortable: true },
    columnsVisibility.cardtxntype && { name: 'cardTxnTypeDesc', selector: 'cardtxntype', sortable: true },
    columnsVisibility.terminalid && { name: 'TerminalID', selector: 'terminalid', sortable: true },
    columnsVisibility.mid && { name: 'MId', selector: 'mid', sortable: true },
    columnsVisibility.nameoncard && { name: 'nameOnCard', selector: 'nameoncard', sortable: true },
    columnsVisibility.remarks && { name: 'Remarks', selector: 'remarks', sortable: true },
    columnsVisibility.loginid && { name: 'LoginId', selector: 'loginid', sortable: true },
    columnsVisibility.rrn && { name: 'RRN', selector: 'rrn', sortable: true },
    columnsVisibility.vpa && { name: 'VPA', selector: 'vpa', sortable: true },
    columnsVisibility.billamount && { name: 'BillAmount', selector: 'billamount', sortable: true },
    columnsVisibility.paymentdate && { name: 'paymentDate', selector: 'paymentdate', sortable: true },
    columnsVisibility.latitude && { name: 'latitude', selector: 'latitude', sortable: true },
    columnsVisibility.longitude && { name: 'longitude', selector: 'longitude', sortable: true },
    columnsVisibility.fetchtype && { name: 'FetchType', selector: 'fetchtype', sortable: true },
    columnsVisibility.consumermob && { name: 'ConsumerMobileNo', selector: 'consumermob', sortable: true },
    columnsVisibility.ltht && { name: 'LT_HT', selector: 'ltht', sortable: true },
    columnsVisibility.duedate && { name: 'DueDate', selector: 'duedate', sortable: true },
    columnsVisibility.brandcode && { name: 'BrandCode', selector: 'brandcode', sortable: true },
    columnsVisibility.division && { name: 'Division', selector: 'division', sortable: true },
    columnsVisibility.subdivision && { name: 'SubDivision', selector: 'subdivision', sortable: true },
].filter(Boolean); // Filter out any columns that are false (not visible)


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
          placeholder="Search by status..."
          value={filterText}
          onChange={(e) => setFilterText(e.target.value)}
        />
<CDropdown >
  <CDropdownToggle className="button-download" >
    <FontAwesomeIcon  icon="eye" /> Visibility
  </CDropdownToggle>
<CDropdownMenu>
  <div
    className="column-visibility-controls"
    style={{
      display: 'flex',
      flexDirection: 'row',
      flexWrap: 'wrap',
      padding: '10px',
    }}
  >
    <CDropdownItem style={{ display: 'flex', alignItems: 'center' }}>
      <label>
        <input
          type="checkbox"
          checked={columnsVisibility.canumber}
          onChange={() => handleColumnVisibilityChange('canumber')}
        />
        CA Number
      </label>
    </CDropdownItem>

    <CDropdownItem style={{ display: 'flex', alignItems: 'center' }}>
      <label>
        <input
          type="checkbox"
          checked={columnsVisibility.invoicenumber}
          onChange={() => handleColumnVisibilityChange('invoicenumber')}
        />
        Invoice NO
      </label>
    </CDropdownItem>

    <CDropdownItem style={{ display: 'flex', alignItems: 'center' }}>
      <label>
        <input
          type="checkbox"
          checked={columnsVisibility.billmonth}
          onChange={() => handleColumnVisibilityChange('billmonth')}
        />
        Bill Month
      </label>
    </CDropdownItem>

    <CDropdownItem style={{ display: 'flex', alignItems: 'center' }}>
      <label>
        <input
          type="checkbox"
          checked={columnsVisibility.transactionId}
          onChange={() => handleColumnVisibilityChange('transactionId')}
        />
        Txn Id
      </label>
    </CDropdownItem>

    <CDropdownItem style={{ display: 'flex', alignItems: 'center' }}>
      <label>
        <input
          type="checkbox"
          checked={columnsVisibility.refrencenumber}
          onChange={() => handleColumnVisibilityChange('refrencenumber')}
        />
        Bank Reference Code
      </label>
    </CDropdownItem>

    <CDropdownItem style={{ display: 'flex', alignItems: 'center' }}>
      <label>
        <input
          type="checkbox"
          checked={columnsVisibility.bankid}
          onChange={() => handleColumnVisibilityChange('bankid')}
        />
        Bank ID
      </label>
    </CDropdownItem>

    <CDropdownItem style={{ display: 'flex', alignItems: 'center' }}>
      <label>
        <input
          type="checkbox"
          checked={columnsVisibility.paymentmode}
          onChange={() => handleColumnVisibilityChange('paymentmode')}
        />
        Payment Mode
      </label>
    </CDropdownItem>

    <CDropdownItem style={{ display: 'flex', alignItems: 'center' }}>
      <label>
        <input
          type="checkbox"
          checked={columnsVisibility.paymentstatus}
          onChange={() => handleColumnVisibilityChange('paymentstatus')}
        />
        Payment Status
      </label>
    </CDropdownItem>

    <CDropdownItem style={{ display: 'flex', alignItems: 'center' }}>
      <label>
        <input
          type="checkbox"
          checked={columnsVisibility.createdon}
          onChange={() => handleColumnVisibilityChange('createdon')}
        />
        Created On
      </label>
    </CDropdownItem>

    <CDropdownItem style={{ display: 'flex', alignItems: 'center' }}>
      <label>
        <input
          type="checkbox"
          checked={columnsVisibility.createdby}
          onChange={() => handleColumnVisibilityChange('createdby')}
        />
        Created By
      </label>
    </CDropdownItem>

    <CDropdownItem style={{ display: 'flex', alignItems: 'center' }}>
      <label>
        <input
          type="checkbox"
          checked={columnsVisibility.billpoststatus}
          onChange={() => handleColumnVisibilityChange('billpoststatus')}
        />
        Bill Post Status
      </label>
    </CDropdownItem>

    <CDropdownItem style={{ display: 'flex', alignItems: 'center' }}>
      <label>
        <input
          type="checkbox"
          checked={columnsVisibility.billamount}
          onChange={() => handleColumnVisibilityChange('billamount')}
        />
        Bill Amount
      </label>
    </CDropdownItem>

    <CDropdownItem style={{ display: 'flex', alignItems: 'center' }}>
      <label>
        <input
          type="checkbox"
          checked={columnsVisibility.reciptno}
          onChange={() => handleColumnVisibilityChange('reciptno')}
        />
        Receipt No
      </label>
    </CDropdownItem>

    <CDropdownItem style={{ display: 'flex', alignItems: 'center' }}>
      <label>
        <input
          type="checkbox"
          checked={columnsVisibility.billposton}
          onChange={() => handleColumnVisibilityChange('billposton')}
        />
        Bill Post On
      </label>
    </CDropdownItem>

    {/* Repeat similar structure for other columns */}
    {/* For example: */}
    <CDropdownItem style={{ display: 'flex', alignItems: 'center' }}>
      <label>
        <input
          type="checkbox"
          checked={columnsVisibility.getway}
          onChange={() => handleColumnVisibilityChange('getway')}
        />
        Gateway
      </label>
    </CDropdownItem>
    <CDropdownItem style={{ display: 'flex', alignItems: 'center' }}>
      <label>
        <input
          type="checkbox"
          checked={columnsVisibility.cardtxntype}
          onChange={() => handleColumnVisibilityChange('cardtxntype')}
        />
        Card Txn Type Desc
      </label>
    </CDropdownItem>
    <CDropdownItem style={{ display: 'flex', alignItems: 'center' }}>
      <label>
        <input
          type="checkbox"
          checked={columnsVisibility.terminalid}
          onChange={() => handleColumnVisibilityChange('terminalid')}
        />
        Terminal ID
      </label>
    </CDropdownItem>
    <CDropdownItem style={{ display: 'flex', alignItems: 'center' }}>
      <label>
        <input
          type="checkbox"
          checked={columnsVisibility.mid}
          onChange={() => handleColumnVisibilityChange('mid')}
        />
        MId
      </label>
    </CDropdownItem>
    <CDropdownItem style={{ display: 'flex', alignItems: 'center' }}>
      <label>
        <input
          type="checkbox"
          checked={columnsVisibility.nameoncard}
          onChange={() => handleColumnVisibilityChange('nameoncard')}
        />
        Name On Card 
      </label>
    </CDropdownItem>
    <CDropdownItem style={{ display: 'flex', alignItems: 'center' }}>
      <label>
        <input
          type="checkbox"
          checked={columnsVisibility.remarks}
          onChange={() => handleColumnVisibilityChange('remarks')}
        />
        Remarks
      </label>
    </CDropdownItem>
    <CDropdownItem style={{ display: 'flex', alignItems: 'center' }}>
      <label>
        <input
          type="checkbox"
          checked={columnsVisibility.loginid}
          onChange={() => handleColumnVisibilityChange('loginid')}
        />
        Login ID
      </label>
    </CDropdownItem>
    <CDropdownItem style={{ display: 'flex', alignItems: 'center' }}>
      <label>
        <input
          type="checkbox"
          checked={columnsVisibility.rrn}
          onChange={() => handleColumnVisibilityChange('rrn')}
        />
       RRN
      </label>
    </CDropdownItem>
    <CDropdownItem style={{ display: 'flex', alignItems: 'center' }}>
      <label>
        <input
          type="checkbox"
          checked={columnsVisibility.vpa}
          onChange={() => handleColumnVisibilityChange('vpa')}
        />
        VPA
      </label>
    </CDropdownItem>
    <CDropdownItem style={{ display: 'flex', alignItems: 'center' }}>
      <label>
        <input
          type="checkbox"
          checked={columnsVisibility.billamount}
          onChange={() => handleColumnVisibilityChange('billamount')}
        />
        Bill Amount 
      </label>
    </CDropdownItem>
    <CDropdownItem style={{ display: 'flex', alignItems: 'center' }}>
      <label>
        <input
          type="checkbox"
          checked={columnsVisibility.paymentdate}
          onChange={() => handleColumnVisibilityChange('paymentdate')}
        />
        Payment Date
      </label>
    </CDropdownItem>
    <CDropdownItem style={{ display: 'flex', alignItems: 'center' }}>
      <label>
        <input
          type="checkbox"
          checked={columnsVisibility.latitude}
          onChange={() => handleColumnVisibilityChange('latitude')}
        />
        Latitude
      </label>
    </CDropdownItem>
    <CDropdownItem style={{ display: 'flex', alignItems: 'center' }}>
      <label>
        <input
          type="checkbox"
          checked={columnsVisibility.longitude}
          onChange={() => handleColumnVisibilityChange('longitude')}
        />
        Longitude 
      </label>
    </CDropdownItem>
    <CDropdownItem style={{ display: 'flex', alignItems: 'center' }}>
      <label>
        <input
          type="checkbox"
          checked={columnsVisibility.fetchtype}
          onChange={() => handleColumnVisibilityChange('fetchtype')}
        />
        Fetch Type
      </label>
    </CDropdownItem>
    <CDropdownItem style={{ display: 'flex', alignItems: 'center' }}>
      <label>
        <input
          type="checkbox"
          checked={columnsVisibility.consumermob}
          onChange={() => handleColumnVisibilityChange('consumermob')}
        />
        ConsumerMobileNo
      </label>
    </CDropdownItem>
    
    {/* Continue with the remaining items */}
  </div>
</CDropdownMenu>
</CDropdown>

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

export default Reports;
