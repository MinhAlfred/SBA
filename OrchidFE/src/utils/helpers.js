/**
 * Utility helper functions
 */

/**
 * Debounce a function call
 * @param {Function} func - The function to debounce
 * @param {number} wait - The debounce wait time in milliseconds
 * @returns {Function} - Debounced function
 */
export const debounce = (func, wait = 300) => {
  let timeout;
  
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

/**
 * Generate a random ID
 * @param {number} length - The length of the ID
 * @returns {string} - Random ID
 */
export const generateId = (length = 8) => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  
  return result;
};

/**
 * Deep clone an object
 * @param {Object} obj - The object to clone
 * @returns {Object} - Cloned object
 */
export const deepClone = (obj) => {
  if (obj === null || typeof obj !== 'object') {
    return obj;
  }
  
  return JSON.parse(JSON.stringify(obj));
};

/**
 * Sort an array of objects by a property
 * @param {Array} array - The array to sort
 * @param {string} key - The property to sort by
 * @param {boolean} ascending - Sort in ascending order
 * @returns {Array} - Sorted array
 */
export const sortArrayByProperty = (array, key, ascending = true) => {
  if (!array || !Array.isArray(array) || array.length === 0) {
    return array;
  }
  
  const sortedArray = [...array];
  
  sortedArray.sort((a, b) => {
    if (a[key] < b[key]) return ascending ? -1 : 1;
    if (a[key] > b[key]) return ascending ? 1 : -1;
    return 0;
  });
  
  return sortedArray;
};

/**
 * Group an array of objects by a property
 * @param {Array} array - The array to group
 * @param {string} key - The property to group by
 * @returns {Object} - Grouped object
 */
export const groupByProperty = (array, key) => {
  if (!array || !Array.isArray(array) || array.length === 0) {
    return {};
  }
  
  return array.reduce((result, item) => {
    const groupKey = item[key];
    if (!result[groupKey]) {
      result[groupKey] = [];
    }
    result[groupKey].push(item);
    return result;
  }, {});
};