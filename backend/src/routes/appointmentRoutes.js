const express = require('express');
const { check } = require('express-validator');
const authMiddleware = require('../middleware/authMiddleware'); // Middleware for authentication
const appointmentController = require('../controllers/appointmentController'); // Import appointment controller

const router = express.Router();

// @route   POST api/appointments
// @desc    Create a new appointment
// @access  Private
router.post(
    '/',
    authMiddleware,
    [
        check('date', 'Date is required').not().isEmpty(),
        check('time', 'Time is required').not().isEmpty(),
        check('patientId', 'Patient ID is required').not().isEmpty(),
        check('doctorId', 'Doctor ID is required').not().isEmpty(),
    ],
    appointmentController.createAppointment
);

// @route   GET api/appointments/patient/:patientId
// @desc    Get all appointments for a specific patient
// @access  Private
router.get('/patient/:patientId', authMiddleware, appointmentController.getAppointmentsByPatient);

// @route   GET api/appointments/doctor/:doctorId
// @desc    Get all appointments for a specific doctor
// @access  Private
router.get('/doctor/:doctorId', authMiddleware, appointmentController.getAppointmentsByDoctor);

// @route   PUT api/appointments/:appointmentId
// @desc    Update an appointment
// @access  Private
router.put(
    '/:appointmentId',
    authMiddleware,
    [
        check('date', 'Date is required').optional().not().isEmpty(),
        check('time', 'Time is required').optional().not().isEmpty(),
        check('notes', 'Notes are optional').optional().trim(),
    ],
    appointmentController.updateAppointment
);

// @route   DELETE api/appointments/:appointmentId
// @desc    Delete an appointment
// @access  Private
router.delete('/:appointmentId', authMiddleware, appointmentController.deleteAppointment);

module.exports = router; // Export the router
