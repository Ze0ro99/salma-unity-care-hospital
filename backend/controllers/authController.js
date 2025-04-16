const User = require('../models/User'); // Import the User model
const bcrypt = require('bcrypt'); // For password hashing
const jwt = require('jsonwebtoken'); // For generating JSON Web Tokens
const { validationResult } = require('express-validator'); // For validating request data

// Login a user
exports.loginUser  = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    try {
        // Check if the user exists
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ msg: 'Invalid credentials' });
        }

        // Check the password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ msg: 'Invalid credentials' });
        }

        // Generate a JWT token
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.json({ token, user: { id: user._id, name: user.name, email: user.email } });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

// Refresh token
exports.refreshToken = async (req, res) => {
    const token = req.body.token;

    if (!token) {
        return res.status(401).json({ msg: 'No token provided' });
    }

    try {
        // Verify the token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.id).select('-password');

        if (!user) {
            return res.status(404).json({ msg: 'User  not found' });
        }

        // Generate a new token
        const newToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.json({ token: newToken, user: { id: user._id, name: user.name, email: user.email } });
    } catch (err) {
        console.error(err.message);
        res.status(401).json({ msg: 'Invalid token' });
    }
};

// Logout user (invalidate token)
exports.logoutUser  = (req, res) => {
    // In a stateless application, you can't invalidate a JWT token directly.
    // However, you can implement a token blacklist or simply inform the client to discard the token.
    res.json({ msg: 'User  logged out successfully' });
};
