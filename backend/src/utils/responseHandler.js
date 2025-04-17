// Response handler utility
class ResponseHandler {
    // Success response
    static success(res, data, message = 'Request successful') {
        return res.status(200).json({
            success: true,
            message,
            data,
        });
    }

    // Created response
    static created(res, data, message = 'Resource created successfully') {
        return res.status(201).json({
            success: true,
            message,
            data,
        });
    }

    // Error response
    static error(res, error, message = 'An error occurred') {
        console.error(error); // Log the error for debugging

        return res.status(error.statusCode || 500).json({
            success: false,
            message,
            error: error.message || 'Internal Server Error',
        });
    }

    // Not Found response
    static notFound(res, message = 'Resource not found') {
        return res.status(404).json({
            success: false,
            message,
        });
    }

    // Validation error response
    static validationError(res, errors, message = 'Validation error') {
        return res.status(400).json({
            success: false,
            message,
            errors,
        });
    }
}

module.exports = new ResponseHandler(); // Export an instance of ResponseHandler
