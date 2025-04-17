const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User'); // Import the User model

// Authentication service class
class AuthService {
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

        return { user: this.sanitizeUser (user), token };
    }

    // Refresh token
    static async refreshToken(token) {
        if (!token) {
            throw new Error('No token provided');
        }

        try {
            // Verify the token
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            const user = await User.findById(decoded.id).select('-password'); // Exclude password

            if (!user) {
                throw new Error('User  not found');
            }

            // Generate a new token
            const newToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

            return { user: this.sanitizeUser (user), token: newToken };
        } catch (err) {
            throw new Error('Invalid token');
        }
    }

    // Sanitize user data (exclude sensitive information)
    static sanitizeUser (user) {
        return {
            id: user._id,
            name: user.name,
            email: user.email,
            // Add any other fields you want to expose
        };
    }
}

module.exports = AuthService; // Export the AuthService class
