import axios from "axios";

const api = axios.create({
  baseURL: "https://repairgo-h1wz.onrender.com/api",
});

// Automatically attach the saved token (if any) to every request.
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default api;