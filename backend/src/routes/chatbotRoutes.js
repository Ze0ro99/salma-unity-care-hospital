const express = require('express');
const router = express.Router();
const chatbotController = require('../controllers/chatbotController');
const { body, validationResult } = require('express-validator');
const rateLimit = require('express-rate-limit');
const logger = require('../middlewares/logger');

// Rate limiting middleware
const limiter = rateLimit({
    windowMs: 1 * 60 * 1000, // 1 minute
    max: 100, // Limit each IP to 100 requests per windowMs
    message: 'Too many requests, please try again later.'
});

// Input validation middleware
const validateMessage = [
    body('message')
        .isString()
        .notEmpty()
        .withMessage('Message must be a non-empty string.')
];

// Logging middleware
router.use(logger);

// POST route for handling chatbot messages
router.post('/', limiter, validateMessage, (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();
}, chatbotController.handleChatbotMessage);

module.exports = router;
