// Error handling middleware
const errorMiddleware = (err, req, res, next) => {
    // Log the error for debugging
    console.error(err);

    // Set the response status code based on the error type
    const statusCode = err.statusCode || 500; // Default to 500 if no status code is set

    // Create a standardized error response
    const errorResponse = {
        success: false,
        message: err.message || 'Internal Server Error',
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack }), // Include stack trace in development
    };

    // Send the error response
    res.status(statusCode).json(errorResponse);
};

module.exports = errorMiddleware; // Export the error handling middleware
