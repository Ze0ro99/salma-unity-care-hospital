// Constants used throughout the Salma Unity Care Hospital application

// API Endpoints
export const API_BASE_URL = 'https://api.salmaunitycarehospital.com'; // Base URL for the API
export const API_ENDPOINTS = {
    LOGIN: `${API_BASE_URL}/auth/login`,
    LOGOUT: `${API_BASE_URL}/auth/logout`,
    APPOINTMENTS: `${API_BASE_URL}/appointments`,
    USERS: `${API_BASE_URL}/users`,
    MEDICAL_RECORDS: (patientId) => `${API_BASE_URL}/patients/${patientId}/records`,
    REFRESH_TOKEN: `${API_BASE_URL}/auth/refresh-token`,
};

// Error Messages
export const ERROR_MESSAGES = {
    NETWORK_ERROR: 'Network error. Please check your internet connection.',
    UNAUTHORIZED: 'You are not authorized to perform this action.',
    NOT_FOUND: 'The requested resource was not found.',
    SERVER_ERROR: 'An unexpected error occurred. Please try again later.',
    VALIDATION_ERROR: 'Please check your input and try again.',
};

// Success Messages
export const SUCCESS_MESSAGES = {
    LOGIN_SUCCESS: 'Login successful! Welcome back.',
    LOGOUT_SUCCESS: 'You have been logged out successfully.',
    APPOINTMENT_CREATED: 'Appointment created successfully.',
    APPOINTMENT_UPDATED: 'Appointment updated successfully.',
    APPOINTMENT_DELETED: 'Appointment deleted successfully.',
};

// User Roles
export const USER_ROLES = {
    ADMIN: 'admin',
    DOCTOR: 'doctor',
    NURSE: 'nurse',
    PATIENT: 'patient',
};

// Default Settings
export const DEFAULT_SETTINGS = {
    ITEMS_PER_PAGE: 10, // Default number of items per page for pagination
    DATE_FORMAT: 'YYYY-MM-DD', // Default date format
};

// Other Constants
export const APP_NAME = 'Salma Unity Care Hospital'; // Application name
export const APP_VERSION = '1.0.0'; // Application version
