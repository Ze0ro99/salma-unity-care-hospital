const mongoose = require('mongoose');

// Define the medical record schema
const medicalRecordSchema = new mongoose.Schema({
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
    appointmentId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Appointment', // Reference to the Appointment model
    },
    diagnosis: {
        type: String,
        required: true,
        trim: true,
    },
    treatment: {
        type: String,
        required: true,
        trim: true,
    },
    notes: {
        type: String,
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

// Create the MedicalRecord model
const MedicalRecord = mongoose.model('MedicalRecord', medicalRecordSchema);

// Migration function to create the medical records collection
const createMedicalRecordsCollection = async () => {
    try {
        await MedicalRecord.init(); // Initialize the collection
        console.log('Medical Records collection created successfully.');
    } catch (error) {
        console.error('Error creating Medical Records collection:', error);
    }
};

// Migration function to drop the medical records collection
const dropMedicalRecordsCollection = async () => {
    try {
        await MedicalRecord.collection.drop();
        console.log('Medical Records collection dropped successfully.');
    } catch (error) {
        if (error.message !== 'ns not found') {
            console.error('Error dropping Medical Records collection:', error);
        } else {
            console.log('Medical Records collection does not exist, nothing to drop.');
        }
    }
};

// Export the migration functions
module.exports = {
    createMedicalRecordsCollection,
    dropMedicalRecordsCollection,
};
