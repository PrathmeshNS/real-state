// src/api.js
import axios from "axios";

const api = axios.create({
  baseURL: "https://real-state-1-80ov.onrender.com/api", // or http://localhost:8000/api
});

export default api;
