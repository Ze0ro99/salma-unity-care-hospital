const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User'); // Import the User model

// User service class
class UserService {
    // Register a new user
    static async registerUser ({ name, email, password }) {
        // Check if the user already exists
        const existingUser  = await User.findOne({ email });
        if (existingUser ) {
            throw new Error('User  already exists');
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create a new user
        const user = new User({
            name,
            email,
            password: hashedPassword,
        });

        // Save the user to the database
        await user.save();

        return user;
    }

    // Login a user
    static async loginUser (email, password) {
        // Find the user by email
        const user = await User.findOne({ email });
        if (!user) {
            throw new Error('Invalid credentials');
        }

        // Compare the password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            throw new Error('Invalid credentials');
        }

        // Generate a JWT token
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

        return { user, token };
    }

    // Get user details
    static async getUser ById(userId) {
        const user = await User.findById(userId).select('-password'); // Exclude password
        if (!user) {
            throw new Error('User  not found');
        }
        return user;
    }

    // Update user information
    static async updateUser (userId, updateData) {
        const user = await User.findById(userId);
        if (!user) {
            throw new Error('User  not found');
        }

        // Update user fields
        if (updateData.password) {
            updateData.password = await bcrypt.hash(updateData.password, 10); // Hash new password
        }

        Object.assign(user, updateData); // Update user with new data
        await user.save(); // Save changes

        return user;
    }
}

module.exports = UserService; // Export the UserService class
