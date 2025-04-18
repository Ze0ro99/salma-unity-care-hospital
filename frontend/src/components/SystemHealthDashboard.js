import React, { useEffect, useState } from 'react';
import { useFetch } from '../hooks/useFetch';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend } from 'chart.js';

// Register necessary components for Chart.js
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend);

const SystemHealthDashboard = () => {
  const { data, loading, error } = useFetch('/api/monitoring/health');
  const [chartData, setChartData] = useState({});

  useEffect(() => {
    if (data) {
      setChartData({
        labels: data.metrics?.timestamps || [],
        datasets: [
          {
            label: 'CPU Usage (%)',
            data: data.metrics?.cpu || [],
            borderColor: 'rgba(75, 192, 192, 1)',
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
            fill: true,
            tension: 0.1,
          },
          {
            label: 'Memory Usage (%)',
            data: data.metrics?.memory || [],
            borderColor: 'rgba(255, 99, 132, 1)',
            backgroundColor: 'rgba(255, 99, 132, 0.2)',
            fill: true,
            tension: 0.1,
          },
        ],
      });
    }
  }, [data]);

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: 'auto' }}>
      <h3>System Health Dashboard</h3>
      {loading && <p>Loading...</p>}
      {error && <p style={{ color: 'red' }}>Error fetching data: {error.message}</p>}
      {!loading && !error && (
        <Line
          data={chartData}
          options={{
            responsive: true,
            maintainAspectRatio: false,
            scales: {
              x: {
                title: {
                  display: true,
                  text: 'Time',
                },
              },
              y: {
                title: {
                  display: true,
                  text: 'Usage (%)',
                },
                beginAtZero: true,
              },
            },
            plugins: {
              legend: {
                display: true,
                position: 'top',
              },
              tooltip: {
                callbacks: {
                  label: (context) => {
                    return `${context.dataset.label}: ${context.raw}%`;
                  },
                },
              },
            },
          }}
          height={400}
        />
      )}
    </div>
  );
};

export default SystemHealthDashboard;
