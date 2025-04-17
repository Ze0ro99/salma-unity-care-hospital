const express = require('express');
const router = express.Router();
const iotController = require('../controllers/iotController');
const { authenticate } = require('../middleware/authMiddleware'); // Middleware for authentication
const { logRequest } = require('../middleware/loggingMiddleware'); // Middleware for logging requests

// Middleware to log incoming requests
router.use(logRequest);

// Route to receive IoT data
router.post('/data', authenticate, iotController.receiveIoTData);

// Export the router
module.exports = router;
