const mongoose = require('mongoose');

// Define the user schema
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
    },
    password: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    },
});

// Create the User model
const User = mongoose.model('User ', userSchema);

// Migration function to create the users collection
const createUsersCollection = async () => {
    try {
        await User.init(); // Initialize the collection
        console.log('Users collection created successfully.');
    } catch (error) {
        console.error('Error creating users collection:', error);
    }
};

// Migration function to drop the users collection
const dropUsersCollection = async () => {
    try {
        await User.collection.drop();
        console.log('Users collection dropped successfully.');
    } catch (error) {
        if (error.message !== 'ns not found') {
            console.error('Error dropping users collection:', error);
        } else {
            console.log('Users collection does not exist, nothing to drop.');
        }
    }
};

// Export the migration functions
module.exports = {
    createUsersCollection,
    dropUsersCollection,
};
