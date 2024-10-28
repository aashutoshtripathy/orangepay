import React, { useEffect, useState } from 'react';
import DataTable from 'react-data-table-component';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  CDropdown,
  CDropdownToggle,
  CDropdownMenu,
  CDropdownItem,
} from '@coreui/react';
import { faEllipsisV, faCircleInfo, faDownload, faFileExcel, faSearch } from '@fortawesome/free-solid-svg-icons';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from 'xlsx'; 
import '../../../scss/dataTable.scss';

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



const downloadPDF = (data) => {
  const doc = new jsPDF({
    orientation: 'p', 
    unit: 'mm',
    format: 'a4'
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const title = "Fund Reports";
  const titleXPos = pageWidth / 2;

  doc.setFontSize(16);
  doc.text(title, titleXPos, 15, { align: 'center' });

  doc.setFontSize(10);
  doc.text("Generated on: " + new Date().toLocaleDateString(), 14, 25);

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
    status: row.status,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
  }));

  doc.autoTable({
    startY: 30,
    head: [columns.map(col => col.header)], 
    body: rows.map(row => columns.map(col => row[col.dataKey])), 
    margin: { top: 30, bottom: 10 }, 
    styles: {
      fontSize: 7, 
      cellPadding: 1, 
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
      0: { cellWidth: 20 },
      1: { cellWidth: 20 },
      2: { cellWidth: 25 },
      3: { cellWidth: 30 },
      4: { cellWidth: 30 },
      5: { cellWidth: 20 },
      6: { cellWidth: 25 },
      7: { cellWidth: 25 },
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

  const headers = [
    "User ID",
    "Fund Amount",
    "Bank Reference",
    "Payment Method",
    "Bank Name",
    "Status",
    "Created At",
    "Updated At"
  ];

  const wsData = data.map(row => ({
    "User ID": row.uniqueId,
    "Fund Amount": row.fundAmount,
    "Bank Reference": row.bankReference,
    "Payment Method": row.paymentMethod,
    "Bank Name": row.bankName,
    "Status": row.status,
    "Created At": row.createdAt,
    "Updated At": row.updatedAt,
  }));

  const ws = XLSX.utils.json_to_sheet(wsData, { header: headers });

  const columnWidths = [
    { wch: 15 }, 
    { wch: 12 },  
    { wch: 25 },  
    { wch: 20 },  
    { wch: 20 },  
    { wch: 10 },  
    { wch: 20 },  
    { wch: 20 }   
  ];

  ws['!cols'] = columnWidths;

  XLSX.utils.book_append_sheet(wb, ws, "Fund Reports");

  const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'binary' });

  function s2ab(s) {
    const buf = new ArrayBuffer(s.length);
    const view = new Uint8Array(buf);
    for (let i = 0; i < s.length; i++) view[i] = s.charCodeAt(i) & 0xFF;
    return buf;
  }

  const blob = new Blob([s2ab(wbout)], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'fund_reports.xlsx'; 
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
};


const initialColumnsVisibility = {
  userId: true,
  transactionId: true,
  consumerNumber: true,
  paymentAmount: true,
  paymentStatus: true,
};

const DataTableComponent = ({userId}) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [filterText, setFilterText] = useState('');
  const [menuOpen, setMenuOpen] = useState(null);
  const [columnsVisibility, setColumnsVisibility] = useState(initialColumnsVisibility);







  useEffect(() => {
    const fetchData = async () => { 
      try {
        const response = await axios.get(`/cancellationHistory?username=${userId}`);
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
  }, [userId]);


  const handleColumnVisibilityChange = (column) => {
    setColumnsVisibility(prevState => ({
      ...prevState,
      [column]: !prevState[column] 
    }));
  };

  const handleViewDetails = (row) => {
    console.log('Viewing details for:', row);
  };


  const toggleMenu = (index) => {
    if (menuOpen === index) {
      setMenuOpen(null); 
    } else {
      setMenuOpen(index); 
    }
  };

  const handleClearDates = () => {
    setFromDate(''); 
    setToDate('');   
  };


  const handleSearch = () => {
    setFilterText(filterText);
  };




  const columns = [
    columnsVisibility.userId && { name: 'User ID', selector: 'userId', sortable: true },
    columnsVisibility.transactionId && { name: 'Transaction ID', selector: 'transactionId', sortable: true },
    columnsVisibility.consumerNumber && { name: 'Consumer Number', selector: 'consumerNumber', sortable: true },
    columnsVisibility.paymentAmount && { name: 'Payment Amount', selector: 'paymentAmount', sortable: true },
    columnsVisibility.paymentStatus && { name: 'Payment Status', selector: 'paymentStatus', sortable: true },
    {
      name: 'Actions',
      center: true, 
      cell: (row, index) => (
        <div className="action-menu" onMouseLeave={() => setMenuOpen(null)}>
          <FontAwesomeIcon
            icon={faCircleInfo}
            style={{ cursor: 'pointer' }}
            onClick={() => toggleMenu(index)}
          />
          {menuOpen === index && (
            <div className="dropdown-menu">
              <div className="button-container">
                <button className="button-view-details">View Details</button>
              </div>
            </div>
          )}
        </div>
      ),
    },
  ].filter(Boolean); 

  const filteredItems = data.filter(item =>
    item.transactionId.toLowerCase().includes(filterText.toLowerCase()) || 
    item.consumerName.toLowerCase().includes(filterText.toLowerCase()) 
  );



  if (loading) {
    return <div>Loading...</div>;
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
              checked={columnsVisibility.transactionId}
              onChange={() => handleColumnVisibilityChange('transactionId')}
            />
            Transaction ID
          </label>
          <label>
            <input
              type="checkbox"
              checked={columnsVisibility.consumerNumber}
              onChange={() => handleColumnVisibilityChange('consumerNumber')}
            />
            Consumer Number
          </label>
          <label>
            <input
              type="checkbox"
              checked={columnsVisibility.paymentAmount}
              onChange={() => handleColumnVisibilityChange('paymentAmount')}
            />
            Payment Amount
          </label>
          <label>
            <input
              type="checkbox"
              checked={columnsVisibility.paymentStatus}
              onChange={() => handleColumnVisibilityChange('paymentStatus')}
            />
            Payment Status
          </label>
        </div>
      </div>
      <div className="button-container">
        <input
        style={{width:"130px"}}

          type="text"
          placeholder="Search by status..."
          value={filterText}
          onChange={(e) => setFilterText(e.target.value)}
        />
      <CDropdown >
  <CDropdownToggle className="button-download">
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
            checked={columnsVisibility.userId}
            onChange={() => handleColumnVisibilityChange('userId')}
          />
          User ID
        </label>
      </CDropdownItem>
      <CDropdownItem style={{ display: 'flex', alignItems: 'center' }}>
        <label>
          <input
            type="checkbox"
            checked={columnsVisibility.transactionId}
            onChange={() => handleColumnVisibilityChange('transactionId')}
          />
          Transaction ID
        </label>
      </CDropdownItem>
      <CDropdownItem style={{ display: 'flex', alignItems: 'center' }}>
        <label>
          <input
            type="checkbox"
            checked={columnsVisibility.consumerNumber}
            onChange={() => handleColumnVisibilityChange('consumerNumber')}
          />
          Consumer Number
        </label>
      </CDropdownItem>
      <CDropdownItem style={{ display: 'flex', alignItems: 'center' }}>
        <label>
          <input
            type="checkbox"
            checked={columnsVisibility.paymentAmount}
            onChange={() => handleColumnVisibilityChange('paymentAmount')}
          />
          Payment Amount
        </label>
      </CDropdownItem>
      <CDropdownItem style={{ display: 'flex', alignItems: 'center' }}>
        <label>
          <input
            type="checkbox"
            checked={columnsVisibility.paymentStatus}
            onChange={() => handleColumnVisibilityChange('paymentStatus')}
          />
          Payment Status
        </label>
      </CDropdownItem>
    </div>
  </CDropdownMenu>
</CDropdown>


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
          title={<h2 style={{ fontSize: '24px', color: '#f36c23', fontFamily: 'sans-serif', fontWeight: '800', textAlign: 'center', }}>Cancellation History</h2>}
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
