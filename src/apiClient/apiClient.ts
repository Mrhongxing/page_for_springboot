import axios from 'axios';

// 从存储中获取 token
const token = localStorage.getItem('token');

// 创建 Axios 实例
const apiClient = axios.create({
  baseURL: 'http://127.0.0.1:8080', // 你的 API 基础 URL
  headers: {
    'Content-Type': 'application/json'
  }
});

// 设置默认的 Authorization 头
if (token) {
  apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  console.log("Token found and set in headers.",token);
}
export default apiClient;