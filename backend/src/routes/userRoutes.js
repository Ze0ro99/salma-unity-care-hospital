const express = require('express');
const { check } = require('express-validator');
const authMiddleware = require('../middleware/authMiddleware'); // Middleware for authentication
const userController = require('../controllers/userController'); // Import user controller

const router = express.Router();

// @route   POST api/users/register
// @desc    Register a new user
// @access  Public
router.post(
    '/register',
    [
        check('name', 'Name is required').not().isEmpty(),
        check('email', 'Please include a valid email').isEmail(),
        check('password', 'Password must be at least 6 characters').isLength({ min: 6 }),
    ],
    userController.registerUser 
);

// @route   POST api/users/login
// @desc    Login a user
// @access  Public
router.post(
    '/login',
    [
        check('email', 'Please include a valid email').isEmail(),
        check('password', 'Password is required').exists(),
    ],
    userController.loginUser 
);

// @route   GET api/users/me
// @desc    Get current user details
// @access  Private
router.get('/me', authMiddleware, userController.getUser Details);

// @route   PUT api/users/update
// @desc    Update user information
// @access  Private
router.put(
    '/update',
    authMiddleware,
    [
        check('name', 'Name is required').optional().not().isEmpty(),
        check('email', 'Please include a valid email').optional().isEmail(),
    ],
    userController.updateUser 
);

module.exports = router; // Export the router
