const { Sequelize } = require('sequelize');
const Appointment = require('../models/Appointment');
const axios = require('axios'); // For making HTTP requests

// Function to fetch health trends
exports.getHealthTrends = async (req, res) => {
  const { startDate, endDate, limit = 10, offset = 0 } = req.query; // Pagination and date filtering

  try {
    // Fetch trends from the database
    const trends = await Appointment.findAll({
      attributes: [
        [Sequelize.fn('DATE', Sequelize.col('date')), 'date'],
        [Sequelize.fn('COUNT', Sequelize.col('id')), 'count'],
      ],
      where: {
        ...(startDate && { date: { [Sequelize.Op.gte]: new Date(startDate) } }),
        ...(endDate && { date: { [Sequelize.Op.lte]: new Date(endDate) } }),
      },
      group: ['date'],
      limit: parseInt(limit, 10),
      offset: parseInt(offset, 10),
    });

    // Prepare data for response
    const labels = trends.map(t => t.date);
    const values = trends.map(t => t.count);

    // Call ML API for predictions
    const predictionResponse = await axios.post('http://your-ml-api/predict', { labels, values });
    const predictions = predictionResponse.data;

    // Send response
    res.json({ labels, values, predictions });
  } catch (error) {
    console.error('Error fetching health trends:', error); // Log the error for debugging
    res.status(500).json({ error: 'An error occurred while fetching health trends. Please try again later.' });
  }
};
