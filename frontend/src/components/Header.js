import React from 'react';
import { Link } from 'react-router-dom';
import './Header.css'; // Importing CSS for styling

const Header = () => {
    return (
        <header className="header">
            <div className="container">
                <h1 className="logo">
                    <Link to="/">Salma Unity Care Hospital</Link>
                </h1>
                <nav className="nav">
                    <ul>
                        <li>
                            <Link to="/appointments">Appointments</Link>
                        </li>
                        <li>
                            <Link to="/medical-records">Medical Records</Link>
                        </li>
                        <li>
                            <Link to="/users">User  Management</Link>
                        </li>
                        <li>
                            <Link to="/profile">Profile</Link>
                        </li>
                        <li>
                            <Link to="/logout">Logout</Link>
                        </li>
                    </ul>
                </nav>
            </div>
        </header>
    );
};

export default Header;
