import React from 'react';
import './DashboardPage.css'; // Importing CSS for styling
import Header from '../components/Header';
import Footer from '../components/Footer';

const DashboardPage = () => {
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
                        <h3><a href="/users">User  Management</a></h3>
                    </div>
                </section>
            </main>
            <Footer />
        </div>
    );
};

export default DashboardPage;
