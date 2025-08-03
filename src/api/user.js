import axios from "axios";

const BASE_URL = "https://laosecom.onrender.com/api/user";

export function register(data) {
  return axios.post(`${BASE_URL}/register`, data);
}

export function login(data) {
  return axios.post(`${BASE_URL}/login`, data);
}

export function getProfile(token) {
  return axios.get(`${BASE_URL}/profile`, {
    headers: { Authorization: `Bearer ${token}` },
  });
}

export function updateProfile(data, token) {
  return axios.put(`${BASE_URL}/profile`, data, {
    headers: { Authorization: `Bearer ${token}` },
  });
}

export function changePassword(data, token) {
  return axios.post(`${BASE_URL}/change-password`, data, {
    headers: { Authorization: `Bearer ${token}` },
  });
}
