// src/api.js
import axios from "axios";

// Use Vite environment variable for backend base URL if provided
const BASE_URL = "https://real-state-1-80ov.onrender.com/api";

const api = axios.create({
  baseURL: BASE_URL,
});

export default api;
