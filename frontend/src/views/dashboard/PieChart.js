import React from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, Title, Tooltip, Legend, ArcElement, CategoryScale, LinearScale } from 'chart.js';

// Register required components of Chart.js
ChartJS.register(Title, Tooltip, Legend, ArcElement, CategoryScale, LinearScale);

const PieChart = ({ data }) => {
  const chartData = {
    labels: ['Pending', 'Rejected', 'Blocked'], // Labels for the sections
    datasets: [
      {
        data: [data.pending, data.rejected, data.blocked], // Data for the chart
        backgroundColor: ['#36A2EB', '#FF6384', '#FFCD56'], // Colors for the sections
        hoverOffset: 4, // Hover effect offset
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top', // Position of the legend
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            const label = context.label || '';
            const value = context.raw;
            return `${label}: ${value} Users`;
          },
        },
      },
    },
  };

  return <Pie data={chartData} options={options} />;
};

export default PieChart;
