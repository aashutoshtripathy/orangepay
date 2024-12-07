import React, { useEffect, useState } from 'react';
import DataTable from 'react-data-table-component';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle, faDownload, faFileExcel } from '@fortawesome/free-solid-svg-icons';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from 'xlsx';  // Import XLSX for Excel export
import '../../../scss/dataTable.scss';
import { useNavigate } from 'react-router-dom';

// Custom styles for the table
const customStyles = {
  rows: {
    style: {
      minHeight: '40px',
      cursor: 'pointer',
    },
  },
  headCells: {
    style: {
      backgroundColor: '#f4f4f9',
      color: '#333',
      fontSize: '16px',
      fontWeight: 'bold',
      paddingLeft: '12px',
      paddingRight: '12px',
      borderBottom: '2px solid #e1e1e1',
    },
  },
  cells: {
    style: {
      paddingLeft: '12px',
      paddingRight: '12px',
    },
  },
};

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
      { header: 'User ID', dataKey: 'uniqueId' },
      { header: 'Fund Amount', dataKey: 'fundAmount' },
      { header: 'Payment Method', dataKey: 'paymentMethod' },
      { header: 'Bank Name', dataKey: 'bankName' },
    ];
  
    const rows = data.map(row => {
      const formattedRow = {};
      columns.forEach(col => {
        formattedRow[col.dataKey] = row[col.dataKey];
      });
      return formattedRow;
    });
  
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
  const downloadExcel = (data) => {
    const formattedData = data.map(row => ({
      'User ID': row.uniqueId,
      'Fund Amount': row.fundAmount,
      'Payment Method': row.paymentMethod,
      'Bank Name': row.bankName,
      'Date': new Date(row.createdAt).toLocaleDateString(),
    }));
  
    const ws = XLSX.utils.json_to_sheet(formattedData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Fund Requests");
  
    XLSX.writeFile(wb, 'FundRequestsReport.xlsx');
  };
  
  const RepostingBill = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [fromDate, setFromDate] = useState('');
    const [toDate, setToDate] = useState('');
    const [filterText, setFilterText] = useState('');
    const userId = localStorage.getItem('userId');
    const [selectedRows, setSelectedRows] = useState('')
    const navigate = useNavigate();
    const [columnsVisibility, setColumnsVisibility] = useState({
      userId: true,
      fundAmount: true,
      paymentMethod: true,
      bankName: true,
      billpoststatus: true,
    });
  
    // New state hooks for bill data fetching
    const [billData, setBillData] = useState(null);
    const [fetchBillSuccess, setFetchBillSuccess] = useState(false);
    const [isBillFetched, setIsBillFetched] = useState(false);
  

  useEffect(() => {
    axios.get('/api/v1/users/reposting')
      .then((response) => {
        setData(response.data?.data || []);
        setLoading(false);
      })
      .catch((error) => {
        setData([]);
        // setError(error);
        setLoading(false);
      });
  }, []);



  const handleStartScheduler = async () => {
    try {
      // Sending a POST request to the backend to start the scheduler
      const response = await axios.post('/api/v1/users/start-scheduler');
      if (response.status === 200) {
        alert('Scheduler started and payment processing initiated.');
      } else {
        alert('Failed to start the scheduler.');
      }
    } catch (error) {
      console.error('Error starting the scheduler:', error.message);
      alert('An error occurred while starting the scheduler.');
    }
  };

  const handleColumnVisibilityChange = (column) => {
    setColumnsVisibility(prevState => ({
      ...prevState,
      [column]: !prevState[column]
    }));
  };

  // Function to handle fetching bill details for selected rows
  const handleFetch = async (row) => {

    const MERCHANT_CODE = 'BSPDCL_RAPDRP_16';
    const MERCHANT_PASSWORD = 'OR1f5pJeM9q@G26TR9nPY';


    const API_URL = '/api/v1/biharpayment/BiharService/BillInterface.asmx';
  // const SECONDARY_API_URL = '/BiharService/BillInterface'
  const SECONDARY_API_URL = '/api/v1/biharpayment/BiharService/BillInterface.asmx?op=PaymentDetails'


  const soapRequest = () => `
    <?xml version="1.0" encoding="utf-8"?>
    <soap:Envelope xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xmlns:xsd="http://www.w3.org/2001/XMLSchema" xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
      <soap:Body>
        <BillDetails xmlns="http://tempuri.org/">
          <strCANumber>${row.canumber}</strCANumber>
          <strMerchantCode>${MERCHANT_CODE}</strMerchantCode>
          <strMerchantPassword>${MERCHANT_PASSWORD}</strMerchantPassword>
        </BillDetails>
      </soap:Body>
    </soap:Envelope>
    `;



    try {
      const xmlPayload = soapRequest(row.canumber).trim(); // Ensure no whitespace before XML declaration
      const response = await axios.post(API_URL, xmlPayload, {
        headers: {
          'Content-Type': 'text/xml; charset=utf-8',
          'Accept': 'application/xml, text/xml, application/json',
        },
      });
      console.log(response)
      

      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(response.data, "text/xml");
      const namespaceURI = "http://tempuri.org/";
      const billDetails = xmlDoc.getElementsByTagNameNS(namespaceURI, "BillDetailsResult")[0];

      if (billDetails) {
        const getTagValue = (tagName) => {
          const element = billDetails.getElementsByTagNameNS(namespaceURI, tagName)[0];
          return element && element.textContent.trim() ? element.textContent : 'N/A';
        };

        const fetchedTransactionId = `OP${Date.now()}`;
        // setTransactionId(fetchedTransactionId);

        const fetchedCompanyName = getTagValue("CompanyName");
        const companyCode =
          fetchedCompanyName === "SOUTH BIHAR POWER DISTRIBUTION COMPANY LTD"
            ? "SBPDCL"
            : fetchedCompanyName;

        const fetchedBillData = {
          consumerId: getTagValue("CANumber"),
          consumerName: getTagValue("ConsumerName"),
          address: getTagValue("Address"),
          mobileNo: getTagValue("MobileNumber"),
          divisionName: getTagValue("Division"),
          subDivision: getTagValue("SubDivision"),
          companyName: getTagValue("CompanyName"),
          billMonth: getTagValue("BillMonth"),
          amount: getTagValue("Amount"),
          dueDate: getTagValue("DueDate"),
          invoiceNo: getTagValue("InvoiceNO"),
          companyName: companyCode,
          transactionId: row.transactionId,
          paymentDate: getTagValue("PaymentDateTime"),
          receiptNo: getTagValue("BillNo")
        };

        setBillData(fetchedBillData);
        setFetchBillSuccess(true);
        setIsBillFetched(true)
      } else {
        setFetchBillSuccess(false);
        console.error('No BillDetailsResult found in response from primary API.');


      }
    } catch (error) {
      console.error('Error fetching bill details:', error);
    } finally {
    //   setIsLoading(false);
    }
  };

  // Handle row selection (individual checkboxes)
  const handleRowSelect = (rowId, isSelected) => {
    if (isSelected) {
      setSelectedRows(prevState => [...prevState, rowId]);
    } else {
      setSelectedRows(prevState => prevState.filter(id => id !== rowId));
    }
  };

  // Handle master checkbox (select/deselect all rows)
  const handleSelectAll = (e) => {
    if (e.target.checked) {
      const allRowIds = data.map(row => row.id);
      setSelectedRows(allRowIds);
    } else {
      setSelectedRows([]);
    }
  };

  // Handle sending data for selected rows
  const handleBulkAction = () => {
    const selectedData = data.filter(row => selectedRows.includes(row.id));
    console.log("Selected data for bulk action: ", selectedData);
    // Send the selected data to the server or handle it as needed
  };

  const filteredItems = data.filter((item) => item.billpoststatus === 'Pending');

  const columns = [
    // {
    //   name: <input type="checkbox" onChange={handleSelectAll} />, // Master checkbox to select all
    //   cell: (row) => (
    //     <input 
    //       type="checkbox" 
    //       checked={selectedRows.includes(row.id)} 
    //       onChange={(e) => handleRowSelect(row.id, e.target.checked)} 
    //     />
    //   ),
    //   width: '50px',
    // },
    columnsVisibility.userId && { name: 'User ID', selector: 'userId', sortable: true },
    columnsVisibility.fundAmount && { name: 'Consumer ID', selector: 'canumber', sortable: true },
    columnsVisibility.paymentMethod && { name: 'Transaction ID', selector: 'transactionId', sortable: true },
    columnsVisibility.bankName && { name: 'Payment Mode', selector: 'paymentmode', sortable: true },
    columnsVisibility.bankName && { name: 'Paid Amount', selector: 'paidamount', sortable: true },
    columnsVisibility.billpoststatus && { name: 'Bill Post Status', selector: 'billpoststatus', sortable: true },
    // {
    //   name: 'Actions',
    //   cell: (row) => (
    //     <div className="actions-cell">
    //       <button
    //         className="button-search"
    //         onClick={() => handleFetch(row)}
    //       >
    //         <FontAwesomeIcon icon={faCheckCircle} /> Re-Posting
    //       </button>
    //     </div>
    //   ),
    // },
  ].filter(Boolean);

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
      <div className="column-visibility-controls">
        {['userId', 'fundAmount', 'paymentMethod', 'bankName'].map((column) => (
          <label key={column}>
            <input
              type="checkbox"
              checked={columnsVisibility[column]}
              onChange={() => handleColumnVisibilityChange(column)}
            />
            {column.replace(/([A-Z])/g, ' $1').toUpperCase()}
          </label>
        ))}
      </div>

      <div className="button-container">
        <input
          type="text"
          placeholder="Search by status..."
          value={filterText}
          onChange={(e) => setFilterText(e.target.value)}
        />
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
        <button
          className="button-download-excel"
          onClick={handleStartScheduler}
        >
          <FontAwesomeIcon icon={faFileExcel} /> Re-Post Selected Bills
        </button>
        <button
          className="button-bulk-action"
          onClick={handleBulkAction}
        >
          Re-Post Selected Bills
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
            onClick={() => setFromDate('') & setToDate('')}
          >
            Clear Dates
          </button>
        </div>
      </div>

      <div className="data-table-container">
        <DataTable
          title={<h2 style={{ fontSize: '24px', color: '#f36c23', fontFamily: 'sans-serif', fontWeight: '800', textAlign: 'center' }}>Re-Posting Bill</h2>}
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

export default RepostingBill;
