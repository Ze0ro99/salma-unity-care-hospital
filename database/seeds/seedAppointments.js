const mongoose = require('mongoose');
const Appointment = require('../models/Appointment'); // Import the Appointment model
const User = require('../models/User'); // Import the User model

// Sample appointment data
const appointments = [
    {
        patientId: null, // To be filled after fetching users
        doctorId: null, // To be filled after fetching users
        date: new Date('2023-10-01T10:00:00Z'),
        reason: 'Routine check-up',
    },
    {
        patientId: null,
        doctorId: null,
        date: new Date('2023-10-02T11:00:00Z'),
        reason: 'Follow-up visit',
    },
    {
        patientId: null,
        doctorId: null,
        date: new Date('2023-10-03T09:00:00Z'),
        reason: 'Consultation for symptoms',
    },
    {
        patientId: null,
        doctorId: null,
        date: new Date('2023-10-04T14:00:00Z'),
        reason: 'Vaccination appointment',
    },
];

// Function to seed appointments
const seedAppointments = async () => {
    const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/salma_unity_care_hospital';
    await mongoose.connect(uri, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });

    try {
        // Clear existing appointments
        await Appointment.deleteMany({});

        // Fetch users to assign patientId and doctorId
        const users = await User.find();
        if (users.length < 2) {
            throw new Error('Not enough users to create appointments. Please seed users first.');
        }

        // Assign patientId and doctorId from the fetched users
        appointments.forEach((appointment, index) => {
            appointment.patientId = users[index % users.length]._id; // Assign patient in a round-robin manner
            appointment.doctorId = users[(index + 1) % users.length]._id; // Assign next user as doctor
        });

        // Insert sample appointments
        const createdAppointments = await Appointment.insertMany(appointments);
        console.log('Appointments seeded successfully:', createdAppointments);
    } catch (error) {
        console.error('Error seeding appointments:', error);
    } finally {
        await mongoose.connection.close();
    }
};

// Run the seed function
seedAppointments().catch(console.error);
