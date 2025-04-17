const mongoose = require('mongoose');

// Database configuration function
const connectDB = async () => {
    try {
        // MongoDB connection string
        const dbURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/salma_unity_care_hospital';

        // Connect to MongoDB
        await mongoose.connect(dbURI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true,
            useFindAndModify: false,
        });

        console.log('MongoDB connected successfully');
    } catch (error) {
        console.error('MongoDB connection error:', error.message);
        process.exit(1); // Exit the process with failure
    }
};

module.exports = connectDB; // Export the connectDB function
