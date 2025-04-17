// Import necessary modules
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const morgan = require('morgan');
const connectDB = require('./config/dbConfig');
const { loadEnvVariables, validateEnvVariables } = require('./config/envConfig');
const { requestLogger, errorLogger } = require('./utils/logger');
const appointmentRoutes = require('./routes/appointmentRoutes'); // Import appointment routes
const userRoutes = require('./routes/userRoutes'); // Import user routes

// Initialize the Express application
const app = express();

// Load and validate environment variables
loadEnvVariables();
validateEnvVariables();

// Connect to the database
connectDB();

// Middleware setup
app.use(cors()); // Enable CORS
app.use(helmet()); // Set security headers
app.use(bodyParser.json()); // Parse JSON request bodies
app.use(bodyParser.urlencoded({ extended: true })); // Parse URL-encoded request bodies
app.use(morgan('combined')); // Log HTTP requests

// Use request logger middleware
app.use(requestLogger);

// Define routes
app.use('/api/appointments', appointmentRoutes); // Appointment routes
app.use('/api/users', userRoutes); // User routes

// Error handling middleware
app.use(errorLogger);

// Global error handler
app.use((err, req, res) => {
    res.status(err.statusCode || 500).json({
        success: false,
        message: err.message || 'Internal Server Error',
    });
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
