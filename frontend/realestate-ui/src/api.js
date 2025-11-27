// src/api.js
import axios from "axios";

// Use Vite environment variable for backend base URL if provided
const BASE_URL = import.meta.env.VITE_API_BASE_URL;

const api = axios.create({
  baseURL: BASE_URL,
});

export default api;
