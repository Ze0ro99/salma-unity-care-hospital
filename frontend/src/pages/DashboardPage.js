import React, { useEffect, useState } from 'react';
import './DashboardPage.css'; // Importing CSS for styling
import Header from '../components/Header';
import Footer from '../components/Footer';
import { Bar } from 'react-chartjs-2';
import { useFetch } from '../hooks/useFetch';
import { Spinner } from 'react-bootstrap'; // Assuming you're using react-bootstrap for loading spinner
import 'chart.js/auto'; // Ensure Chart.js is properly imported

const DashboardPage = () => {
    const { data: analytics, error, loading } = useFetch('/api/analytics/health-trends');
    const [chartData, setChartData] = useState({
        labels: [],
        datasets: [
            {
                label: 'Health Trends',
                data: [],
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1,
            },
        ],
    });

    useEffect(() => {
        if (analytics) {
            setChartData({
                labels: analytics.labels || [],
                datasets: [
                    {
                        label: 'Health Trends',
                        data: analytics.values || [],
                        backgroundColor: 'rgba(75, 192, 192, 0.2)',
                        borderColor: 'rgba(75, 192, 192, 1)',
                        borderWidth: 1,
                    },
                ],
            });
        }
    }, [analytics]);

    if (loading) {
        return (
            <div className="loading-container">
                <Spinner animation="border" role="status">
                    <span className="visually-hidden">Loading...</span>
                </Spinner>
            </div>
        );
    }

    if (error) {
        return (
            <div className="error-container">
                <h2>Error fetching data</h2>
                <p>{error.message}</p>
            </div>
        );
    }

    return (
        <div className="dashboard-page">
            <Header />
            <main className="dashboard-content">
                <h1>Dashboard</h1>
                <section className="stats">
                    <div className="stat-card">
                        <h2>Total Patients</h2>
                        <p>150</p>
                    </div>
                    <div className="stat-card">
                        <h2>Appointments Today</h2>
                        <p>25</p>
                    </div>
                    <div className="stat-card">
                        <h2>Doctors Available</h2>
                        <p>10</p>
                    </div>
                    <div className="stat-card">
                        <h2>Emergency Cases</h2>
                        <p>3</p>
                    </div>
                </section>
                <section className="quick-links">
                    <h2>Quick Access</h2>
                    <div className="link-card">
                        <h3><a href="/appointments">Manage Appointments</a></h3>
                    </div>
                    <div className="link-card">
                        <h3><a href="/medical-records">View Medical Records</a></h3>
                    </div>
                    <div className="link-card">
                        <h3><a href="/users">User Management</a></h3>
                    </div>
                </section>
                <section className="chart-section">
                    <h2>Health Analytics</h2>
                    <Bar
                        data={chartData}
                        options={{
                            responsive: true,
                            maintainAspectRatio: false,
                            scales: {
                                y: {
                                    beginAtZero: true,
                                    title: {
                                        display: true,
                                        text: 'Values',
                                    },
                                },
                                x: {
                                    title: {
                                        display: true,
                                        text: 'Time',
                                    },
                                },
                            },
                            plugins: {
                                legend: {
                                    display: true,
                                    position: 'top',
                                },
                                tooltip: {
                                    callbacks: {
                                        label: (tooltipItem) => {
                                            return `${tooltipItem.dataset.label}: ${tooltipItem.raw}`;
                                        },
                                    },
                                },
                            },
                        }}
                    />
                </section>
            </main>
            <Footer />
        </div>
    );
};

export default DashboardPage;
