// src/api/categories.js
import axios from 'axios';

const baseURL = 'https://laosecom.onrender.com/api';

export const fetchCategories = () => {
  return axios.get(`${baseURL}/categories`);
};
