import React from 'react';
import './HomePage.css'; // Importing CSS for styling
import Header from '../components/Header';
import Footer from '../components/Footer';
import { Link } from 'react-router-dom';

const HomePage = () => {
    return (
        <div className="home-page">
            <Header />
            <main className="main-content">
                <section className="hero">
                    <h1>Welcome to Salma Unity Care Hospital</h1>
                    <p>Your health is our priority. We provide comprehensive healthcare services to ensure your well-being.</p>
                    <Link to="/appointments" className="cta-button">Book an Appointment</Link>
                </section>
                <section className="services">
                    <h2>Our Services</h2>
                    <div className="service-list">
                        <div className="service-item">
                            <h3>General Medicine</h3>
                            <p>Comprehensive care for all your medical needs.</p>
                        </div>
                        <div className="service-item">
                            <h3>Pediatrics</h3>
                            <p>Specialized care for infants, children, and adolescents.</p>
                        </div>
                        <div className="service-item">
                            <h3>Emergency Care</h3>
                            <p>24/7 emergency services for urgent medical situations.</p>
                        </div>
                        <div className="service-item">
                            <h3>Specialized Consultations</h3>
                            <p>Access to specialists for various health conditions.</p>
                        </div>
                    </div>
                </section>
            </main>
            <Footer />
        </div>
    );
};

export default HomePage;
