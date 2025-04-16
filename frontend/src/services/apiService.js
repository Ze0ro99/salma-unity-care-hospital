import axios from 'axios';

// Create an instance of axios with default settings
const apiClient = axios.create({
    baseURL: 'https://api.salmaunitycarehospital.com', // Replace with your actual API base URL
    timeout: 10000, // Set a timeout for requests
});

// Intercept requests to add authorization token if available
apiClient.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('authToken'); // Retrieve token from local storage
        if (token) {
            config.headers.Authorization = `Bearer ${token}`; // Set the authorization header
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Intercept responses to handle errors globally
apiClient.interceptors.response.use(
    (response) => {
        return response.data; // Return only the data from the response
    },
    (error) => {
        // Handle specific error responses
        if (error.response) {
            const { status, data } = error.response;
            if (status === 401) {
                // Handle unauthorized access (e.g., redirect to login)
                console.error('Unauthorized access - redirecting to login');
                // Optionally, you can redirect to the login page here
            } else {
                console.error(`Error ${status}: ${data.message || 'An error occurred'}`);
            }
        } else {
            console.error('Network error or server not reachable');
        }
        return Promise.reject(error);
    }
);

// API service methods
const apiService = {
    // Example: User login
    login: async (email, password) => {
        const response = await apiClient.post('/auth/login', { email, password });
        return response;
    },

    // Example: Fetch all appointments
    fetchAppointments: async () => {
        const response = await apiClient.get('/appointments');
        return response;
    },

    // Example: Create a new appointment
    createAppointment: async (appointmentData) => {
        const response = await apiClient.post('/appointments', appointmentData);
        return response;
    },

    // Example: Fetch medical records for a specific patient
    fetchMedicalRecords: async (patientId) => {
        const response = await apiClient.get(`/patients/${patientId}/records`);
        return response;
    },

    // Example: Fetch user management data
    fetchUsers: async () => {
        const response = await apiClient.get('/users');
        return response;
    },

    // Example: Logout user
    logout: async () => {
        // Optionally, you can perform any cleanup here
        localStorage.removeItem('authToken'); // Remove token from local storage
        return Promise.resolve(); // Resolve immediately
    },
};

export default apiService;
