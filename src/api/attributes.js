// src/api/attributes.js
import axios from 'axios';

const apiClient = axios.create({
  baseURL: '/api/attributes',
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// 管理员获取所有属性
export const fetchAttributes = () => apiClient.get('/attributes');

// 管理员新增属性
export const addAttribute = (attribute_name) =>
  apiClient.post('/attributes', { attribute_name });

// 管理员获取某属性所有值
export const fetchAttributeValues = (attributeId) =>
  apiClient.get(`/attributes/${attributeId}/values`);

// 管理员新增属性值
export const addAttributeValue = (attributeId, value) =>
  apiClient.post(`/attributes/${attributeId}/values`, { value });

// 商家绑定商品属性值
export const bindProductAttribute = (productId, attribute_id, value_id) =>
  apiClient.post(`/product/${productId}/attributes`, { attribute_id, value_id });

// 获取某商品绑定的属性列表
export const fetchProductAttributes = (productId) =>
  apiClient.get(`/product/${productId}/attributes`);
