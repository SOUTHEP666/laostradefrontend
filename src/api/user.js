import axios from "axios";

const API_URL = "/api/user";

export function register(data) {
  return axios.post(`${API_URL}/register`, data);
}

export function login(data) {
  return axios.post(`${API_URL}/login`, data);
}

export function getProfile(token) {
  return axios.get(`${API_URL}/profile`, {
    headers: { Authorization: `Bearer ${token}` },
  });
}

export function updateProfile(data, token) {
  return axios.put(`${API_URL}/profile`, data, {
    headers: { Authorization: `Bearer ${token}` },
  });
}

export function changePassword(data, token) {
  return axios.post(`${API_URL}/change-password`, data, {
    headers: { Authorization: `Bearer ${token}` },
  });
}
