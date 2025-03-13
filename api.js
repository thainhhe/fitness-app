import axios from "axios";

const API_URL = "http://192.168.100.140:3001";

// 192.168.1.4 nhà
// 192.168.100.140 trọ

const api = axios.create({
  baseURL: API_URL, // Sử dụng API_URL chuẩn
});

export default api;
