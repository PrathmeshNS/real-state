// src/api.js
import axios from "axios";

// Use Vite environment variable for backend base URL if provided
const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000/api";

const api = axios.create({
  baseURL: BASE_URL,
});

export default api;
