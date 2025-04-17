const mongoose = require('mongoose');

// Define the MedicalRecord schema
const medicalRecordSchema = new mongoose.Schema({
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
    medications: [{
        name: {
            type: String,
            required: true,
        },
        dosage: {
            type: String,
            required: true,
        },
        frequency: {
            type: String,
            required: true,
        },
    }],
    notes: {
        type: String,
        trim: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

// Create the MedicalRecord model
const MedicalRecord = mongoose.model('MedicalRecord', medicalRecordSchema);

module.exports = MedicalRecord; // Export the MedicalRecord model
