const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../server'); // Import the main application
const User = require('../models/User'); // Import the User model

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
    await User.deleteMany({});
});

// Close the database connection after all tests
afterAll(async () => {
    await mongoose.connection.close();
});

// Test suite for user controller
describe('User  Controller', () => {
    // Test for user registration
    it('should register a new user', async () => {
        const newUser  = {
            name: 'John Doe',
            email: 'john.doe@example.com',
            password: 'password123',
        };

        const response = await request(app)
            .post('/api/users/register')
            .send(newUser )
            .expect(201);

        expect(response.body.success).toBe(true);
        expect(response.body.data).toHaveProperty('id');
        expect(response.body.data.name).toBe(newUser .name);
        expect(response.body.data.email).toBe(newUser .email);
    });

    // Test for user login
    it('should log in an existing user', async () => {
        const existingUser  = new User({
            name: 'Jane Doe',
            email: 'jane.doe@example.com',
            password: 'password123',
        });
        await existingUser .save();

        const response = await request(app)
            .post('/api/users/login')
            .send({
                email: existingUser .email,
                password: 'password123',
            })
            .expect(200);

        expect(response.body.success).toBe(true);
        expect(response.body.data).toHaveProperty('token');
    });

    // Test for login with invalid credentials
    it('should return an error for invalid login credentials', async () => {
        const response = await request(app)
            .post('/api/users/login')
            .send({
                email: 'nonexistent@example.com',
                password: 'wrongpassword',
            })
            .expect(401);

        expect(response.body.success).toBe(false);
        expect(response.body.message).toBe('Invalid credentials');
    });

    // Test for getting user profile
    it('should get user profile', async () => {
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

        const token = loginResponse.body.data.token;

        const profileResponse = await request(app)
            .get(`/api/users/profile`)
            .set('Authorization', `Bearer ${token}`)
            .expect(200);

        expect(profileResponse.body.success).toBe(true);
        expect(profileResponse.body.data).toHaveProperty('id');
        expect(profileResponse.body.data.name).toBe(user.name);
        expect(profileResponse.body.data.email).toBe(user.email);
    });
});
