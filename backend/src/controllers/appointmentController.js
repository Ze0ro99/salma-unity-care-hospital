const Appointment = require('../models/Appointment'); // Import the Appointment model
const User = require('../models/User'); // Import the User model
const { validationResult } = require('express-validator'); // For validating request data

// Create a new appointment
exports.createAppointment = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { date, time, patientId, doctorId, notes } = req.body;

    try {
        // Check if the patient exists
        const patient = await User.findById(patientId);
        if (!patient) {
            return res.status(404).json({ msg: 'Patient not found' });
        }

        // Check if the doctor exists
        const doctor = await User.findById(doctorId);
        if (!doctor) {
            return res.status(404).json({ msg: 'Doctor not found' });
        }

        // Create a new appointment
        const appointment = new Appointment({
            date,
            time,
            patient: patientId,
            doctor: doctorId,
            notes,
        });

        await appointment.save();
        res.status(201).json(appointment);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

// Get all appointments for a specific patient
exports.getAppointmentsByPatient = async (req, res) => {
    const { patientId } = req.params;

    try {
        const appointments = await Appointment.find({ patient: patientId }).populate('doctor', 'name email');
        res.json(appointments);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

// Get all appointments for a specific doctor
exports.getAppointmentsByDoctor = async (req, res) => {
    const { doctorId } = req.params;

    try {
        const appointments = await Appointment.find({ doctor: doctorId }).populate('patient', 'name email');
        res.json(appointments);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

// Update an appointment
exports.updateAppointment = async (req, res) => {
    const { appointmentId } = req.params;
    const { date, time, notes } = req.body;

    try {
        const appointment = await Appointment.findById(appointmentId);
        if (!appointment) {
            return res.status(404).json({ msg: 'Appointment not found' });
        }

        // Update appointment fields
        appointment.date = date || appointment.date;
        appointment.time = time || appointment.time;
        appointment.notes = notes || appointment.notes;

        await appointment.save();
        res.json(appointment);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};

// Delete an appointment
exports.deleteAppointment = async (req, res) => {
    const { appointmentId } = req.params;

    try {
        const appointment = await Appointment.findById(appointmentId);
        if (!appointment) {
            return res.status(404).json({ msg: 'Appointment not found' });
        }

        await appointment.remove();
        res.json({ msg: 'Appointment deleted successfully' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
};
