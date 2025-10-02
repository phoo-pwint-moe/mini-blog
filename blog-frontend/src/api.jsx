import axios from "axios";
import { Navigate, useNavigate } from "react-router-dom";
const api = axios.create({
  baseURL: "http://localhost:4000",

});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token"); 
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const navigate = useNavigate();
    if (error.response?.status === 401) {
      console.error("Unauthorized, redirecting to login...");
      navigate('/login')
    }
    return Promise.reject(error);
  }
);

export default api;
