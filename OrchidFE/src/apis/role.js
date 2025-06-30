import api from '../services/api';

const roleApiRequests = {
    getRoles: () => api.get('/roles'),
    getRole:(id) => api.get(`/roles/${id}`),
    createRole:(body) => api.post('/roles',body),
    updateRole:(body,id) => api.put(`/roles/${id}`,body),
    deleteRole:(id) => api.delete(`/roles/${id}`)
}

export default roleApiRequests;