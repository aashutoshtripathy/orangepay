import React, { useEffect, useState } from 'react';
import DataTable from 'react-data-table-component';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle, faTimesCircle, faUnlock,faEllipsisV , faLock, faDownload, faFileExcel, faSearch } from '@fortawesome/free-solid-svg-icons';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { CDropdown, CForm, CButton, CFormInput, CDropdownToggle, CDropdownMenu, CDropdownItem } from '@coreui/react';
import * as XLSX from 'xlsx';  // Import XLSX for Excel export
import '../../../scss/dataTable.scss';
import '../../../scss/viewuser.scss'
import { useNavigate } from 'react-router-dom';

// Define custom styles for the table
const customStyles = {
  table: {
    style: {
      borderCollapse: 'collapse', // Ensures there is no double border between cells
      width: '100%', // Optional: makes the table full width
    },
  },
  rows: {
    style: {
      minHeight: '72px', // Set the minimum row height
      borderBottom: '1px solid #ddd', // Border between rows
    },
  },
  headCells: {
    style: {
      color: 'black', // Font color for header cells
      fontSize: '16px', // Font size for header
      fontWeight: 'bold', // Make the header bold
      paddingLeft: '8px', // Left padding for header cells
      paddingRight: '8px', // Right padding for header cells
      border: '1px solid #ddd', // Border around header cells
      textAlign: 'left', // Align text in header cells to the left (or change as needed)
    },
  },
  cells: {
    style: {
      paddingLeft: '8px', // Left padding for regular cells
      paddingRight: '8px', // Right padding for regular cells
      border: '1px solid #ddd', // Border around regular cells
      textAlign: 'left', // Align text in cells to the left (or change as needed)
    },
  },
};



const DataTableComponent = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [statusFilter, setStatusFilter] = useState('all');
  const [filterText, setFilterText] = useState('');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const userId = localStorage.getItem('userId');
  const navigate = useNavigate();
  const [editableRowId, setEditableRowId] = useState();
  const [commission, setCommission] = useState(''); // State for commission

  const [commissionValues, setCommissionValues] = useState({});
  const [showButtons, setShowButtons] = useState(true);

