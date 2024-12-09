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
import { useNavigate } from 'react-router-dom';



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



const downloadPDF = (data) => {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  // Set title
  const pageWidth = doc.internal.pageSize.getWidth();
  doc.setFontSize(16);
  doc.text("Fund Reports", pageWidth / 2, 15, { align: 'center' });

  // Set date
  doc.setFontSize(10);
  doc.text("Generated on: " + new Date().toLocaleDateString(), 14, 25);

  // Column definitions for PDF
  const columns = [
    { header: 'User ID', dataKey: 'userId' },
    { header: 'Transaction ID', dataKey: 'transactionId' },
    { header: 'Consumer Number', dataKey: 'consumerNumber' },
    { header: 'Payment Amount', dataKey: 'paymentAmount' },
    { header: 'Payment Status', dataKey: 'paymentStatus' },
  ];

  // Map data to rows
  const rows = data.map(row => ({
    userId: row.userId,
    transactionId: row.transactionId,
    consumerNumber: row.consumerNumber,
    paymentAmount: row.paymentAmount,
    paymentStatus: row.paymentStatus,
  }));

  // Generate PDF table
  doc.autoTable({
    startY: 30,
    head: [columns.map(col => col.header)],
    body: rows.map(row => columns.map(col => row[col.dataKey])),
    margin: { top: 30, bottom: 10 },
    styles: {
      fontSize: 8,
      cellPadding: 1.5,
      overflow: 'linebreak',
      halign: 'center',
      valign: 'middle',
    },
    headStyles: {
      fillColor: [52, 58, 64],
      textColor: [255, 255, 255],
      fontStyle: 'bold',
    },
    didDrawPage: (data) => {
      doc.setFontSize(8);
      doc.text(`Page ${doc.internal.getNumberOfPages()}`, data.settings.margin.left, doc.internal.pageSize.getHeight() - 10);
    }
  });

  doc.save('fund_reports.pdf');
};






const downloadExcel = (data) => {
  const wb = XLSX.utils.book_new();

  // Define headers and format data
  const headers = ["User ID", "Transaction ID", "Consumer Number", "Payment Amount", "Payment Status"];
  const wsData = data.map(row => ({
    "User ID": row.userId,
    "Transaction ID": row.transactionId,
    "Consumer Number": row.consumerNumber,
    "Payment Amount": row.paymentAmount,
    "Payment Status": row.paymentStatus,
  }));

  const ws = XLSX.utils.json_to_sheet(wsData);

  // Adjust column widths
  ws['!cols'] = [
    { wch: 15 },  // User ID
    { wch: 20 },  // Transaction ID
    { wch: 20 },  // Consumer Number
    { wch: 15 },  // Payment Amount
    { wch: 15 },  // Payment Status
  ];

  XLSX.utils.book_append_sheet(wb, ws, "Fund Reports");

  // Generate download
  const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'binary' });
  const blob = new Blob([s2ab(wbout)], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'fund_reports.xlsx';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
};

function s2ab(s) {
  const buf = new ArrayBuffer(s.length);
  const view = new Uint8Array(buf);
  for (let i = 0; i < s.length; i++) view[i] = s.charCodeAt(i) & 0xFF;
  return buf;
}



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
  const [showButtons, setShowButtons] = useState(true);







  const navigate = useNavigate();





  useEffect(() => {
    const fetchData = async () => { 
      try {
        const response = await axios.get(`/api/v1/users/cancellationHistory/${userId}`);
        const result = response.data.data || []; 
        const reversedResult = result.reverse(); 
        setData(reversedResult);
      } catch (error) {
        if (error.response && error.response.status === 404) {
          setData([]);  
        } else {
          setError("An error occurred while fetching cancellation history.");
        }
      } finally {
        setLoading(false);
      }
    };
  
    if (userId) {
      fetchData();
    }
  }, [userId]);
  
  


  const handleColumnVisibilityChange = (column) => {
    setColumnsVisibility(prevState => ({
      ...prevState,
      [column]: !prevState[column] 
    }));
  };

  const handleViewDetails = (row) => {
    console.log('Viewing details for:', row);
    navigate(`/cancellation-details`, { state: { row } }); // Navigate to a dynamic route (e.g., `/details/1`).
  };


  const toggleMenu = (index) => {
    setMenuOpen(menuOpen === index ? null : index); // Toggle menu visibility
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
      cell: (row) => (
        <div className="action-menu">
          <FontAwesomeIcon
            icon={faCircleInfo}
            style={{ cursor: 'pointer' }}
          />
          <div className="dropdown-menu" style={{padding:"0px"}}>
            <div className="button-container" style={{padding:"0px",margin:"6px"}}>
              <button
                className="button-view-details"
                style={{width:"-webkit-fill-available"}}
                onClick={() => handleViewDetails(row)}
              >
                View Details
              </button>
            </div>
          </div>
        </div>
          
      ),
    },
  ].filter(Boolean); 

  const filteredItems = data.filter(item =>
    item.transactionId.toLowerCase().includes(filterText.toLowerCase()) || 
    item.consumerName.toLowerCase().includes(filterText.toLowerCase()) 
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
