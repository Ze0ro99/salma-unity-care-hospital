const winston = require('winston');

// Create a logger instance
const logger = winston.createLogger({
    level: 'info', // Default logging level
    format: winston.format.combine(
        winston.format.timestamp(), // Add timestamp to logs
        winston.format.json() // Log in JSON format
    ),
    transports: [
        // Console transport for logging to the console
        new winston.transports.Console({
            format: winston.format.combine(
                winston.format.colorize(), // Colorize console output
                winston.format.simple() // Log in a simple format
            ),
        }),
        // File transport for logging to a file
        new winston.transports.File({
            filename: 'logs/error.log', // Log file for errors
            level: 'error', // Only log error level messages
            format: winston.format.json(),
        }),
        new winston.transports.File({
            filename: 'logs/combined.log', // Log file for all messages
            format: winston.format.json(),
        }),
    ],
});

// Middleware for logging requests
const requestLogger = (req, res, next) => {
    logger.info(`HTTP ${req.method} ${req.url} - ${req.ip}`);
    next(); // Proceed to the next middleware or route handler
};

// Error logging function
const errorLogger = (err, req, res, next) => {
    logger.error(`Error: ${err.message} - ${req.method} ${req.url} - ${req.ip}`);
    next(err); // Pass the error to the next error handling middleware
};

// Export the logger and middleware
module.exports = {
    logger,
    requestLogger,
    errorLogger,
};
