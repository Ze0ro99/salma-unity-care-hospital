const express = require('express');
const router = express.Router();
const monitoringController = require('../controllers/monitoringController');
const authMiddleware = require('../middleware/authMiddleware');
const rateLimit = require('express-rate-limit');
const morgan = require('morgan');
const cache = require('express-cache-response-directive');

// Middleware for logging requests
router.use(morgan('combined'));

// Rate limiting middleware to limit requests to the health endpoint
const limiter = rateLimit({
    windowMs: 1 * 60 * 1000, // 1 minute
    max: 10, // Limit each IP to 10 requests per windowMs
    message: 'Too many requests, please try again later.'
});

// Health check route with caching and rate limiting
router.get('/health', authMiddleware.verifyToken, limiter, cache({
    // Cache the response for 30 seconds
    maxAge: '30s',
    // Allow caching of the response
    public: true
}), async (req, res) => {
    try {
        const healthStatus = await monitoringController.getSystemHealth();
        res.status(200).json({
            status: 'success',
            data: healthStatus
        });
    } catch (error) {
        console.error('Health check error:', error);
        res.status(500).json({
            status: 'error',
            message: 'Internal Server Error',
            error: error.message
        });
    }
});

module.exports = router;
