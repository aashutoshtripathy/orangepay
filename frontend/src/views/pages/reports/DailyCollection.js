import React, { useState } from 'react';
import axios from 'axios';
import moment from 'moment-timezone';
import './DailyCollection.css';

const initialColumnsVisibility = {
  userId: true,
  id: true,
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
  paidamount: true,
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
  billamount: true,
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
  consumerName: true,
  commission: true,
  tds: true,
  netCommission: true,
  balanceAfterDeduction: true,
  balanceAfterCommission: true,
};

const DailyCollection = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [columnsVisibility, setColumnsVisibility] = useState(initialColumnsVisibility);

  const fetchData = async () => {
    if (!fromDate || !toDate) {
      setError('Please select both From Date and To Date.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
        const formattedFromDate = new Date(fromDate).toISOString();
        const formattedToDate = new Date(toDate).toISOString();
    
        const response = await axios.get('/api/v1/users/getTotalPayments', {
          params: {
            startDate: formattedFromDate,
            endDate: formattedToDate,
        },
      });
      const result = response.data.data || [];
      setData(result.reverse());
    } catch (error) {
      setError(error.response?.data?.message || 'Error fetching data.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="reports-container">
      <h1>Daily Collection Report</h1>

      <div className="date-filter">
        <label>
          From Date:
          <input
            type="date"
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
          />
        </label>
        <label>
          To Date:
          <input
            type="date"
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
          />
        </label>
        <button onClick={fetchData}>Search</button>
      </div>

      {loading && <div className="loading-spinner">Loading...</div>}
      {error && <div className="error-message">{error}</div>}

      <div className="table-responsive">
        <table className="data-table">
          <thead>
            <tr>
              {Object.keys(columnsVisibility).map(
                (column) => columnsVisibility[column] && <th key={column}>{column}</th>
              )}
            </tr>
          </thead>
          <tbody>
            {data.map((item, index) => (
              <tr key={index}>
                {Object.keys(columnsVisibility).map(
                  (column) =>
                    columnsVisibility[column] && (
                      <td key={column}>
                        {column === 'createdon'
                          ? moment(item[column]).tz('Asia/Kolkata').format('DD/MM/YYYY') // Adjust date format here
                          : item[column]}
                      </td>
                    )
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DailyCollection;
