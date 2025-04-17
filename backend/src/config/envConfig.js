const dotenv = require('dotenv');

// Load environment variables from .env file
const loadEnvVariables = () => {
    const result = dotenv.config();

    if (result.error) {
        throw new Error('Failed to load environment variables: ' + result.error.message);
    }

    console.log('Environment variables loaded successfully');
};

// Validate required environment variables
const validateEnvVariables = () => {
    const requiredVariables = [
        'PORT',
        'MONGODB_URI',
        'JWT_SECRET',
        'NODE_ENV',
        // Add any other required environment variables here
    ];

    requiredVariables.forEach((variable) => {
        if (!process.env[variable]) {
            throw new Error(`Missing required environment variable: ${variable}`);
        }
    });

    console.log('All required environment variables are set');
};

// Export the functions
module.exports = {
    loadEnvVariables,
    validateEnvVariables,
};
