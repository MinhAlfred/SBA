/**
 * Utility functions for form validation
 */

/**
 * Validates an email address
 * @param {string} email - The email to validate
 * @returns {boolean} - True if email is valid, false otherwise
 */
export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validates a password meets minimum requirements
 * @param {string} password - The password to validate
 * @returns {boolean} - True if password is valid, false otherwise
 */
export const isValidPassword = (password) => {
  // At least 8 characters, 1 uppercase, 1 lowercase, 1 number
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;
  return passwordRegex.test(password);
};

/**
 * Validates a username meets minimum requirements
 * @param {string} username - The username to validate
 * @returns {boolean} - True if username is valid, false otherwise
 */
export const isValidUsername = (username) => {
  // At least 3 characters, alphanumeric and underscores only
  const usernameRegex = /^[a-zA-Z0-9_]{3,}$/;
  return usernameRegex.test(username);
};

/**
 * Validates a phone number
 * @param {string} phone - The phone number to validate
 * @returns {boolean} - True if phone is valid, false otherwise
 */
export const isValidPhone = (phone) => {
  // Simple validation for demonstration
  const phoneRegex = /^\d{10}$/;
  return phoneRegex.test(phone);
};

/**
 * Validates a price is a positive number
 * @param {number|string} price - The price to validate
 * @returns {boolean} - True if price is valid, false otherwise
 */
export const isValidPrice = (price) => {
  const numPrice = Number(price);
  return !isNaN(numPrice) && numPrice > 0;
};

/**
 * Validates a quantity is a positive integer
 * @param {number|string} quantity - The quantity to validate
 * @returns {boolean} - True if quantity is valid, false otherwise
 */
export const isValidQuantity = (quantity) => {
  const numQuantity = Number(quantity);
  return !isNaN(numQuantity) && Number.isInteger(numQuantity) && numQuantity > 0;
};