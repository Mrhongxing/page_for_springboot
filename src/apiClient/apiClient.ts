import axios from 'axios';

// 从存储中获取 token
const token = localStorage.getItem('token');

// 创建 Axios 实例
const apiClient = axios.create({
  //baseURL: window.location.origin,
  baseURL: 'http://localhost:8081', // 替换为你的后端 API 地址
  headers: {
    'Content-Type': 'application/json'
  }
});

// 设置默认的 Authorization 头
if (token) {
  apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  console.log("Token found and set in headers.",token);
}

export function setAuthToken(newToken: string | null) {
  if (newToken) {
    apiClient.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
    localStorage.setItem('token', newToken);
    console.log("Token updated and set in headers.", newToken);
  } else {
    delete apiClient.defaults.headers.common['Authorization'];
    localStorage.removeItem('token');
    console.log("Token removed from headers and localStorage.");
  }
}

export default apiClient;