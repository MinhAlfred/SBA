// Routes
export const ROUTES = {
  HOME: '/view',
  LOGIN: '/login',
  REGISTER: '/register',
  ORCHID_LIST: '/home',
  ORCHID_DETAIL: '/detail',
  EMPLOYEE_LIST: '/orchids',
  EDIT_ORCHID: '/edit',
  USER_MANAGEMENT: '/users',
  CATEGORY_MANAGEMENT: '/categories',
  ROLE_MANAGEMENT: '/roles',
  ORDER_MANAGEMENT: '/orders',
  CART: '/cart'
};

// User roles
export const USER_ROLES = {
  ADMIN: 'Admin',
  USER: 'User'
};

// For backward compatibility
export const ROLES = USER_ROLES;

// Local storage keys
export const STORAGE_KEYS = {
  USER: 'user',
  CART: 'cart'
};

// API endpoints
export const API_ENDPOINTS = {
  ORCHIDS: '/',
  ORCHID_BY_ID: (id) => `/${id}`,
};

// Form validation messages
export const VALIDATION_MESSAGES = {
  REQUIRED: 'This field is required',
  EMAIL_INVALID: 'Invalid email address',
  VALID_EMAIL: 'Please enter a valid email address',
  PASSWORD_MIN_LENGTH: 'Password must be at least 6 characters',
  USERNAME_MIN_LENGTH: 'Username must be at least 3 characters',
  PASSWORDS_MUST_MATCH: 'Passwords must match',
  USERNAME_EXISTS: 'Username already exists',
  PRICE_MIN: 'Price must be greater than 0',
  QUANTITY_MIN: 'Quantity must be at least 1',
  VALID_URL: 'Please enter a valid URL',
  PHONE_FORMAT: 'Please enter a valid 10-digit phone number'
};

export const COLOR = {
  GREEN: '#009873'
}