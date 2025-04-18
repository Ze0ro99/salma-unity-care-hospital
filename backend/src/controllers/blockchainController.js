const { Web3 } = require('web3');
const contractABI = require('../config/medicalRecordContractABI.json');
const web3 = new Web3(process.env.BLOCKCHAIN_NODE_URL);
const winston = require('winston'); // For logging
const express = require('express');
const rateLimit = require('express-rate-limit'); // For rate limiting

// Configure logging
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.Console(),
  ],
});

// Rate limiting middleware
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
});

// Middleware to validate input
const validateInput = (req, res, next) => {
  const { patientId, diagnosis } = req.body;
  if (!patientId || !diagnosis) {
    return res.status(400).json({ error: 'Patient ID and diagnosis are required.' });
  }
  next();
};

const app = express();
app.use(express.json());
app.use(limiter);

exports.storeMedicalRecord = async (req, res) => {
  try {
    const { patientId, diagnosis } = req.body;
    const contract = new web3.eth.Contract(contractABI, process.env.CONTRACT_ADDRESS);
    
    // Log the transaction attempt
    logger.info(`Storing record for patient ID: ${patientId}`);

    const tx = await contract.methods
      .storeRecord(patientId, diagnosis)
      .send({ from: process.env.HOSPITAL_WALLET });

    res.json({ transactionHash: tx.transactionHash });
  } catch (error) {
    logger.error(`Error storing record: ${error.message}`);
    res.status(500).json({ error: 'Failed to store medical record. Please try again later.' });
  }
};

exports.getMedicalRecord = async (req, res) => {
  try {
    const { patientId } = req.query;
    if (!patientId) {
      return res.status(400).json({ error: 'Patient ID is required.' });
    }

    const contract = new web3.eth.Contract(contractABI, process.env.CONTRACT_ADDRESS);
    
    // Log the retrieval attempt
    logger.info(`Retrieving record for patient ID: ${patientId}`);

    const record = await contract.methods.getRecord(patientId).call();
    res.json({ diagnosis: record });
  } catch (error) {
    logger.error(`Error retrieving record: ${error.message}`);
    res.status(500).json({ error: 'Failed to retrieve medical record. Please try again later.' });
  }
};

// Apply input validation middleware
app.post('/store', validateInput, exports.storeMedicalRecord);
app.get('/record', exports.getMedicalRecord);

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  logger.info(`Server is running on port ${PORT}`);
});
