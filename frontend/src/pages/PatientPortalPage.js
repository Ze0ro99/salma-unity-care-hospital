import React, { useContext, useEffect, useState } from 'react';
import { useFetch } from '../hooks/useFetch';
import { AuthContext } from '../context/AuthContext';
import { Line } from 'react-chartjs-2'; // Assuming you want to visualize data
import './PatientPortalPage.css'; // Importing CSS for styling

const PatientPortalPage = () => {
  const { user } = useContext(AuthContext);
  const { data: appointments, loading: loadingAppointments, error: errorAppointments } = useFetch(`/api/appointments?userId=${user.id}`);
  const { data: medicalRecords, loading: loadingRecords, error: errorRecords } = useFetch(`/api/medical-records?userId=${user.id}`);
  
  const [filteredAppointments, setFilteredAppointments] = useState(appointments);
  const [filteredRecords, setFilteredRecords] = useState(medicalRecords);
  
  useEffect(() => {
    setFilteredAppointments(appointments);
    setFilteredRecords(medicalRecords);
  }, [appointments, medicalRecords]);

  const handleFilterChange = (e) => {
    const filterValue = e.target.value.toLowerCase();
    setFilteredAppointments(appointments.filter(appt => appt.doctor.toLowerCase().includes(filterValue)));
    setFilteredRecords(medicalRecords.filter(record => record.diagnosis.toLowerCase().includes(filterValue)));
  };

  if (loadingAppointments || loadingRecords) return <div>Loading...</div>;
  if (errorAppointments || errorRecords) return <div>Error loading data!</div>;

  // Prepare data for chart visualization
  const chartData = {
    labels: medicalRecords.map(record => record.date),
    datasets: [
      {
        label: 'Diagnosis Over Time',
        data: medicalRecords.map(record => record.diagnosisSeverity), // Assuming severity is a numeric value
        fill: false,
        backgroundColor: 'rgba(75,192,192,0.4)',
        borderColor: 'rgba(75,192,192,1)',
      },
    ],
  };

  return (
    <div className="patient-portal">
      <h2>Welcome, {user.name}</h2>
      <input type="text" placeholder="Filter..." onChange={handleFilterChange} />
      <section>
        <h3>Your Appointments</h3>
        {filteredAppointments.length > 0 ? (
          filteredAppointments.map((appt) => (
            <div key={appt.id} className="appointment-card">
              <p>{appt.date} - {appt.doctor}</p>
            </div>
          ))
        ) : (
          <p>No appointments found.</p>
        )}
      </section>
      <section>
        <h3>Your Medical Records</h3>
        {filteredRecords.length > 0 ? (
          filteredRecords.map((record) => (
            <div key={record.id} className="record-card">
              <p>{record.date} - {record.diagnosis}</p>
            </div>
          ))
        ) : (
          <p>No medical records found.</p>
        )}
      </section>
      <section>
        <h3>Your Medical History</h3>
        <Line data={chartData} />
      </section>
    </div>
  );
};

export default PatientPortalPage;
