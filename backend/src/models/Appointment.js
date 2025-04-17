const mongoose = require('mongoose');

// Define the Appointment schema
const appointmentSchema = new mongoose.Schema({
    date: {
        type: Date,
        required: true,
    },
    time: {
        type: String,
        required: true,
    },
    patient: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User ', // Reference to the User model
        required: true,
    },
    doctor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User ', // Reference to the User model
        required: true,
    },
    notes: {
        type: String,
        trim: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

// Create the Appointment model
const Appointment = mongoose.model('Appointment', appointmentSchema);

module.exports = Appointment; // Export the Appointment model
