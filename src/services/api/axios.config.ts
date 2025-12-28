import axios from "axios";
import type { AxiosInstance, AxiosError, InternalAxiosRequestConfig, AxiosResponse } from "axios";
import { getToken, removeToken } from "../storage/localStorage";
import { notification } from "../notification/notification";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5501";

const axiosInstance: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

axiosInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = getToken();
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  (error: AxiosError) => {
    if (error.response) {
      const status = error.response.status;
      const requestUrl = error.config?.url || "";

      switch (status) {
        case 401:
          if (!requestUrl.includes("/auth/self")) {
            removeToken();
            notification.error("Session expired. Please login again.");
            window.location.href = "/login";
          }
          break;
        case 403:
          notification.error("You do not have permission to perform this action.");
          break;
        case 404:
          notification.error("Resource not found.");
          break;
        case 500:
          notification.error("Server error. Please try again later.");
          break;
        default:
          notification.error(
            (error.response.data as { message?: string })?.message || "An error occurred."
          );
      }
    } else if (error.request) {
      notification.error("Network error. Please check your connection.");
    } else {
      notification.error("An unexpected error occurred.");
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
