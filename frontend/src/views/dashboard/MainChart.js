import React, { useEffect, useRef, useState } from 'react';
import { CChartLine } from '@coreui/react-chartjs';
import { getStyle } from '@coreui/utils';
import axios from 'axios';

const MainChart = () => {
  const chartRef = useRef(null);
  const [data, setData] = useState({
    labels: Array.from({ length: 24 }, (_, i) => `${i}:00`), // Labels for each hour
    datasets: [
      {
        label: 'Active Users',
        backgroundColor: `rgba(${getStyle('--cui-info-rgb')}, .1)`,
        borderColor: getStyle('--cui-info'),
        pointHoverBackgroundColor: getStyle('--cui-info'),
        borderWidth: 2,
        data: Array(24).fill(0), // Initialize with zero
        fill: true,
      },
      {
        label: 'Pending Users',
        backgroundColor: 'transparent',
        borderColor: getStyle('--cui-success'),
        pointHoverBackgroundColor: getStyle('--cui-success'),
        borderWidth: 2,
        data: Array(24).fill(0), // Initialize with zero
      },
      {
        label: 'Rejected Users',
        backgroundColor: 'transparent',
        borderColor: getStyle('--cui-danger'),
        pointHoverBackgroundColor: getStyle('--cui-danger'),
        borderWidth: 1,
        borderDash: [8, 5],
        data: Array(24).fill(0), // Initialize with zero
      },
    ],
  });



  const fetchData = async () => {
    try {
      const userResponse = await axios.get(`/fetchUserList`);
      const users = userResponse.data.fetchUser || [];
      const usersWithUserId = users.filter(user => user.userId && user.userId.length > 0);
      const totalUsers = usersWithUserId.length;

      const pendingResponse = await axios.get(`/fetch_data`);
      const pendingUsers = pendingResponse.data.data.filter(user => user.status === 'Pending').length;

      const rejectedResponse = await axios.get(`/fetch_data_rejected`);
      const rejectedUsers = rejectedResponse.data.data.filter(user => user.status === 'Rejected').length;

      // Get the current hour (0-23)
      const currentHour = new Date().getHours();

      // Update the chart data by shifting data and adding the new values
      setData(prevData => ({
        ...prevData,
        datasets: prevData.datasets.map((dataset, index) => {
          const updatedData = [...dataset.data];
  
          // Update the current hour's data
          updatedData[currentHour] = index === 0 ? totalUsers : index === 1 ? pendingUsers : rejectedUsers;
  
          return { ...dataset, data: updatedData };
        }),
      }));
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchData(); // Fetch data on initial load
  }, []);

  return (
    <>
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
      <button onClick={fetchData}>Refresh Data</button> {/* Manual refresh button */}
    </>
  );
};

export default MainChart;
