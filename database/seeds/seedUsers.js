const mongoose = require('mongoose');
const User = require('../models/User'); // Import the User model

// Sample user data
const users = [
    {
        name: 'Alice Smith',
        email: 'alice.smith@example.com',
        password: 'password123', // In a real application, passwords should be hashed
    },
    {
        name: 'Bob Johnson',
        email: 'bob.johnson@example.com',
        password: 'password123',
    },
    {
        name: 'Charlie Brown',
        email: 'charlie.brown@example.com',
        password: 'password123',
    },
    {
        name: 'Diana Prince',
        email: 'diana.prince@example.com',
        password: 'password123',
    },
];

// Function to seed users
const seedUsers = async () => {
    const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/salma_unity_care_hospital';
    await mongoose.connect(uri, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });

    try {
        // Clear existing users
        await User.deleteMany({});

        // Insert sample users
        const createdUsers = await User.insertMany(users);
        console.log('Users seeded successfully:', createdUsers);
    } catch (error) {
        console.error('Error seeding users:', error);
    } finally {
        await mongoose.connection.close();
    }
};

// Run the seed function
seedUsers().catch(console.error);
