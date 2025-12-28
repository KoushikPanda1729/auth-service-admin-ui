import axiosInstance from "../../../services/api/axios.config";
import type { LoginRequest, LoginResponse, RefreshTokenResponse, User } from "./types";

export const loginApi = {
  login: async (credentials: LoginRequest): Promise<LoginResponse> => {
    const response = await axiosInstance.post<LoginResponse>("/auth/login", credentials);
    return response.data;
  },

  logout: async (): Promise<void> => {
    await axiosInstance.post("/auth/logout");
  },

  refreshToken: async (): Promise<RefreshTokenResponse> => {
    const response = await axiosInstance.post<RefreshTokenResponse>("/auth/refresh");
    return response.data;
  },

  self: async (): Promise<User> => {
    const response = await axiosInstance.get<User>("/auth/self");
    return response.data;
  },
};
