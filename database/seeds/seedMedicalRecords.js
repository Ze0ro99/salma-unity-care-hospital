const mongoose = require('mongoose');
const MedicalRecord = require('../models/MedicalRecord'); // Import the MedicalRecord model
const User = require('../models/User'); // Import the User model
const Appointment = require('../models/Appointment'); // Import the Appointment model

// Sample medical record data
const medicalRecords = [
    {
        patientId: null, // To be filled after fetching users
        doctorId: null, // To be filled after fetching users
        appointmentId: null, // To be filled after fetching appointments
        diagnosis: 'Hypertension',
        treatment: 'Lifestyle changes and medication',
        notes: 'Patient advised to monitor blood pressure regularly.',
    },
    {
        patientId: null,
        doctorId: null,
        appointmentId: null,
        diagnosis: 'Diabetes Type 2',
        treatment: 'Insulin therapy and diet management',
        notes: 'Patient referred to a nutritionist.',
    },
    {
        patientId: null,
        doctorId: null,
        appointmentId: null,
        diagnosis: 'Common Cold',
        treatment: 'Rest and hydration',
        notes: 'Patient advised to take OTC medications as needed.',
    },
    {
        patientId: null,
        doctorId: null,
        appointmentId: null,
        diagnosis: 'Flu',
        treatment: 'Antiviral medication and rest',
        notes: 'Patient advised to stay home and avoid contact with others.',
    },
];

// Function to seed medical records
const seedMedicalRecords = async () => {
    const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/salma_unity_care_hospital';
    await mongoose.connect(uri, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });

    try {
        // Clear existing medical records
        await MedicalRecord.deleteMany({});

        // Fetch users and appointments to assign IDs
        const users = await User.find();
        const appointments = await Appointment.find();

        if (users.length < 2 || appointments.length < 4) {
            throw new Error('Not enough users or appointments to create medical records. Please seed users and appointments first.');
        }

        // Assign patientId, doctorId, and appointmentId from the fetched data
        medicalRecords.forEach((record, index) => {
            record.patientId = users[index % users.length]._id; // Assign patient in a round-robin manner
            record.doctorId = users[(index + 1) % users.length]._id; // Assign next user as doctor
            record.appointmentId = appointments[index % appointments.length]._id; // Assign appointment in a round-robin manner
        });

        // Insert sample medical records
        const createdMedicalRecords = await MedicalRecord.insertMany(medicalRecords);
        console.log('Medical Records seeded successfully:', createdMedicalRecords);
    } catch (error) {
        console.error('Error seeding medical records:', error);
    } finally {
        await mongoose.connection.close();
    }
};

// Run the seed function
seedMedicalRecords().catch(console.error);
