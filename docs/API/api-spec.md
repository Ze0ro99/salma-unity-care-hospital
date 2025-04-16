# Salma Unity Care Hospital API Specifications

## Table of Contents

1. [Introduction](#introduction)
2. [Base URL](#base-url)
3. [Authentication](#authentication)
4. [Endpoints](#endpoints)
   - [User Endpoints](#user-endpoints)
   - [Appointment Endpoints](#appointment-endpoints)
   - [Medical Record Endpoints](#medical-record-endpoints)
5. [Request and Response Formats](#request-and-response-formats)
6. [Error Handling](#error-handling)
7. [Rate Limiting](#rate-limiting)
8. [Conclusion](#conclusion)

## Introduction

The Salma Unity Care Hospital API provides a set of endpoints for managing users, appointments, and medical records. This API is designed to be secure, efficient, and easy to use, enabling developers to integrate with the hospital management system seamlessly.

## Base URL

The base URL for the API is:

```
https://api.salmaunitycarehospital.com/v1
```

## Authentication

All API requests require authentication using JSON Web Tokens (JWT). To obtain a token, users must log in with their credentials.

### Login Endpoint

- **POST** `/auth/login`
  
**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "yourpassword"
}
```

**Response:**
```json
{
  "token": "your_jwt_token",
  "user": {
    "id": "user_id",
    "name": "User Name",
    "email": "user@example.com",
    "role": "patient" // or "doctor", "admin"
  }
}
```

## Endpoints

### User Endpoints

#### 1. Create User

- **POST** `/users`

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john.doe@example.com",
  "password": "securepassword",
  "role": "patient" // or "doctor", "admin"
}
```

**Response:**
```json
{
  "message": "User created successfully",
  "user": {
    "id": "user_id",
    "name": "John Doe",
    "email": "john.doe@example.com",
    "role": "patient"
  }
}
```

#### 2. Get User by ID

- **GET** `/users/{id}`

**Response:**
```json
{
  "id": "user_id",
  "name": "John Doe",
  "email": "john.doe@example.com",
  "role": "patient"
}
```

#### 3. Update User

- **PUT** `/users/{id}`

**Request Body:**
```json
{
  "name": "John Doe Updated",
  "email": "john.doe.updated@example.com"
}
```

**Response:**
```json
{
  "message": "User updated successfully"
}
```

#### 4. Delete User

- **DELETE** `/users/{id}`

**Response:**
```json
{
  "message": "User deleted successfully"
}
```

### Appointment Endpoints

#### 1. Create Appointment

- **POST** `/appointments`

**Request Body:**
```json
{
  "patientId": "user_id",
  "doctorId": "doctor_id",
  "date": "2023-10-01T10:00:00Z",
  "reason": "Routine check-up"
}
```

**Response:**
```json
{
  "message": "Appointment created successfully",
  "appointment": {
    "id": "appointment_id",
    "patientId": "user_id",
    "doctorId": "doctor_id",
    "date": "2023-10-01T10:00:00Z",
    "reason": "Routine check-up"
  }
}
```

#### 2. Get Appointments for User

- **GET** `/appointments/user/{userId}`

**Response:**
```json
[
  {
    "id": "appointment_id",
    "patientId": "user_id",
    "doctorId": "doctor_id",
    "date": "2023-10-01T10:00:00Z",
    "reason": "Routine check-up"
  }
]
```

#### 3. Update Appointment

- **PUT** `/appointments/{id}`

**Request Body:**
```json
{
  "date": "2023-10-02T10:00:00Z",
  "reason": "Follow-up check-up"
}
```

**Response:**
```json
{
  "message": "Appointment updated successfully"
}
```

#### 4. Delete Appointment

- **DELETE** `/appointments/{id}`

**Response:**
```json
{
  "message": "Appointment deleted successfully"
}
```

### Medical Record Endpoints

#### 1. Create Medical Record

- **POST** `/medical-records`

**Request Body:**
```json
{
  "patientId": "user_id",
  "records": [
    {
      "date": "2023-09-15",
      "description": "Initial consultation",
      "notes": "Patient is in good health."
    }
  ]
}
```

**Response:**
```json
{
  "message": "Medical record created successfully",
  "record": {
    "id": "record_id",
    "patientId": "user_id",
    "records": [
      {
        "date": "2023-09-15",
        "description": "Initial consultation",
        "notes": "Patient is in good health."
      }
    ]
  }
}
```

#### 2. Get Medical Records for User

- **GET** `/medical-records/user/{userId}`

**Response:**
```json
[
  {
    "id": "record_id",
    "patientId": "user_id",
    "records": [
      {
        "date": "2023-09-15",
        "description": "Initial consultation",
        "notes": "Patient is in good health."
      }
    ]
  }
]
```

#### 3. Update Medical Record

- **PUT** `/medical-records/{id}`

**Request Body:**
```json
{
  "records": [
    {
      "date": "2023-09-20",
      "description": "Follow-up visit",
      "notes": "Patient reports improvement."
    }
  ]
}
```

**Response:**
```json
{
  "message": "Medical record updated successfully"
}
```

#### 4. Delete Medical Record

- **DELETE** `/medical-records/{id}`

**Response:**
```json
{
  "message": "Medical record deleted successfully"
}
```

## Request and Response Formats

All requests and responses are in JSON format. Ensure that the `Content-Type` header is set to `application/json` for all requests.

## Error Handling

The API uses standard HTTP status codes to indicate the success or failure of requests. Common error responses include:

- **400 Bad Request**: Invalid request format or missing required fields.
- **401 Unauthorized**: Authentication failed or token is missing/invalid.
- **404 Not Found**: Requested resource does not exist.
- **500 Internal Server Error**: An unexpected error occurred on the server.

### Example Error Response:
```json
{
  "error": {
    "code": 400,
    "message": "Invalid email or password"
  }
}
```

## Rate Limiting

To ensure fair usage and prevent abuse, the API implements rate limiting. Each user is allowed a maximum of 100 requests per hour. Exceeding this limit will result in a `429 Too Many Requests` response.

## Conclusion

The Salma Unity Care Hospital API is designed to provide a robust and secure interface for managing healthcare-related data. This document serves as a comprehensive guide for developers to understand the API's capabilities and how to interact with it effectively.
