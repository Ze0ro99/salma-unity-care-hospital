const MedicalRecord = require('../models/MedicalRecord');
const { body, validationResult } = require('express-validator'); // For data validation
const winston = require('winston'); // For logging

// Configure Winston logger
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.Console(),
  ],
});

// Middleware for validating incoming IoT data
const validateIoTData = [
  body('patientId').isInt().withMessage('Patient ID must be an integer'),
  body('heartRate').isFloat({ min: 0 }).withMessage('Heart rate must be a positive number'),
  body('oxygenLevel').isFloat({ min: 0, max: 100 }).withMessage('Oxygen level must be between 0 and 100'),
];

// Function to receive IoT data
exports.receiveIoTData = [
  validateIoTData,
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { patientId, heartRate, oxygenLevel } = req.body;

    try {
      // Create a new medical record asynchronously
      await MedicalRecord.create({
        patientId,
        diagnosis: JSON.stringify({ heartRate, oxygenLevel }),
        createdAt: new Date(),
      });

      logger.info(`Data received for patient ${patientId}: Heart Rate - ${heartRate}, Oxygen Level - ${oxygenLevel}`);
      res.json({ message: 'Data received successfully' });
    } catch (error) {
      logger.error(`Error receiving IoT data: ${error.message}`);
      res.status(500).json({ error: 'An error occurred while processing the data. Please try again later.' });
    }
  },
];
