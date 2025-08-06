// src/utils/axios.js
import axios from "axios";

const instance = axios.create({
  baseURL: "https://laosecom.onrender.com/api", // ✅ 替换为线上后端接口地址
  timeout: 5000,
});

// 请求拦截器
instance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// 响应拦截器
instance.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response && error.response.status === 401) {
      alert("未授权访问，请重新登录");
      localStorage.removeItem("token");
      location.href = "/login";
    } else if (error.response && error.response.data && error.response.data.message) {
      // 显示服务器返回的错误信息
      alert(error.response.data.message);
    } else {
      alert("请求出错，请稍后再试");
    }
    return Promise.reject(error);
  }
);

export default instance;
