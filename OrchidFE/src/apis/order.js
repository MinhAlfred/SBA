import api from "../services/api";

const orderApiRequests = {
    getOrders: () => api.get('/orders'),
    getOrder:(id) => api.get(`/orders/${id}`),
    createOrder:(body) => api.post('/orders',body),
    updateOrder:(body,id) => api.put(`/orders/${id}`,body),
    deleteOrder:(id) => api.delete(`/orders/${id}`),
    successOrder:(orderId) => api.post(`/orders/success/${orderId}`),
    getUserOrder:() => api.get('/orders/user'),
};

export default orderApiRequests;