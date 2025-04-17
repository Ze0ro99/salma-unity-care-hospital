import React, { useEffect, useState } from 'react';
import { useFetch } from '../hooks/useFetch';
import { Line } from 'react-chartjs-2'; // Assuming you have chart.js installed
import Spinner from '../components/Spinner'; // A simple spinner component
import './IoTMonitor.css'; // Custom styles for better responsiveness

const IoTMonitor = ({ patientId }) => {
  const { data, loading, error } = useFetch(`/api/iot/data?patientId=${patientId}`);
  const [heartRateData, setHeartRateData] = useState([]);
  const [oxygenLevelData, setOxygenLevelData] = useState([]);

  useEffect(() => {
    const interval = setInterval(() => {
      // Fetch data every 5 seconds
      useFetch(`/api/iot/data?patientId=${patientId}`);
    }, 5000);

    return () => clearInterval(interval); // Cleanup on unmount
  }, [patientId]);

  useEffect(() => {
    if (data) {
      setHeartRateData(prev => [...prev, data.heartRate]);
      setOxygenLevelData(prev => [...prev, data.oxygenLevel]);
    }
  }, [data]);

  const heartRateChartData = {
    labels: heartRateData.map((_, index) => index + 1),
    datasets: [
      {
        label: 'Heart Rate (bpm)',
        data: heartRateData,
        borderColor: 'rgba(75, 192, 192, 1)',
        fill: false,
      },
    ],
  };

  const oxygenLevelChartData = {
    labels: oxygenLevelData.map((_, index) => index + 1),
    datasets: [
      {
        label: 'Oxygen Level (%)',
        data: oxygenLevelData,
        borderColor: 'rgba(153, 102, 255, 1)',
        fill: false,
      },
    ],
  };

  return (
    <div className="iot-monitor">
      <h3>Real-Time Vital Signs</h3>
      {loading && <Spinner />}
      {error && <p className="error-message">Error fetching data: {error.message}</p>}
      {!loading && !error && (
        <div>
          <p>Heart Rate: {data?.heartRate} bpm</p>
          <p>Oxygen Level: {data?.oxygenLevel}%</p>
          <div className="chart-container">
            <Line data={heartRateChartData} />
            <Line data={oxygenLevelChartData} />
          </div>
        </div>
      )}
    </div>
  );
};

export default IoTMonitor;
