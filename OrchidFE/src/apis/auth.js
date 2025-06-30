import api from '../services/api';

/**
 * Authentication API requests
 */
const authApiRequests = {
    login: (body) => api.post('/accounts/login', body),
    register: (body) => api.post('/accounts/register', body),
    getCurrentUser: () => api.get('/accounts/me'),
    getUsers: () => api.get('/accounts'),
    getUser: (id) => api.get(`/accounts/${id}`),
    updateUser: (body, id) => api.put(`/accounts/${id}`, body),
    deleteUser: (id) => api.delete(`/accounts/${id}`)
}

export default authApiRequests;
