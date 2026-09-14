import axios from 'axios';

// 从存储中获取 token
const token = localStorage.getItem('token');

// 创建 Axios 实例
const apiClient = axios.create({
  baseURL: window.location.origin,
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