const express = require('express');
const router = express.Router();
const careOrchestrationController = require('../controllers/careOrchestrationController');
const authMiddleware = require('../middleware/authMiddleware');
const rateLimit = require('express-rate-limit');
const { body, validationResult } = require('express-validator');

// Rate limiting middleware to prevent abuse
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: 'Too many requests, please try again later.',
});

// Input validation middleware
const validateInput = [
  body('patientId').isString().withMessage('Patient ID must be a string').notEmpty().withMessage('Patient ID is required'),
];

// Route to orchestrate care
router.post(
  '/orchestrate',
  authMiddleware.verifyToken,
  limiter, // Apply rate limiting
  validateInput, // Apply input validation
  (req, res, next) => {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
  careOrchestrationController.orchestrateCare
);

module.exports = router;
