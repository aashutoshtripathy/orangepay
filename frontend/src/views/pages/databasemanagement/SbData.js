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
        const response = await axios.get('getAllSbdata');
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
      const newFilteredData = sbdata.filter(item =>
        Object.values(item).some(value => 
          value != null && value.toString().toLowerCase().includes(searchTerm.toLowerCase()) // Ensure value is not null
          
        )
      );
      setFilteredData(newFilteredData);
    };

    

    filterData();
  }, [searchTerm, sbdata]);

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

      // Apply date filtering
      if (fromDate && toDate) {
        newFilteredData = newFilteredData.filter(item => {
          const itemDate = new Date(item.CreatedOn); // Adjust 'dateField' to the actual date field in your data
          return itemDate >= new Date(fromDate) && itemDate <= new Date(toDate);
        });
      } else if (fromDate) {
        newFilteredData = newFilteredData.filter(item => {
          const itemDate = new Date(item.CreatedOn); // Adjust 'dateField' to the actual date field in your data
          return itemDate >= new Date(fromDate);
        });
      } else if (toDate) {
        newFilteredData = newFilteredData.filter(item => {
          const itemDate = new Date(item.CreatedOn); // Adjust 'dateField' to the actual date field in your data
          return itemDate <= new Date(toDate);
        });
      }

      setFilteredData(newFilteredData);
    };

    filterData();
  }, [searchTerm, fromDate, toDate, sbdata ]);

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
  ];

  if (loading) return <div>Loading...</div>;
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
