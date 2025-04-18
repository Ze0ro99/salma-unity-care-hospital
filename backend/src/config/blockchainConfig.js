const dotenv = require('dotenv');
const logger = require('./middleware/logger'); // Custom logger middleware

// Load environment variables from .env file
dotenv.config();

// Validate required environment variables
const requiredEnvVars = [
    'BLOCKCHAIN_NODE_URL',
    'CONTRACT_ADDRESS',
    'HOSPITAL_WALLET'
];

const missingEnvVars = requiredEnvVars.filter(varName => !process.env[varName]);

if (missingEnvVars.length > 0) {
    logger.warn(`Missing environment variables: ${missingEnvVars.join(', ')}`);
}

const config = {
    nodeUrl: process.env.BLOCKCHAIN_NODE_URL || 'http://localhost:8545', // Default to local node
    contractAddress: process.env.CONTRACT_ADDRESS || '0x0000000000000000000000000000000000000000', // Default to a zero address
    hospitalWallet: process.env.HOSPITAL_WALLET || '0x0000000000000000000000000000000000000000', // Default to a zero address
    network: process.env.NETWORK || 'development', // Optional network configuration
    apiVersion: process.env.API_VERSION || '1.0', // Optional API version
};

module.exports = config;
