import axios from "axios";
import type { AxiosInstance, AxiosError, InternalAxiosRequestConfig, AxiosResponse } from "axios";
import { getToken } from "../storage/localStorage";
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

let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value?: unknown) => void;
  reject: (reason?: unknown) => void;
}> = [];

const processQueue = (error: AxiosError | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve();
    }
  });

  failedQueue = [];
};

const refreshAccessToken = async (): Promise<{ id: number }> => {
  const response = await axios.post(
    `${API_BASE_URL}/auth/refresh`,
    {},
    {
      withCredentials: true,
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  return response.data;
};

// Request interceptor - add token to requests
axiosInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = getToken();
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error: AxiosError) => {
    throw error;
  }
);

// Response interceptor - handle token refresh on 401
axiosInstance.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    if (error.response?.status === 401 && !originalRequest._retry) {
      // Don't retry refresh endpoint itself
      if (originalRequest.url?.includes("/auth/refresh")) {
        throw error;
      }

      // If already refreshing, queue this request
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then(() => {
            return axiosInstance(originalRequest);
          })
          .catch((err) => {
            throw err;
          });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        await refreshAccessToken();

        // Update token in original request
        const newToken = getToken();
        if (newToken && originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
        }

        // Process queued requests
        processQueue(null);
        isRefreshing = false;

        // Retry original request
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        // Refresh failed - reject all queued requests
        processQueue(refreshError as AxiosError);
        isRefreshing = false;
        throw refreshError;
      }
    }

    // Handle other errors
    if (error.response) {
      const status = error.response.status;
      switch (status) {
        case 401:
          notification.error("Unauthorized. Please login again.");
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

    throw error;
  }
);

export default axiosInstance;
