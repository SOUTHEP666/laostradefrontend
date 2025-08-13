// src/api/orders.js
import axios from 'axios';

const apiClient = axios.create({
  baseURL: '/api/orders',
  headers: {
    'Content-Type': 'application/json',
  },
});

// 需要调用时自动带上token（你也可以用请求拦截器统一注入）
apiClient.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export const fetchSellerOrders = (params) => apiClient.get('/seller', { params });

export const updateOrderShippingStatus = (orderId, data) =>
  apiClient.patch(`/${orderId}/status`, data);
