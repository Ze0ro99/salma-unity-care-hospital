import React, { Suspense, lazy, useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom';
import { I18nextProvider } from 'react-i18next';
import i18n from './i18n'; // Multilingual configuration
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from 'styled-components';
import { GlobalStyles } from './styles/GlobalStyles';
import { lightTheme, darkTheme } from './styles/theme';
import ErrorBoundary from './components/ErrorBoundary';
import Header from './components/Header';
import Footer from './components/Footer';
import Chatbot from './components/Chatbot';
import IoTMonitor from './components/IoTMonitor';
import SystemHealthDashboard from './components/SystemHealthDashboard';
import LoadingSpinner from './components/LoadingSpinner';
import NotificationProvider from './context/NotificationContext';
import './styles/styles.css'; // Global CSS for legacy styles
import { WebSocketProvider } from './context/WebSocketContext'; // New: WebSocket for real-time updates

// Lazy-loaded pages for performance optimization
const HomePage = lazy(() => import('./pages/HomePage'));
const LoginPage = lazy(() => import('./pages/LoginPage'));
const AppointmentsPage = lazy(() => import('./pages/AppointmentsPage'));
const PatientPortalPage = lazy(() => import('./pages/PatientPortalPage'));
const TelehealthPage = lazy(() => import('./pages/TelehealthPage'));
const CarePlanPage = lazy(() => import('./pages/CarePlanPage'));
const DashboardPage = lazy(() => import('./pages/DashboardPage'));
const ARViewer = lazy(() => import('./pages/ARViewer'));
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'));

// Protected Route component for role-based access
const ProtectedRoute = ({ component: Component, roles, ...rest }) => {
  const { user, loading } = useAuth();

  if (loading) return <LoadingSpinner />;
  if (!user) return <Redirect to="/login" />;
  if (roles && !roles.includes(user.role)) {
    return <Redirect to="/not-authorized" />;
  }

  return <Route {...rest} render={(props) => <Component {...props} />} />;
};

// Main App component
const App = () => {
  // Theme state with persistence
  const [theme, setTheme] = useState(() => {
    const savedTheme = localStorage.getItem('theme');
    return savedTheme || 'light';
  });

  // Toggle theme and save to localStorage
  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
  };

  // WebSocket setup for real-time notifications
  useEffect(() => {
    const ws = new WebSocket('ws://backend:5001/notifications');
    ws.onmessage = (event) => {
      const { type, message } = JSON.parse(event.data);
      // Handle notifications (e.g., appointment reminders, IoT alerts)
      console.log(`Notification [${type}]: ${message}`);
    };
    return () => ws.close();
  }, []);

  return (
    <AuthProvider>
      <I18nextProvider i18n={i18n}>
        <ThemeProvider theme={theme === 'light' ? lightTheme : darkTheme}>
          <NotificationProvider>
            <WebSocketProvider>
              <GlobalStyles />
              <Router>
                <ErrorBoundary>
                  <Header toggleTheme={toggleTheme} theme={theme} />
                  <main role="main" aria-label="Main content">
                    <Suspense fallback={<LoadingSpinner />}>
                      <Switch>
                        {/* Public Routes */}
                        <Route path="/" exact component={HomePage} />
                        <Route path="/login" component={LoginPage} />
                        <Route path="/not-authorized" render={() => <NotFoundPage message="Access Denied" />} />

                        {/* Protected Routes */}
                        <ProtectedRoute
                          path="/appointments"
                          component={AppointmentsPage}
                          roles={['patient', 'doctor', 'admin']}
                        />
                        <ProtectedRoute
                          path="/patient-portal"
                          component={PatientPortalPage}
                          roles={['patient']}
                        />
                        <ProtectedRoute
                          path="/telehealth"
                          component={TelehealthPage}
                          roles={['patient', 'doctor']}
                        />
                        <ProtectedRoute
                          path="/care-plan"
                          component={CarePlanPage}
                          roles={['patient', 'doctor']}
                        />
                        <ProtectedRoute
                          path="/dashboard"
                          component={DashboardPage}
                          roles={['doctor', 'admin']}
                        />
                        <ProtectedRoute
                          path="/ar-viewer"
                          component={ARViewer}
                          roles={['patient', 'doctor']}
                        />
                        <ProtectedRoute
                          path="/system-health"
                          component={SystemHealthDashboard}
                          roles={['admin']}
                        />

                        {/* Fallback for 404 */}
                        <Route component={NotFoundPage} />
                      </Switch>
                    </Suspense>
                  </main>
                  <Chatbot /> {/* AI-powered chatbot widget */}
                  <IoTMonitor /> {/* Real-time IoT vital signs monitor */}
                  <Footer />
                </ErrorBoundary>
              </Router>
            </WebSocketProvider>
          </NotificationProvider>
        </ThemeProvider>
      </I18nextProvider>
    </AuthProvider>
  );
};

export default App;
