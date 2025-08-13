// src/api/variants.js
import axios from 'axios';

const apiClient = axios.create({
  baseURL: '/api/variants',
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export const fetchProductVariants = (productId) => apiClient.get(`/product/${productId}/variants`);

export const addVariant = (productId, variantData) =>
  apiClient.post(`/product/${productId}/variants`, variantData);

export const updateVariant = (variantId, variantData) =>
  apiClient.put(`/variants/${variantId}`, variantData);

export const deleteVariant = (variantId) => apiClient.delete(`/variants/${variantId}`);
