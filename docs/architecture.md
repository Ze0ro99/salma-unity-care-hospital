# Salma Unity Care Hospital - System Architecture Overview

## Table of Contents

1. [Introduction](#introduction)
2. [Architecture Overview](#architecture-overview)
3. [Component Diagram](#component-diagram)
4. [Frontend Architecture](#frontend-architecture)
5. [Backend Architecture](#backend-architecture)
6. [Database Design](#database-design)
7. [Deployment Architecture](#deployment-architecture)
8. [Security Considerations](#security-considerations)
9. [Conclusion](#conclusion)

## Introduction

The Salma Unity Care Hospital project is designed to provide a comprehensive healthcare solution that is scalable, secure, and user-friendly. This document outlines the architecture of the system, detailing the various components, their interactions, and the technologies employed.

## Architecture Overview

The architecture follows a microservices approach, allowing for independent development, deployment, and scaling of different components. The system is divided into two main parts: the frontend and the backend, with a MongoDB database for data storage.

### Key Components:

- **Frontend**: A React-based web application that provides the user interface for patients and healthcare providers.
- **Backend**: A Node.js and Express-based API that handles business logic, authentication, and data management.
- **Database**: MongoDB is used for storing user data, medical records, and appointment information.
- **Authentication**: JSON Web Tokens (JWT) are used for secure user authentication and authorization.
- **CI/CD**: Continuous Integration and Continuous Deployment pipelines are set up using GitHub Actions and Docker.

## Component Diagram

![Component Diagram](https://via.placeholder.com/800x400?text=Component+Diagram)  
*Note: Replace with an actual diagram illustrating the components and their interactions.*

## Frontend Architecture

The frontend is built using React, leveraging modern JavaScript features and libraries. The architecture includes:

- **Components**: Reusable UI components (e.g., Header, Footer, Modal) that encapsulate specific functionality.
- **Pages**: Each page represents a route in the application (e.g., HomePage, LoginPage, DashboardPage).
- **Services**: API service calls are managed through dedicated service files (e.g., `apiService.js`, `authService.js`).
- **State Management**: React Context API is used for managing global state, particularly for authentication and user data.
- **Routing**: React Router is used for client-side routing, enabling navigation between different pages.

### Frontend Technologies:

- **React**: For building user interfaces.
- **Redux**: For state management (if needed).
- **Axios**: For making HTTP requests to the backend API.
- **CSS Modules**: For scoped and modular styling.

## Backend Architecture

The backend is structured as a RESTful API built with Node.js and Express. Key components include:

- **Controllers**: Handle incoming requests and return responses (e.g., `userController.js`, `appointmentController.js`).
- **Models**: Define the data structure and schema for MongoDB collections (e.g., `User.js`, `Appointment.js`).
- **Routes**: Define the API endpoints and map them to the appropriate controllers (e.g., `userRoutes.js`, `appointmentRoutes.js`).
- **Middleware**: Custom middleware for authentication, error handling, and logging.

### Backend Technologies:

- **Node.js**: JavaScript runtime for building the server.
- **Express**: Web framework for building APIs.
- **MongoDB**: NoSQL database for data storage.
- **Mongoose**: ODM (Object Data Modeling) library for MongoDB.

## Database Design

The database is designed to store various entities related to the hospital management system. Key collections include:

- **Users**: Stores user information, including roles (patient, doctor, admin).
- **Appointments**: Stores appointment details, including patient and doctor references.
- **MedicalRecords**: Stores patient medical history and records.

### Example Schema:

```javascript
// User.js
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['patient', 'doctor', 'admin'], default: 'patient' },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', userSchema);
```

## Deployment Architecture

The application is deployed using Docker containers, allowing for easy scaling and management. The deployment architecture includes:

- ** Docker Compose**: Manages multi-container Docker applications, defining services for the frontend, backend, and database.
- **AWS**: Utilized for hosting the application, ensuring high availability and scalability.
- **Load Balancer**: Distributes incoming traffic across multiple instances of the backend service to optimize resource use and minimize response time.

### Deployment Steps:

1. **Build Docker Images**: Create images for the frontend and backend services.
2. **Run Containers**: Start the application using Docker Compose, ensuring all services are up and running.
3. **Monitor Services**: Use monitoring tools to track the performance and health of the application.

## Security Considerations

Security is a top priority in the Salma Unity Care Hospital project. Key measures include:

- **Data Encryption**: Sensitive data, such as passwords, are hashed using bcrypt before storage.
- **JWT Authentication**: Secure user sessions with JSON Web Tokens, ensuring that only authenticated users can access protected routes.
- **Input Validation**: Implement validation on both frontend and backend to prevent injection attacks and ensure data integrity.
- **CORS**: Configure Cross-Origin Resource Sharing (CORS) to restrict access to the API from unauthorized domains.

## Conclusion

The architecture of the Salma Unity Care Hospital project is designed to be robust, scalable, and secure. By leveraging modern technologies and best practices, the system aims to provide a seamless healthcare experience for users while ensuring data security and integrity. This document serves as a guide for developers and stakeholders to understand the system's design and facilitate future enhancements.
