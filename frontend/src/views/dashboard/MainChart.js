import React, { useEffect, useRef, useState } from 'react';
import { CChartLine } from '@coreui/react-chartjs';
import { getStyle } from '@coreui/utils';
import axios from 'axios';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';

const MainChart = ({ selectedInterval }) => {
  const chartRef = useRef(null);
  const [data, setData] = useState({
    labels: [],
    datasets: [
      {
        label: 'Active Users',
        backgroundColor: `rgba(${getStyle('--cui-info-rgb')}, .1)`,
        borderColor: getStyle('--cui-info'),
        pointHoverBackgroundColor: getStyle('--cui-info'),
        borderWidth: 2,
        data: [], // Data will be filled based on the selected interval
        fill: true,
      },
      {
        label: 'Pending Users',
        backgroundColor: 'transparent',
        borderColor: getStyle('--cui-success'),
        pointHoverBackgroundColor: getStyle('--cui-success'),
        borderWidth: 2,
        data: [],
      },
      {
        label: 'Rejected Users',
        backgroundColor: 'transparent',
        borderColor: getStyle('--cui-danger'),
        pointHoverBackgroundColor: getStyle('--cui-danger'),
        borderWidth: 1,
        borderDash: [8, 5],
        data: [],
      },
    ],
  });

  const fetchData = async () => {
    try {
      const response = await axios.get(`/fetchUserList?interval=${selectedInterval.toLowerCase()}`);
      const users = response.data.fetchUser || [];
      const usersWithUserId = users.filter(user => user.userId && user.userId.length > 0);
      const totalUsers = usersWithUserId.length;

      const pendingResponse = await axios.get(`/fetch_data?interval=${selectedInterval.toLowerCase()}`);
      const pendingUsers = pendingResponse.data.data.filter(user => user.status === 'Pending').length;

      const rejectedResponse = await axios.get(`/fetch_data_rejected?interval=${selectedInterval.toLowerCase()}`);
      const rejectedUsers = rejectedResponse.data.data.filter(user => user.status === 'Rejected').length;

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
        activeData[new Date().getHours()] = totalUsers; // Set current hour's data
        pendingData[new Date().getHours()] = pendingUsers;
        rejectedData[new Date().getHours()] = rejectedUsers;
      } else if (selectedInterval === 'Month') {
        labels = Array.from({ length: 30 }, (_, i) => `${i + 1}`);
        activeData = Array(30).fill(0);
        pendingData = Array(30).fill(0);
        rejectedData = Array(30).fill(0);
        activeData[new Date().getDate() - 1] = totalUsers; // Set today's data
        pendingData[new Date().getDate() - 1] = pendingUsers;
        rejectedData[new Date().getDate() - 1] = rejectedUsers;
      } else { // Year
        labels = Array.from({ length: 12 }, (_, i) => new Date(0, i + 1).toLocaleString('default', { month: 'long' }));
        activeData = Array(12).fill(0);
        pendingData = Array(12).fill(0);
        rejectedData = Array(12).fill(0);
        activeData[new Date().getMonth()] = totalUsers; // Set this month's data
        pendingData[new Date().getMonth()] = pendingUsers;
        rejectedData[new Date().getMonth()] = rejectedUsers;
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

  // Pie chart data for active, pending, and rejected users
  const pieData = [
    { name: 'Active', value: data.datasets[0].data.reduce((a, b) => a + b, 0) },
    { name: 'Pending', value: data.datasets[1].data.reduce((a, b) => a + b, 0) },
    { name: 'Rejected', value: data.datasets[2].data.reduce((a, b) => a + b, 0) },
  ];

  return (
    <>

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
            onClick={(e) => console.log('Pie Chart Data:', e)}
          >
            {pieData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={getStyle(index === 0 ? '--cui-info' : index === 1 ? '--cui-success' : '--cui-danger')} />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>


      
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
  );
};

export default MainChart;
