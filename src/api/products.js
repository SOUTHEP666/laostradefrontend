import axios from 'axios';

const baseURL = 'https://laosecom.onrender.com/api';

/**
 * 获取商品列表
 */
export const fetchProducts = (params = {}) => {
  return axios.get(`${baseURL}/products`, { params });
};

/**
 * 获取商品详情
 */
export const getProductById = (id) => {
  return axios.get(`${baseURL}/products/${id}`);
};

/**
 * 提交商品评价
 */
export const submitReview = (id, reviewData) => {
  return axios.post(`${baseURL}/products/${id}/review`, reviewData);
};

/**
 * 通过图片上传搜索商品
 */
export const uploadAndSearchByImage = (formData) => {
  return axios.post(`${baseURL}/products/image-search`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};
