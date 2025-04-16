import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import AppointmentsPage from './pages/AppointmentsPage';
import NotFoundPage from './pages/NotFoundPage';
import Header from './components/Header';
import Footer from './components/Footer';
import './styles/styles.css'; // Import global styles

const App = () => {
    return (
        <AuthProvider>
            <Router>
                <Header />
                <main>
                    <Switch>
                        <Route path="/" exact component={HomePage} />
                        <Route path="/login" component={LoginPage} />
                        <Route path="/appointments" component={AppointmentsPage} />
                        <Route component={NotFoundPage} /> {/* Fallback for 404 */}
                    </Switch>
                </main>
                <Footer />
            </Router>
        </AuthProvider>
    );
};

export default App;
