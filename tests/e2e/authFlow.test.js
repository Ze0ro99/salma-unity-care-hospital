const request = require('supertest');
const app = require('../../src/app'); // Adjust the path to your app

describe('Authentication Flow Tests', () => {
    let authToken;

    test('User  registration', async () => {
        const response = await request(app)
            .post('/api/users/register')
            .send({
                username: 'authuser',
                password: 'securepassword',
                email: 'authuser@example.com'
            });
        expect(response.status).toBe(201);
    });

    test('User  login', async () => {
        const response = await request(app)
            .post('/api/users/login')
            .send({
                username: 'authuser',
                password: 'securepassword'
            });
        expect(response.status).toBe(200);
        expect(response.body.token).toBeDefined();
        authToken = response.body.token;
    });

    test('User  logout', async () => {
        const response = await request(app)
            .post('/api/users/logout')
            .set('Authorization', `Bearer ${authToken}`);
        expect(response.status).toBe(200);
        expect(response.body.message).toBe('Logged out successfully');
    });

    afterAll(async () => {
        // Clean up: delete the user
        await request(app)
            .delete('/api/users/authuser')
            .set('Authorization', `Bearer ${authToken}`);
    });
});
