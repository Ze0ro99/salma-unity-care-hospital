const express = require('express');
const { check } = require('express-validator');
const authMiddleware = require('../middleware/authMiddleware'); // Middleware for authentication
const authController = require('../controllers/authController'); // Import auth controller

const router = express.Router();

// @route   POST api/auth/login
// @desc    Login a user
// @access  Public
router.post(
    '/login',
    [
        check('email', 'Please include a valid email').isEmail(),
        check('password', 'Password is required').exists(),
    ],
    authController.loginUser 
);

// @route   POST api/auth/refresh-token
// @desc    Refresh token
// @access  Public
router.post('/refresh-token', authController.refreshToken);

// @route   POST api/auth/logout
// @desc    Logout a user
// @access  Private
router.post('/logout', authMiddleware, authController.logoutUser);

module.exports = router; // Export the router
