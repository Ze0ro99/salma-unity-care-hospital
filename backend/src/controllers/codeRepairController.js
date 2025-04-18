const axios = require('axios');
const fs = require('fs').promises;
const path = require('path');
const winston = require('winston'); // For logging

// Configure logging
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.Console(),
  ],
});

// Validate input function
const validateInput = (input) => {
  if (!input.filePath || !input.context) {
    throw new Error('Invalid input: filePath and context are required.');
  }
};

exports.repairCode = async (req, res) => {
  try {
    const { errorLog, filePath } = req.body;
    validateInput({ filePath });

    const code = await fs.readFile(filePath, 'utf8');
    const response = await axios.post('https://api.x.ai/v1/code-repair', {
      code,
      errorLog,
      context: 'salma-unity-care-hospital',
      apiKey: process.env.AI_API_KEY,
    });

    if (!response.data.fixedCode) {
      throw new Error('No fixed code returned from the API.');
    }

    await fs.writeFile(filePath, response.data.fixedCode);
    res.json({ message: 'Code repaired', fixedCode: response.data.fixedCode });
  } catch (error) {
    logger.error(`Repair Code Error: ${error.message}`);
    res.status(500).json({ error: error.message });
  }
};

exports.recoverMissingFile = async (req, res) => {
  try {
    const { filePath, context } = req.body;
    validateInput({ filePath, context });

    const response = await axios.post('https://api.x.ai/v1/generate-file', {
      filePath,
      context,
      apiKey: process.env.AI_API_KEY,
    });

    if (!response.data.generatedCode) {
      throw new Error('No generated code returned from the API.');
    }

    await fs.writeFile(filePath, response.data.generatedCode);
    res.json({ message: 'File recovered', generatedCode: response.data.generatedCode });
  } catch (error) {
    logger.error(`Recover Missing File Error: ${error.message}`);
    res.status(500).json({ error: error.message });
  }
};
