// Utility functions for Salma Unity Care Hospital

/**
 * Format a date to a readable string
 * @param {string|Date} date - The date to format
 * @param {string} format - The desired format (default: 'YYYY-MM-DD')
 * @returns {string} - Formatted date string
 */
export const formatDate = (date, format = 'YYYY-MM-DD') => {
    const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
    const formattedDate = new Date(date).toLocaleDateString(undefined, options);
    return formattedDate.split('/').reverse().join('-'); // Convert to YYYY-MM-DD
};

/**
 * Validate an email address
 * @param {string} email - The email address to validate
 * @returns {boolean} - True if valid, false otherwise
 */
export const validateEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
};

/**
 * Generate a unique ID
 * @returns {string} - A unique identifier
 */
export const generateUniqueId = () => {
    return 'id-' + Math.random().toString(36).substr(2, 16);
};

/**
 * Capitalize the first letter of a string
 * @param {string} str - The string to capitalize
 * @returns {string} - The capitalized string
 */
export const capitalizeFirstLetter = (str) => {
    if (!str) return '';
    return str.charAt(0).toUpperCase() + str.slice(1);
};

/**
 * Deep clone an object
 * @param {object} obj - The object to clone
 * @returns {object} - A deep clone of the object
 */
export const deepClone = (obj) => {
    return JSON.parse(JSON.stringify(obj));
};

/**
 * Check if a value is empty
 * @param {any} value - The value to check
 * @returns {boolean} - True if empty, false otherwise
 */
export const isEmpty = (value) => {
    if (value == null) return true; // null or undefined
    if (typeof value === 'string' && value.trim() === '') return true; // empty string
    if (Array.isArray(value) && value.length === 0) return true; // empty array
    if (typeof value === 'object' && Object.keys(value).length === 0) return true; // empty object
    return false;
};

/**
 * Format a number as currency
 * @param {number} amount - The amount to format
 * @param {string} currency - The currency symbol (default: '$')
 * @returns {string} - Formatted currency string
 */
export const formatCurrency = (amount, currency = '$') => {
    return `${currency}${parseFloat(amount).toFixed(2)}`;
};
