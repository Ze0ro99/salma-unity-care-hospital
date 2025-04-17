const fs = require('fs').promises;
const path = require('path');
const express = require('express');
const app = express();

// Middleware for logging requests
app.use((req, res, next) => {
  console.log(`${req.method} request for '${req.url}'`);
  next();
});

// Function to validate the condition parameter
const isValidCondition = (condition) => {
  const validConditions = ['condition1', 'condition2', 'condition3']; // Define valid conditions
  return validConditions.includes(condition);
};

exports.getARContent = async (req, res) => {
  try {
    const { condition } = req.query;

    // Validate the condition parameter
    if (!condition || !isValidCondition(condition)) {
      return res.status(400).json({ error: 'Invalid condition parameter.' });
    }

    const modelPath = path.join(__dirname, 'path/to/models', `${condition}.glb`);

    // Check if the file exists
    await fs.access(modelPath);

    // Set the content type for GLB files
    res.setHeader('Content-Type', 'model/gltf-binary');
    
    // Set caching headers
    res.setHeader('Cache-Control', 'public, max-age=3600'); // Cache for 1 hour

    // Send the file
    res.sendFile(modelPath);
  } catch (error) {
    console.error('Error serving AR content:', error);
    res.status(500).json({ error: 'Internal Server Error', message: error.message });
  }
};

// Example of how to use the function in an Express app
app.get('/ar-content', exports.getARContent);

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
