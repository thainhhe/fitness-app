import axios from "axios";

const API_URL = "http://192.168.100.140:3001";

const api = axios.create({
  baseURL: API_URL, // Sử dụng API_URL chuẩn
});

export default api;
