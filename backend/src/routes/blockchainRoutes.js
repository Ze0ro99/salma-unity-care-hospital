const express = require('express');
const router = express.Router();
const blockchainController = require('../controllers/blockchainController');
const authMiddleware = require('../middleware/authMiddleware');
const { body, validationResult } = require('express-validator');
const rateLimit = require('express-rate-limit');
const logger = require('../middleware/logger'); // Custom logger middleware
require('dotenv').config(); // Load environment variables

// Rate limiting middleware
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per windowMs
    message: 'Too many requests, please try again later.'
});

// Middleware to log requests
router.use(logger);

// Validation rules for medical records
const recordValidationRules = [
    body('patientId').isString().withMessage('Patient ID must be a string'),
    body('recordData').isObject().withMessage('Record data must be an object'),
    // Add more validation rules as needed
];

// POST endpoint to store medical records
router.post('/records', 
    authMiddleware.verifyToken, 
    limiter, 
    recordValidationRules, 
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    },
    blockchainController.storeMedicalRecord
);

// GET endpoint to retrieve medical records
router.get('/records', 
    authMiddleware.verifyToken, 
    limiter, 
    blockchainController.getMedicalRecord
);

// Error handling middleware
router.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Internal Server Error' });
});

module.exports = router;
