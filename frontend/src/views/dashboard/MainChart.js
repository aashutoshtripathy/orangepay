import React, { useEffect, useRef, useState } from 'react';
import { CChartLine } from '@coreui/react-chartjs';
import { CButton } from '@coreui/react';
import { getStyle } from '@coreui/utils';
import axios from 'axios';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import { Spinner, Modal, ModalBody, ModalHeader } from "reactstrap";
import DataTable from 'react-data-table-component';
import DataTableComponent from '../pages/requesteduser/RequestedUser';
import FundReport from '../pages/reports/FundReport';
import Reports from '../pages/reports/Reports';


const MainChart = ({ selectedInterval, status }) => {
  const chartRef = useRef(null);
  const userId = localStorage.getItem('userId')
  const [loading, setLoading] = useState(true);
  const [dataForTable, setDataForTable] = useState('');
  const [popupVisible, setPopupVisible] = useState(false); // Popup state
  const [popupData, setPopupData] = useState(null);
  const [currentReport, setCurrentReport] = useState('FundReport');


  const [data, setData] = useState({
    labels: [],
    datasets: [
      {
        label: 'Total Collections',
        backgroundColor: `rgba(${getStyle('--cui-info-rgb')}, .1)`,
        borderColor: getStyle('--cui-info'),
        pointHoverBackgroundColor: getStyle('--cui-info'),
        borderWidth: 2,
        data: [], // Data will be filled based on the selected interval
        fill: true,
      },
      {
        label: 'Total Fund',
        backgroundColor: 'transparent',
        borderColor: getStyle('--cui-success'),
        pointHoverBackgroundColor: getStyle('--cui-success'),
        borderWidth: 2,
        data: [],
      },
      {
        label: 'Total Users',
        backgroundColor: 'transparent',
        borderColor: getStyle('--cui-danger'),
        pointHoverBackgroundColor: getStyle('--cui-danger'),
        borderWidth: 1,
        borderDash: [8, 5],
        data: [],
      },
    ],
  });

  const columns = [
    {
      name: 'Column 1',
      selector: (row) => row.column1,
      sortable: true,
    },
    {
      name: 'Column 2',
      selector: (row) => row.column2,
      sortable: true,
    },
    {
      name: 'Column 3',
      selector: (row) => row.column3,
      sortable: true,
    },
  ];

  const [filterType, setFilterType] = useState('all'); // Default filter type is 'today'

  const filterByDate = (items, selectedInterval) => {
    const today = new Date();

    return items.filter((item) => {
      const date = new Date(item.paymentdate || item.createdAt);
      if (isNaN(date)) return false;

      switch (selectedInterval) {
        case 'day':
          return date.toDateString() === today.toDateString();
        case 'month':
          return date.getMonth() === today.getMonth() && date.getFullYear() === today.getFullYear();
        case 'year':
          return date.getFullYear() === today.getFullYear();
        default:
          return true;
      }
    });
  };


  // Function to switch between reports
  const switchReport = (reportType) => {
    setCurrentReport(reportType);
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 6000);

    return () => clearTimeout(timer);
  }, []);


  // const getStyle = (variable) => getComputedStyle(document.documentElement).getPropertyValue(variable);


  const fetchData = async () => {
    try {
      const userResponse = await axios.get(`/api/v1/users/fetchUserList`);
      const users = userResponse.data.fetchUser || [];

      const transformedData = users.map((user) => ({
        column1: user.name, // Replace with actual field
        column2: user.email, // Replace with actual field
        column3: user.phone, // Replace with actual field
      }));

      setDataForTable(transformedData);

      // Fetch balance data
      const balanceResponse = await axios.get(`/api/v1/users/fundrequests`);
      const initialBalance = balanceResponse.data.fundRequests || [];

      const balanceResponsee = await axios.get(`/api/v1/users/fund-request/${userId}`);
      const initialBalances = balanceResponsee.data.fundRequest || [];

      // Fetch payments data
      const paymentsResponse = await axios.get(`/api/v1/users/getTotalPayments`);
      const paymentsData = paymentsResponse.data.data || [];

      const paymentsResponseData = await axios.get(`/api/v1/users/getPayments/${userId}`);
      const paymentsDataa = paymentsResponseData.data.balance || [];

      // Filter payments and balances based on filterType
      const filteredPayments = filterByDate(paymentsData, selectedInterval);
      const filteredPaymentss = filterByDate(paymentsDataa, selectedInterval);
      const filteredBalance = filterByDate(initialBalance, selectedInterval);
      const filteredBalances = filterByDate(initialBalances, selectedInterval);
      const filteredUsers = filterByDate(users, selectedInterval);

      // Calculate total payments and balance based on filtered data
      const totalPayments = filteredPayments.reduce((acc, item) => acc + parseFloat(item.paidamount || 0), 0);
      const totalPaymentss = filteredPaymentss.reduce((acc, item) => acc + parseFloat(item.paidamount || 0), 0);
      const totalBalance = filteredBalance.reduce((acc, item) => {
        if (item.status === 'approved') {
          return acc + parseFloat(item.fundAmount || 0);
        }
        return acc;
      }, 0);
      const totalBalances = filteredBalances.reduce((acc, item) => {
        if (item.status === 'approved') {
          return acc + parseFloat(item.fundAmount || 0);
        }
        return acc;
      }, 0);
      const userCount = filteredUsers.length;

      console.log('Total Payments:', totalPayments);
      console.log('Total Balance:', totalBalance);
      console.log('User Count:', userCount);


      // Prepare labels and data arrays based on the selected interval
      let labels = [];
      let activeData = [];
      let pendingData = [];
      let rejectedData = [];

      if (selectedInterval === 'Day') {
        labels = Array.from({ length: 24 }, (_, i) => `${i}:00`);
        activeData = Array(24).fill(0);
        pendingData = Array(24).fill(0);
        rejectedData = Array(24).fill(0);
        activeData[new Date().getHours()] = totalPayments; // Set current hour's data
        pendingData[new Date().getHours()] = totalBalance;
        rejectedData[new Date().getHours()] = userCount;
      } else if (selectedInterval === 'Month') {
        labels = Array.from({ length: 30 }, (_, i) => `${i + 1}`);
        activeData = Array(30).fill(0);
        pendingData = Array(30).fill(0);
        rejectedData = Array(30).fill(0);
        activeData[new Date().getDate() - 1] = totalPayments; // Set today's data
        pendingData[new Date().getDate() - 1] = totalBalance;
        rejectedData[new Date().getDate() - 1] = userCount;
      } else { // Year
        labels = Array.from({ length: 12 }, (_, i) => new Date(0, i + 1).toLocaleString('default', { month: 'long' }));
        activeData = Array(12).fill(0);
        pendingData = Array(12).fill(0);
        rejectedData = Array(12).fill(0);
        activeData[new Date().getMonth()] = totalPayments; // Set this month's data
        pendingData[new Date().getMonth()] = totalBalance;
        rejectedData[new Date().getMonth()] = userCount;
      }

      setData({
        labels,
        datasets: [
          { ...data.datasets[0], data: activeData },
          { ...data.datasets[1], data: pendingData },
          { ...data.datasets[2], data: rejectedData },
        ],
      });
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchData(); // Fetch data on initial load
  }, [selectedInterval]); // Re-fetch data when selected interval changes

  const handleIntervalChange = (interval) => {
    selectedInterval(interval);
  };


  const handlePieClick = (entry) => {
    // Set popup data and open the popup
    setPopupData(entry);
    setPopupVisible(true);
  };

  const closePopup = () => {
    // Close the popup
    setPopupVisible(false);
    setPopupData(null);
  };

  // Pie chart data for active, pending, and rejected users
  const pieData = [
    { name: 'Total Collection', value: data.datasets[0].data.reduce((a, b) => a + b, 0) },
    { name: 'Total Fund', value: data.datasets[1].data.reduce((a, b) => a + b, 0) },
    // { name: 'Users', value: data.datasets[2].data.reduce((a, b) => a + b, 0) },
  ];

  return (
    <>

      {status === 'Activated' ? (
        <>
          <div style={{ position: "relative", height: "300px", width: "100%" }}>
            {loading ? (
              // Loader centered absolutely
              <div
                style={{
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                  zIndex: 10,
                }}
              >
                <Spinner color="primary" />
                <p style={{ marginTop: "10px", marginRight: "auto", color: "#888", fontSize: "14px" }}>Please wait...</p>

              </div>
            ) : (
              // Render PieChart when loading is complete
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={pieData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    fill="#8884d8"
                    onClick={(entry) => handlePieClick(entry)}
                  >
                    {pieData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={getStyle(index === 0 ? "--cui-info" : index === 1 ? "--cui-success" : "--cui-danger")}
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>



          <CChartLine
            ref={chartRef}
            style={{ height: '300px', marginTop: '40px' }}
            data={data}
            options={{
              maintainAspectRatio: false,
              plugins: {
                legend: {
                  display: true,
                },
              },
              scales: {
                x: {
                  grid: {
                    color: getStyle('--cui-border-color-translucent'),
                    drawOnChartArea: false,
                  },
                  ticks: {
                    color: getStyle('--cui-body-color'),
                  },
                },
                y: {
                  beginAtZero: true,
                  border: {
                    color: getStyle('--cui-border-color-translucent'),
                  },
                  grid: {
                    color: getStyle('--cui-border-color-translucent'),
                  },
                  ticks: {
                    color: getStyle('--cui-body-color'),
                  },
                },
              },
            }}
          />
          {/* Pie chart */}

        </>
      ) : (
        <>
          <div style={{ position: "relative", height: "300px", width: "100%" }}>
            {loading ? (
              // Loader centered absolutely
              <div
                style={{
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                  zIndex: 10,
                }}
              >
                <Spinner color="primary" />
                <p style={{ marginTop: "10px", marginRight: "auto", color: "#888", fontSize: "14px" }}>Please wait...</p>

              </div>
            ) : (
              // Render PieChart when loading is complete
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={pieData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    fill="#8884d8"
                    onClick={(e) => console.log("Pie Chart Data:", e)}
                  >
                    {pieData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={getStyle(index === 0 ? "--cui-info" : index === 1 ? "--cui-success" : "--cui-danger")}
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>



          <CChartLine
            ref={chartRef}
            style={{ height: '300px', marginTop: '40px' }}
            data={data}
            options={{
              maintainAspectRatio: false,
              plugins: {
                legend: {
                  display: true,
                },
              },
              scales: {
                x: {
                  grid: {
                    color: getStyle('--cui-border-color-translucent'),
                    drawOnChartArea: false,
                  },
                  ticks: {
                    color: getStyle('--cui-body-color'),
                  },
                },
                y: {
                  beginAtZero: true,
                  border: {
                    color: getStyle('--cui-border-color-translucent'),
                  },
                  grid: {
                    color: getStyle('--cui-border-color-translucent'),
                  },
                  ticks: {
                    color: getStyle('--cui-body-color'),
                  },
                },
              },
            }}
          />
          {/* Pie chart */}

        </>
      )}
      <Modal
        isOpen={popupVisible}
        toggle={closePopup}
        style={{ maxWidth: '800px', width: '100%' }}
      >
        <ModalHeader toggle={closePopup}>Details</ModalHeader>
        <ModalBody>
          <div className="d-flex justify-content-between mb-3">
            <CButton onClick={() => switchReport('FundReport')} color="primary" style={{ backgroundColor: "#f36c23", border: "none" }}>
              Fund Reports
            </CButton>
            <CButton onClick={() => switchReport('Reports')} color="primary" style={{ backgroundColor: "#f36c23", border: "none" }}>
              Collection Reports
            </CButton>
          </div>

          {currentReport === 'FundReport' ? <FundReport /> : <Reports />}
        </ModalBody>
      </Modal>


    </>
  );
};

export default MainChart;
