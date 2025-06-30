/**
 * Utility functions for formatting data
 */

/**
 * Format a price with currency symbol
 * @param {number} price - The price to format
 * @param {string} currency - The currency symbol (default: $)
 * @returns {string} - Formatted price with currency symbol
 */
export const formatPrice = (price, currency = '$') => {
  if (price === null || price === undefined || isNaN(price)) {
    return `${currency}0.00`;
  }
  
  return `${currency}${Number(price).toFixed(2)}`;
};

/**
 * Format a date to a readable string
 * @param {string|Date} date - The date to format
 * @param {string} locale - The locale to use (default: en-US)
 * @returns {string} - Formatted date string
 */
export const formatDate = (date, locale = 'en-US') => {
  if (!date) return '';
  
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  if (isNaN(dateObj.getTime())) {
    return '';
  }
  
  return dateObj.toLocaleDateString(locale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

/**
 * Truncate a string to a specified length and add ellipsis
 * @param {string} text - The text to truncate
 * @param {number} maxLength - Maximum length before truncation
 * @returns {string} - Truncated text with ellipsis if needed
 */
export const truncateText = (text, maxLength = 100) => {
  if (!text || text.length <= maxLength) {
    return text;
  }
  
  return `${text.substring(0, maxLength)}...`;
};

/**
 * Format a phone number to a readable format
 * @param {string} phone - The phone number to format
 * @returns {string} - Formatted phone number
 */
export const formatPhoneNumber = (phone) => {
  if (!phone || phone.length !== 10) {
    return phone;
  }
  
  return `(${phone.substring(0, 3)}) ${phone.substring(3, 6)}-${phone.substring(6)}`;
};