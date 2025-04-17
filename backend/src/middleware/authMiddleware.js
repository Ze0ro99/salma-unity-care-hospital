const jwt = require('jsonwebtoken');
const User = require('../models/User'); // Import the User model

// Middleware to authenticate users
const authMiddleware = async (req, res, next) => {
    // Get the token from the request headers
    const token = req.header('Authorization')?.replace('Bearer ', '');

    // Check if token is not provided
    if (!token) {
        return res.status(401).json({ msg: 'No token, authorization denied' });
    }

    try {
        // Verify the token
        const decoded = jwt.verify(token, process.env.JWT_SECRET); // Use your JWT secret
        req.user = await User.findById(decoded.id).select('-password'); // Fetch user details without password
        next(); // Proceed to the next middleware or route handler
    } catch (err) {
        console.error(err.message);
        return res.status(401).json({ msg: 'Token is not valid' });
    }
};

module.exports = authMiddleware; // Export the middleware
