const mongoose = require('mongoose');

// Define the appointment schema
const appointmentSchema = new mongoose.Schema({
    patientId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User ', // Reference to the User model
    },
    doctorId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User ', // Reference to the User model
    },
    date: {
        type: Date,
        required: true,
    },
    reason: {
        type: String,
        required: true,
        trim: true,
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

// Create the Appointment model
const Appointment = mongoose.model('Appointment', appointmentSchema);

// Migration function to create the appointments collection
const createAppointmentsCollection = async () => {
    try {
        await Appointment.init(); // Initialize the collection
        console.log('Appointments collection created successfully.');
    } catch (error) {
        console.error('Error creating appointments collection:', error);
    }
};

// Migration function to drop the appointments collection
const dropAppointmentsCollection = async () => {
    try {
        await Appointment.collection.drop();
        console.log('Appointments collection dropped successfully.');
    } catch (error) {
        if (error.message !== 'ns not found') {
            console.error('Error dropping appointments collection:', error);
        } else {
            console.log('Appointments collection does not exist, nothing to drop.');
        }
    }
};

// Export the migration functions
module.exports = {
    createAppointmentsCollection,
    dropAppointmentsCollection,
};
