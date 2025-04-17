const request = require('supertest');
const app = require('../../src/app'); // Adjust the path to your app

describe('Appointment Flow Tests', () => {
    let authToken;
    let appointmentId;

    beforeAll(async () => {
        // Authenticate a user to get a token
        const loginResponse = await request(app)
            .post('/api/users/login')
            .send({
                username: 'testuser',
                password: 'password123'
            });
        authToken = loginResponse.body.token;
    });

    test('Create an appointment', async () => {
        const response = await request(app)
            .post('/api/appointments')
            .set('Authorization', `Bearer ${authToken}`)
            .send({
                date: '2023-10-01T10:00:00Z',
                doctorId: 'doctor123',
                patientId: 'patient123',
                reason: 'Check-up'
            });
        expect(response.status).toBe(201);
        appointmentId = response.body.appointmentId;
    });

    test('Get appointment details', async () => {
const response = await request(app)
            .get(`/api/appointments/${appointmentId}`)
            .set('Authorization', `Bearer ${authToken}`);
        expect(response.status).toBe(200);
        expect(response.body.reason).toBe('Check-up');
    });

    test('Delete an appointment', async () => {
        const response = await request(app)
            .delete(`/api/appointments/${appointmentId}`)
            .set('Authorization', `Bearer ${authToken}`);
        expect(response.status).toBe(200);
        expect(response.body.message).toBe('Appointment deleted successfully');
    });

    afterAll(async () => {
        // Clean up: any additional cleanup if necessary
    });
});
