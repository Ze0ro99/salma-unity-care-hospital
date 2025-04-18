const express = require('express');
const router = express.Router();
const codeRepairController = require('../controllers/codeRepairController');
const authMiddleware = require('../middleware/authMiddleware');
const { body, validationResult } = require('express-validator');
const logger = require('../middleware/logger'); // Assuming you have a logger middleware

// Middleware to log requests
router.use(logger);

// Route to repair code
router.post(
  '/repair',
  authMiddleware.verifyToken,
  body('code').isString().notEmpty().withMessage('Code is required'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
  codeRepairController.repairCode
);

// Route to recover missing files
router.post(
  '/recover',
  authMiddleware.verifyToken,
  body('filePath').isString().notEmpty().withMessage('File path is required'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  },
  codeRepairController.recoverMissingFile
);

// Error handling middleware
router.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Internal Server Error', error: err.message });
});

module.exports = router;
