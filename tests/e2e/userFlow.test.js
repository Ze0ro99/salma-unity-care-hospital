const request = require('supertest');
const app = require('../../src/app'); // Adjust the path to your app

describe('User  Flow Tests', () => {
    let userId;
    let authToken;

    beforeAll(async () => {
        // Register a new user
        const response = await request(app)
            .post('/api/users/register')
            .send({
                username: 'testuser',
                password: 'password123',
                email: 'testuser@example.com'
            });
        expect(response.status).toBe(201);
        userId = response.body.userId;

        // Authenticate the user
        const loginResponse = await request(app)
            .post('/api/users/login')
            .send({
                username: 'testuser',
                password: 'password123'
            });
        expect(loginResponse.status).toBe(200);
        authToken = loginResponse.body.token;
    });

    test('Get user profile', async () => {
        const response = await request(app)
            .get(`/api/users/${userId}`)
            .set('Authorization', `Bearer ${authToken}`);
        expect(response.status).toBe(200);
        expect(response.body.username).toBe('testuser');
    });

    afterAll(async () => {
        // Clean up: delete the user
        await request(app)
            .delete(`/api/users/${userId}`)
            .set('Authorization', `Bearer ${authToken}`);
    });
});
