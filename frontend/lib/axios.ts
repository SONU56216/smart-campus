import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";
import { API_BASE_URL } from "./constants";

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request Interceptor: Inject JWT token on active outbounds
axiosInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("token");
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor: Wipe local states on expiry or token locks
axiosInstance.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    const originalRequest = error.config;
    
    // Check if error is due to expired or missing JWT
    if (error.response?.status === 401 && originalRequest && !(originalRequest as any)._retry) {
      (originalRequest as any)._retry = true;
      
      if (typeof window !== "undefined") {
        // Clear local credentials on token drop expiry to trigger route guards
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        
        // Soft reload to login screen if they are not already there
        if (!window.location.pathname.startsWith("/login")) {
          window.location.href = `/login?expired=true&redirect=${encodeURIComponent(window.location.pathname)}`;
        }
      }
    }
    
    // Normalize backend error representations so we always stream readable strings
    const errorMessage = 
      (error.response?.data as any)?.message || 
      error.message || 
      "An unexpected protocol communication error occurred.";
      
    const customError = new Error(errorMessage);
    (customError as any).status = error.response?.status;
    (customError as any).data = error.response?.data;
    
    return Promise.reject(customError);
  }
);

export default axiosInstance;
