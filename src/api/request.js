// src/api/request.js
import axios from "axios";
import { ElMessage } from "element-plus";
import router from "@/router";

const baseURL = import.meta.env.DEV
  ? "/api"
  : "https://laosecom.onrender.com/api";

const request = axios.create({
  baseURL,
  timeout: 5000,
});

// 请求拦截器：自动带 token
request.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// 响应拦截器：统一处理错误
request.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response) {
      if (error.response.status === 401) {
        ElMessage.error("登录已过期，请重新登录");
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        router.push("/login");
      } else {
        ElMessage.error(error.response.data.message || "请求出错");
      }
    } else {
      ElMessage.error("网络错误");
    }
    return Promise.reject(error);
  }
);

export default request;