// Toggle function for showing/hiding buttons
const toggleButtons = () => {
  setShowButtons(prevState => !prevState);
};

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true); // Set loading before the fetch
      try {
        const response = await axios.get(`/api/v1/users/fetchUserList`);
        const result = response.data.fetchUser || [];
        setData(result);
        const commissions = result.reduce((acc, user) => {
          acc[user._id] = user.margin;
          return acc;
        }, {});
        setCommissionValues(commissions);
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false); // Loading complete
      }
    };
    fetchData();
  }, [userId]);


  useEffect((row) => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`/api/v1/users/fetchUserList/${userId}`);
        const result = response.data.fetchUser || {};




        setCommission(result.margin || '0');
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [userId]);


  const handleCommissionChange = (_id) => (e) => {
    setCommissionValues(prev => ({
      ...prev,
      [_id]: e.target.value
    }));
  };

  const handleChangeClick = async (_id) => {
    console.log(`Updating commission for ID ${_id}`);
    console.log('Current Commission Values:', commissionValues);
  
    const commission = commissionValues[_id]; // Get the commission value directly
    console.log(`Commission to update:`, commission);
  
    try {
      const response = await axios.put(`/updateCommission/${_id}`, { commission }); // Send commission directly
      console.log('Server Response:', response.data);
  
      if (response.data.success) {
        console.log('Commission updated successfully:', response.data.updatedUser);
      } else {
        console.error('Commission update failed:', response.data.message);
      }
    } catch (error) {
      console.error('Error updating commission:', error.response?.data || error.message);
    }
  };
  
  



  const downloadPDF = () => {
    // Filter data based on status
    const filteredData = data.filter(item =>
      statusFilter === 'all' || item.status === statusFilter
    );

    const doc = new jsPDF({ orientation: 'landscape' });
    const columns = [
      { header: 'User ID', dataKey: 'userId' },
      { header: 'Name', dataKey: 'name' },
      { header: 'Aadhar Number', dataKey: 'aadharNumber' },
      // Add other columns as necessary
    ];

    const rows = filteredData.map(item => ({
      userId: item.userId,
      name: item.name,
      aadharNumber: item.aadharNumber,
      // Map other fields as necessary
    }));

    doc.autoTable({
      columns: columns,
      body: rows,
    });

    doc.save('view_users.pdf');
  };

  const downloadExcel = () => {
    // Filter data based on status
    const filteredData = data.filter(item =>
      statusFilter === 'all' || item.status === statusFilter
    );

    const headers = [
      "User ID",
      "Name",
      "Aadhar Number",
      // Add other headers as necessary
    ];

    const wsData = filteredData.map(row => ({
      "User ID": row.userId,
      "Name": row.name,
      "Aadhar Number": row.aadharNumber,
      // Map other fields as necessary
    }));

    const ws = XLSX.utils.json_to_sheet(wsData, { header: headers });

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "User Data");

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
    a.download = 'view_user_data.xlsx';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };








  const filteredItems = data.filter(item => {
    // Check status filter
    const matchesStatus =
      statusFilter === 'all' ||
      (statusFilter === 'Approved' && item.status === 'Approved') ||
      (statusFilter === 'Blocked' && item.status === 'Blocked') ||
      (statusFilter === 'Rejected' && item.status === 'Rejected') ||
      (statusFilter === 'Pending' && item.status === 'Pending');

    const matchesUserId = filterText === '' || (item.userId && item.userId.toString().toLowerCase().includes(filterText.toLowerCase()));


    const itemDate = new Date(item.createdAt);
    const fromDateMatch = fromDate ? new Date(fromDate) <= itemDate : true;
    const toDateMatch = toDate ? new Date(toDate) >= itemDate : true;

    return (
      matchesStatus &&
      matchesUserId &&
      fromDateMatch &&
      toDateMatch
    );
  });


  const handleBlockUnblock = async (row, action) => {
    try {
      const url = action === 'block' ? `/block/${row._id}` : `/unblock/${row._id}`;
      console.log(url)
      const response = await axios.post(url, { userId: row._id });
      if (response.status === 200) {
        setData((prevData) => prevData.filter((r) => r._id !== row._id));
      }
    } catch (error) {
      console.error(`Error ${action}ing user:`, error);
    }
  };


  const handleResend = async (row) => {
    console.log("User ID:", row._id);
  
    try {
      const response = await axios.post('/resend-credentials', { userId: row._id });
  
      if (response.status === 200) {
        alert('Credentials resent successfully!');
      } else {
        alert('Failed to resend credentials.');
      }
    } catch (error) {
      console.error("Error resending credentials:", error);
      alert('An error occurred while resending credentials.');
    }
  };




  const handlePermission = async (row) => {
    console.log("User ID:", row._id);

    navigate(`/permission/${row._id}`)
  };



  const handleAccept = async (row) => {
    try {
      const response = await axios.patch(`/users/${row._id}/approve`);

      if (response.status === 200) {  // Check if the response is successful
        setData((prevData) => prevData.filter((item) => item._id !== row._id));
      }
    } catch (error) {
      console.error("Error approving fund request", error);
    }
  };




  const handleDownload = async (row) => {
    try {
      // Use the Aadhar number from the row object to request the ZIP file
      const response = await axios.get(`/download-images/${row.aadharNumber}`, {
        responseType: 'blob', // Important for binary response type (like a ZIP file)
      });

      // Create a URL for the file blob
      const url = window.URL.createObjectURL(new Blob([response.data]));

      // Create a link element and set the URL to download
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `photos_${row.aadharNumber}.zip`); // Use Aadhar number for file name

      // Append the link to the body and trigger the click
      document.body.appendChild(link);
      link.click();

      // Clean up
      link.parentNode.removeChild(link);
    } catch (error) {
      console.error('Error downloading file', error);
    }
  };







  const handleUpdateCommission = async () => {
    // Prepare the data to be sent to the backend for commission only
    const updatedData = { commission };

    try {
      const response = await axios.put(`/updateCommission/${userId}`, updatedData);

      if (response.data.success) {
        console.log('Commission updated successfully:', response.data.updatedUser);
        navigate(`/view-user`);
      } else {
        console.error('Commission update failed:', response.data.message);
      }
    } catch (error) {
      console.error('Error updating commission:', error);
    }
  };





  const handleView = (row) => {
    navigate(`/view-details/${row._id}`, { state: { status: row.status } })
  };

  const handleSearch = () => {
    // Search logic is already implemented with the filter, just trigger re-render
    setFilterText(filterText);
  };

  const columns = [
    // { name: 'ID', selector: '_id', sortable: true },
    // { name: 'userId', selector: 'userId', sortable: true },
    ...(statusFilter !== 'Rejected' && statusFilter !== 'Pending'
      ? [{ name: 'User ID', selector: 'userId', sortable: true }]
      : []), // Conditionally include the userId column
    { name: 'Name', selector: 'name', sortable: true },
    { name: 'Father/Husband Name', selector: 'fatherOrHusbandName', sortable: true },
    // { name: 'Date of Birth', selector: 'dob', sortable: true },
    { name: 'Aadhar Number', selector: 'aadharNumber', sortable: true },
    { name: 'PAN Number', selector: 'panNumber', sortable: true },
    { name: 'Mobile Number', selector: 'mobileNumber', sortable: true },
    ...(statusFilter === 'Approved' 
      ? [{
          name: 'Commission',
          cell: (row) => (
            <div>
             <CForm>
             <CFormInput
             style={{width:"100px"}}
        type="text"
        id={`commission-${row._id}`}
        name="commission"
        value={commissionValues[row._id] }
        onChange={handleCommissionChange(row._id)}
        onBlur={() => handleChangeClick(row._id)} 
        placeholder="Enter commission amount"
      />
            
            </CForm>
            </div>
          ),
          sortable: true,
        }]
      : []),
    // { name: 'Gender', selector: 'gender', sortable: true },
    // { name: 'Marital Status', selector: 'maritalStatus', sortable: true },
    // { name: 'Education', selector: 'education', sortable: true },
    // { name: 'Address', selector: 'address', sortable: true },
    // { name: 'District', selector: 'district', sortable: true },
    // { name: 'Pin Code', selector: 'pincode', sortable: true },
    // { name: 'Bank Name', selector: 'bank', sortable: true },
    // { name: 'Account no', selector: 'accountno', sortable: true },
    // { name: 'Ifsc Code', selector: 'ifsc', sortable: true },
    // { name: 'Job Type', selector: 'salaryBasis', sortable: true },
    // { name: 'Email', selector: 'email', sortable: true },
    // { name: 'Status', selector: 'status', sortable: true },
    // { name: 'Division', selector: 'division', sortable: true },
    // { name: 'Sub-Division', selector: 'subDivision', sortable: true },
    // { name: 'Section', selector: 'section', sortable: true },
    // // { name: 'userId', selector: 'userId', sortable: true },
    // { name: 'password', selector: 'password', sortable: true },
    // { name: 'Section Type', selector: 'sectionType', sortable: true },
    // { name: 'Created At', selector: 'createdAt', sortable: true },
    // { name: 'Updated At', selector: 'updatedAt', sortable: true },
    {
      name: 'Actions',
      cell: (row) => (
        <div className="actions-cell">
          <div>
            {row.status === 'Blocked' ? (
              row.isBlocked ? (
                <button
                  className="block-unblock-btn unblock-btn"
                  onClick={() => handleBlockUnblock(row, 'unblock')}
                >
                  Unblock
                </button>
              ) : (
                <button
                  className="block-unblock-btn block-btn"
                  onClick={() => handleBlockUnblock(row, 'block')}
                >
                  Block
                </button>
              )
            ) : row.status === 'Approved' ? (
              <>
              {showButtons && (
                <div className="hover-container">
                  {/* Ellipsis button to trigger hover */}
                  <button className="ellipsis-btn">
                    <FontAwesomeIcon icon={faEllipsisV} />
                  </button>
  
                  {/* Action buttons that appear on hover */}
                  <div className="hover-btn">
                    <button
                      className="block-unblock-btn block-btn"
                      onClick={() => handleView(row)}
                    >
                      <FontAwesomeIcon icon={faCheckCircle} /> View Details
                    </button>
  
                    <button
                      onClick={() => handlePermission(row)}
                      className="block-unblock-btn block-btn"
                    >
                      <FontAwesomeIcon icon={faLock} /> Permissions
                    </button>
  
                    <button
                      onClick={() => handleResend(row)}
                      className="block-unblock-btn block-btn"
                    >
                      <FontAwesomeIcon icon={faLock} /> Resend
                    </button>
                  </div>
                </div>
              )}
            </>
            ) : row.status === 'Rejected' ? (
              <>

                <button
                  className="block-unblock-btn block-btn"
                  onClick={() => handleView(row)}
                >
                  <FontAwesomeIcon icon={faCheckCircle} /> View Details
                </button>


              </>
            ) : row.status === 'Pending' ? (
              <>
                <button
                  className="button-search"
                  onClick={() => handleView(row)}
                >
                  <FontAwesomeIcon icon={faCheckCircle} /> View Details
                </button>
              </>
            ) : null}
          </div>

        </div>
      ),
    }
  ];




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
      <div className="button-container">
        <input
        style={{width:"120px"}}
          type="text"
          placeholder="Search by userId..."
          value={filterText}
          onChange={(e) => setFilterText(e.target.value)}
        />
     

        <CDropdown >
          <CDropdownToggle className="button-download"  style={{backgroundColor: "#f36c23"}} color='primary'>
            {statusFilter === 'all' ? 'All Users' :
              statusFilter === 'Approved' ? 'Active Users' :
                statusFilter === 'Blocked' ? 'Blocked Users' :
                  statusFilter === 'Rejected' ? 'Rejected Users' :
                    statusFilter === 'Pending' ? 'Requested Users' : ''}
          </CDropdownToggle>
          <CDropdownMenu>
            <CDropdownItem onClick={() => setStatusFilter('all')}>All Users</CDropdownItem>
            <CDropdownItem onClick={() => setStatusFilter('Approved')}>Active Users</CDropdownItem>
            <CDropdownItem onClick={() => setStatusFilter('Blocked')}>Blocked Users</CDropdownItem>
            <CDropdownItem onClick={() => setStatusFilter('Rejected')}>Rejected Users</CDropdownItem>
            <CDropdownItem onClick={() => setStatusFilter('Pending')}>Requested Users</CDropdownItem>
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
            onClick={() => {
              setFromDate('');
              setToDate('');
            }}
          >
            Clear Dates
          </button>
        </div>
      </div>
      <div className="data-table-container">
      <DataTable
          title={<h2 style={{ fontSize: '24px', color: '#f36c23', fontFamily: 'sans-serif', fontWeight: '800', textAlign: 'center', margin: 0, padding: 0, }}>View Users</h2>}
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
