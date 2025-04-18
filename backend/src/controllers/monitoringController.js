const promClient = require('prom-client');
const axios = require('axios');
const winston = require('winston'); // For logging
const { WebClient } = require('@slack/web-api'); // For Slack notifications

// Initialize Prometheus metrics collection
const collectDefaultMetrics = promClient.collectDefaultMetrics;
collectDefaultMetrics();

// Initialize logger
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' }),
  ],
});

// Initialize Slack client
const slackClient = new WebClient(process.env.SLACK_TOKEN);

exports.getSystemHealth = async (req, res) => {
  try {
    const metrics = await promClient.register.metrics();
    const anomalyResponse = await axios.post('http://ml-service:5000/detect-anomaly', { metrics });

    if (anomalyResponse.data.isAnomaly) {
      logger.warn('System anomaly detected. Initiating resource optimization.');
      await optimizeResources();
      await notifyAdmin('System anomaly detected. Resources have been optimized.');
    }

    res.json({ status: 'healthy', metrics });
  } catch (error) {
    logger.error(`Error in getSystemHealth: ${error.message}`);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

const optimizeResources = async () => {
  try {
    // Example: Clear Redis cache or scale instance
    await axios.post('http://infra-service:8080/scale-up');
    logger.info('Resources optimized successfully.');
  } catch (error) {
    logger.error(`Error optimizing resources: ${error.message}`);
  }
};

const notifyAdmin = async (message) => {
  try {
    // Send notification via Slack
    await slackClient.chat.postMessage({
      channel: '#alerts', // Replace with your channel
      text: message,
    });
    logger.info('Admin notified successfully via Slack.');
  } catch (error) {
    logger.error(`Error notifying admin: ${error.message}`);
  }
};
