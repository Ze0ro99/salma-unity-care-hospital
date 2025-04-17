const axios = require('axios');
const express = require('express');
const rateLimit = require('express-rate-limit');
const morgan = require('morgan');
const NodeCache = require('node-cache');
const config = require('config');

const app = express();
app.use(express.json());
app.use(morgan('combined')); // Logging middleware

// Rate limiting middleware
const limiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 100, // Limit each IP to 100 requests per windowMs
});
app.use(limiter);

// Cache for storing responses
const cache = new NodeCache({ stdTTL: 600 }); // Cache for 10 minutes

exports.handleChatbotMessage = async (req, res) => {
  const { message } = req.body;

  // Check if the message is cached
  const cachedResponse = cache.get(message);
  if (cachedResponse) {
    return res.json({ reply: cachedResponse });
  }

  try {
    const aiResponse = await axios.post('https://api.x.ai/v1/chat', {
      prompt: message,
      apiKey: config.get('AI_API_KEY'), // Using config for environment variables
    });

    // Validate response
    if (aiResponse.data && aiResponse.data.response) {
      // Cache the response
      cache.set(message, aiResponse.data.response);
      return res.json({ reply: aiResponse.data.response });
    } else {
      throw new Error('Invalid response from AI');
    }
  } catch (error) {
    console.error('Error processing message:', error.message);
    res.status(500).json({ error: 'Failed to process message', details: error.message });
  }
};

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
