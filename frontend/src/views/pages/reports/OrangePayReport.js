import React, { useEffect, useState } from 'react';
import DataTable from 'react-data-table-component';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle, faTimesCircle, faDownload, faFileExcel, faSearch } from '@fortawesome/free-solid-svg-icons';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from 'xlsx'; // Import XLSX for Excel export
import '../../../scss/dataTable.scss';

const customStyles = {
  rows: {
    style: {
      minHeight: '72px',
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

const OrangePayReport = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filterText, setFilterText] = useState('');
  const userId = localStorage.getItem('userId');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`/getPayment/${userId}`);
        const result = response.data.balance ? [response.data.balance] : [];
        setData(result);
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const filteredItems = data.filter(item =>
    Object.values(item).some(val =>
      val && val.toString().toLowerCase().includes(filterText.toLowerCase())
    )
  );

  const columns = [
    { name: 'Transaction ID', selector: 'transactionId', sortable: true },
    { name: 'Reference Number', selector: 'referenceNumber', sortable: true },
    { name: 'Transaction DateTime', selector: 'transactionDateTime', sortable: true },
    { name: 'Service Name', selector: 'serviceName', sortable: true },
    { name: 'Consumer ID', selector: 'consumerId', sortable: true },
    { name: 'Meter ID', selector: 'meterId', sortable: true },
    { name: 'Request Amount', selector: 'requestAmount', sortable: true },
    { name: 'Total Service Charge', selector: 'totalServiceCharge', sortable: true },
    { name: 'Total Commission', selector: 'totalCommission', sortable: true },
    { name: 'Net Amount', selector: 'netAmount', sortable: true },
    { name: 'Action On Amount', selector: 'actionOnAmount', sortable: true },
    { name: 'Status', selector: 'status', sortable: true },
    { name: 'Payment Method', selector: 'paymentMethod', sortable: true },
    { name: 'Payment Date', selector: 'paymentDate', sortable: true },
  ];

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      <div className="button-container">
        <input
          type="text"
          placeholder="Search..."
          value={filterText}
          onChange={(e) => setFilterText(e.target.value)}
        />
        <button className="button-search">
          <FontAwesomeIcon icon={faSearch} /> Search
        </button>
        <button className="button-download" onClick={() => downloadPDF(filteredItems)}>
          <FontAwesomeIcon icon={faDownload} /> Download PDF
        </button>
        <button className="button-download-excel" onClick={() => downloadExcel(filteredItems)}>
          <FontAwesomeIcon icon={faFileExcel} /> Download Excel
        </button>
      </div>
      <DataTable
        title="My Data Table"
        columns={columns}
        data={filteredItems}
        pagination
        highlightOnHover
        customStyles={customStyles}
      />
    </div>
  );
};

export default OrangePayReport;
