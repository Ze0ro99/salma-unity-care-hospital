const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../server'); // Import the main application
const User = require('../models/User'); // Import the User model
const Appointment = require('../models/Appointment'); // Import the Appointment model

// Connect to the test database before running tests
beforeAll(async () => {
    const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/salma_unity_care_hospital_test';
    await mongoose.connect(uri, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });
});

// Clear the database after each test
afterEach(async () => {
    await Appointment.deleteMany({});
    await User.deleteMany({});
});

// Close the database connection after all tests
afterAll(async () => {
    await mongoose.connection.close();
});

// Test suite for appointment controller
describe('Appointment Controller', () => {
    let userToken;

    // Create a user and log in to get a token before running tests
    beforeAll(async () => {
        const user = new User({
            name: 'Alice Smith',
            email: 'alice.smith@example.com',
            password: 'password123',
        });
        await user.save();

        const loginResponse = await request(app)
            .post('/api/users/login')
            .send({
                email: user.email,
                password: 'password123',
            });

        userToken = loginResponse.body.data.token;
    });

    // Test for creating an appointment
    it('should create a new appointment', async () => {
        const appointmentData = {
            patientId: 'somePatientId', // Replace with a valid patient ID
            doctorId: 'someDoctorId', // Replace with a valid doctor ID
            date: '2023-10-01T10:00:00Z',
            reason: 'Routine check-up',
        };

        const response = await request(app)
            .post('/api/appointments')
            .set('Authorization', `Bearer ${userToken}`)
            .send(appointmentData)
            .expect(201);

        expect(response.body.success).toBe(true);
        expect(response.body.data).toHaveProperty('id');
        expect(response.body.data.reason).toBe(appointmentData.reason);
    });

    // Test for getting all appointments
    it('should get all appointments', async () => {
        const appointmentData = {
            patientId: 'somePatientId', // Replace with a valid patient ID
            doctorId: 'someDoctorId', // Replace with a valid doctor ID
            date: '2023-10-01T10:00:00Z',
            reason: 'Routine check-up',
        };

        await request(app)
            .post('/api/appointments')
            .set('Authorization', `Bearer ${userToken}`)
            .send(appointmentData);

        const response = await request(app)
            .get('/api/appointments')
            .set('Authorization', `Bearer ${userToken}`)
            .expect(200);

        expect(response.body.success).toBe(true);
        expect(response.body.data).toBeInstanceOf(Array);
        expect(response.body.data.length).toBeGreaterThan(0);
    });

    // Test for getting a specific appointment
    it('should get a specific appointment by ID', async () => {
        const appointmentData = {
            patientId: 'somePatientId', // Replace with a valid patient ID
            doctorId: 'someDoctorId', // Replace with a valid doctor ID
            date: '2023-10-01T10:00:00Z',
            reason: 'Routine check-up',
        };

        const createdAppointment = await request(app)
            .post('/api/appointments')
            .set('Authorization', `Bearer ${userToken}`)
            .send(appointmentData);

        const appointmentId = createdAppointment.body.data.id;

        const response = await request(app)
            .get(`/api/appointments/${appointmentId}`)
            .set('Authorization', `Bearer ${userToken}`)
            .expect(200);

        expect(response.body.success).toBe(true);
        expect(response.body.data).toHaveProperty('id', appointmentId);
        expect(response.body.data.reason).toBe(appointmentData.reason);
    });

    // Test for getting a non-existent appointment
    it('should return an error for a non-existent appointment', async () => {
        const response = await request(app)
            .get('/api/appointments/nonexistentId')
            .set('Authorization', `Bearer ${userToken}`)
            .expect(404);

 expect(response.body.success).toBe(false);
        expect(response.body.message).toBe('Appointment not found');
    });

    // Test for updating an appointment
    it('should update an existing appointment', async () => {
        const appointmentData = {
            patientId: 'somePatientId', // Replace with a valid patient ID
            doctorId: 'someDoctorId', // Replace with a valid doctor ID
            date: '2023-10-01T10:00:00Z',
            reason: 'Routine check-up',
        };

        const createdAppointment = await request(app)
            .post('/api/appointments')
            .set('Authorization', `Bearer ${userToken}`)
            .send(appointmentData);

        const appointmentId = createdAppointment.body.data.id;

        const updatedData = {
            reason: 'Follow-up check-up',
        };

        const response = await request(app)
            .put(`/api/appointments/${appointmentId}`)
            .set('Authorization', `Bearer ${userToken}`)
            .send(updatedData)
            .expect(200);

        expect(response.body.success).toBe(true);
        expect(response.body.data).toHaveProperty('id', appointmentId);
        expect(response.body.data.reason).toBe(updatedData.reason);
    });

    // Test for deleting an appointment
    it('should delete an existing appointment', async () => {
        const appointmentData = {
            patientId: 'somePatientId', // Replace with a valid patient ID
            doctorId: 'someDoctorId', // Replace with a valid doctor ID
            date: '2023-10-01T10:00:00Z',
            reason: 'Routine check-up',
        };

        const createdAppointment = await request(app)
            .post('/api/appointments')
            .set('Authorization', `Bearer ${userToken}`)
            .send(appointmentData);

        const appointmentId = createdAppointment.body.data.id;

        const response = await request(app)
            .delete(`/api/appointments/${appointmentId}`)
            .set('Authorization', `Bearer ${userToken}`)
            .expect(200);

        expect(response.body.success).toBe(true);
        expect(response.body.message).toBe('Appointment deleted successfully');
    });

    // Test for deleting a non-existent appointment
    it('should return an error for deleting a non-existent appointment', async () => {
        const response = await request(app)
            .delete('/api/appointments/nonexistentId')
            .set('Authorization', `Bearer ${userToken}`)
            .expect(404);

        expect(response.body.success).toBe(false);
        expect(response.body.message).toBe('Appointment not found');
    });
});
