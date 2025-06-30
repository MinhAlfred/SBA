import api from "../services/api";

const categoryApiRequests = {
    getCategories: () => api.get('/categories'),
    getCategory:(id) => api.get(`/categories/${id}`),
    createCategory:(body) => api.post('/categories',body),
    updateCategory:(body,id) => api.put(`/categories/${id}`,body),
    deleteCategory:(id) => api.delete(`/categories/${id}`)
}

export default categoryApiRequests;
