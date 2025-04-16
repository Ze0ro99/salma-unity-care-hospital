import apiService from './apiService';

const authService = {
    // Login method
    login: async (email, password) => {
        try {
            const response = await apiService.login(email, password);
            // Assuming the response contains a token
            const { token } = response;
            localStorage.setItem('authToken', token); // Store token in local storage
            return response; // Return the full response for further use
        } catch (error) {
            throw new Error(error.response?.data?.message || 'Login failed. Please try again.');
        }
    },

    // Logout method
    logout: () => {
        localStorage.removeItem('authToken'); // Remove token from local storage
        // Optionally, you can perform additional cleanup here
    },

    // Check if user is authenticated
    isAuthenticated: () => {
        const token = localStorage.getItem('authToken');
        return !!token; // Return true if token exists, false otherwise
    },

    // Get the current user's information
    getCurrent:User  async () => {
        try {
            const token = localStorage.getItem('authToken');
            if (!token) throw new Error('No token found. User is not authenticated.');

            // Decode the token to get user information (assuming JWT)
            const user = JSON.parse(atob(token.split('.')[1])); // Decode the payload
            return user; // Return user information
        } catch (error) {
            throw new Error('Failed to retrieve user information.');
        }
    },

    // Refresh token method (if applicable)
    refreshToken: async () => {
        try {
            const response = await apiService.refreshToken(); // Call the API to refresh the token
            const { token } = response;
            localStorage.setItem('authToken', token); // Update the token in local storage
            return response; // Return the full response for further use
        } catch (error) {
            throw new Error('Failed to refresh token. Please log in again.');
        }
    },
};

export default authService;
