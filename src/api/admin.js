import axios from 'axios';

const apiClient = axios.create({
  baseURL: '/api/admin',
  headers: {
    'Content-Type': 'application/json',
  },
});

function setAuthToken(token) {
  if (token) {
    apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete apiClient.defaults.headers.common['Authorization'];
  }
}

// 管理员、商家、客户列表接口
export const fetchAdmins = (params) => apiClient.get('/admins', { params });
export const fetchMerchants = (params) => apiClient.get('/merchants', { params });
export const fetchCustomers = (params) => apiClient.get('/customers', { params });

// 产品相关接口
export const fetchProducts = (params) => apiClient.get('/products', { params });
export const addProduct = (data) => apiClient.post('/products', data);
export const updateProduct = (id, data) => apiClient.put(`/products/${id}`, data);
export const deleteProduct = (id) => apiClient.delete(`/products/${id}`);
export const toggleProductStatus = (id, is_active) => apiClient.patch(`/products/${id}/status`, { is_active });

// 用户相关接口
export const fetchUsers = (params) => apiClient.get('/users', { params });
export const addUser = (data) => apiClient.post('/users', data);
export const updateUser = (id, data) => apiClient.put(`/users/${id}`, data);
export const deleteUser = (id) => apiClient.delete(`/users/${id}`);
export const toggleUserStatus = (id, is_active) => apiClient.patch(`/users/${id}/status`, { is_active });

// 商店相关接口（假设你有）
export const toggleStoreStatus = (id, is_active) => apiClient.patch(`/stores/${id}/status`, { is_active });

export { setAuthToken };
