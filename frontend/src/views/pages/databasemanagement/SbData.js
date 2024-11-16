import React, { useEffect, useState } from 'react';
import axios from 'axios';
import DataTable from 'react-data-table-component';
import { debounce } from 'lodash';


const SbdataTable = () => {
  const [sbdata, setSbdata] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [fromDate, setFromdate] = useState('');
  const [toDate, setToDate] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredData, setFilteredData] = useState([]);

  useEffect(() => {
    const fetchSbdata = async () => {
      try {
        const response = await axios.get('getAllSbdata'); // Fetch your data
        setSbdata(response.data);
        setFilteredData(response.data); // Initialize filtered data
      } catch (err) {
        setError('Failed to fetch data');
      } finally {
        setLoading(false);
      }
    };

    fetchSbdata();
  }, []);

  useEffect(() => {
    const filterData = () => {
      let newFilteredData = sbdata;

      // Apply search term filtering
      if (searchTerm) {
        newFilteredData = newFilteredData.filter(item =>
          Object.values(item).some(value => 
            value != null && value.toString().toLowerCase().includes(searchTerm.toLowerCase())
          )
        );
      }

      // Apply date filtering based on `createdOn`
      if (fromDate && toDate) {
        newFilteredData = newFilteredData.filter(item => {
          const createdOnDate = new Date(item.CreatedOn);
          return !isNaN(createdOnDate) && createdOnDate >= new Date(fromDate) && createdOnDate <= new Date(toDate);
        });
      } else if (fromDate) {
        newFilteredData = newFilteredData.filter(item => {
          const createdOnDate = new Date(item.CreatedOn);
          return !isNaN(createdOnDate) && createdOnDate >= new Date(fromDate);
        });
      } else if (toDate) {
        newFilteredData = newFilteredData.filter(item => {
          const createdOnDate = new Date(item.CreatedOn);
          return !isNaN(createdOnDate) && createdOnDate <= new Date(toDate);
        });
      }

      setFilteredData(newFilteredData);
    };

    filterData();
  }, [searchTerm, fromDate, toDate, sbdata]);

  const handleClearDates = () => {
    setFromdate('');
    setToDate('');
  };

  const handleSearchChange = debounce((value) => {
    setSearchTerm(value);
  }, 300); // Debounce for 300ms

  const columns = [
    {
      name: 'Consumer ID',
      selector: 'ConsumerId',
      sortable: true,
    },
    {
      name: 'Field 1',
      selector: 'field1',
      sortable: true,
    },
    {
      name: 'Field 2',
      selector: 'field2',
      sortable: true,
    },
    {
      name: 'Created On',
      selector: 'CreatedOn', // Ensure you display the `createdOn` field
      sortable: true,
      format: row => new Date(row.CreatedOn).toLocaleDateString(), // Optional: format the date
    },
  ];

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <div className="cspinner"></div>
      </div>
    );
  }
  
    if (error) return <div>{error}</div>;

  return (
    <div>
      <h1>Sbdata Records</h1>
      <input
        type="text"
        placeholder="Search..."
        onChange={(e) => handleSearchChange(e.target.value)}
        style={{ marginBottom: '20px', padding: '10px', width: '100%' }}
      />
      <div className="date-filter-container">
        <label>From Date:</label>
        <input
          type="date"
          value={fromDate}
          onChange={e => setFromdate(e.target.value)}
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
      <DataTable
        title="Sbdata Table"
        columns={columns}
        data={filteredData}
        pagination
        highlightOnHover
        striped
      />
    </div>
  );
};

export default SbdataTable;
