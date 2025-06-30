import api from "../services/api";

const orchidApiRequests = {
    getOrchids: () => api.get('/orchids'),
    getAvailableOrchids: () => api.get('/orchids/available'),
    getOrchid:(id) => api.get(`/orchids/${id}`),
    createOrchid:(body) => api.post('/orchids',body),
    updateOrchid:(body,id) => api.put(`/orchids/${id}`,body),
    deleteOrchid:(id) => api.delete(`/orchids/${id}`)
}

export default orchidApiRequests;
