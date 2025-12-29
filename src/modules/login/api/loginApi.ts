import axiosInstance from "../../../services/api/axios.config";
import type { LoginRequest, LoginResponse, LogoutResponse, JWKSResponse, User } from "./types";

export const loginApi = {
  login: async (credentials: LoginRequest): Promise<LoginResponse> => {
    const response = await axiosInstance.post<LoginResponse>("/auth/login", credentials);
    return response.data;
  },

  logout: async (): Promise<LogoutResponse> => {
    const response = await axiosInstance.post<LogoutResponse>("/auth/logout");
    return response.data;
  },

  self: async (): Promise<User> => {
    const response = await axiosInstance.get<User>("/auth/self");
    return response.data;
  },

  getJWKS: async (): Promise<JWKSResponse> => {
    const response = await axiosInstance.get<JWKSResponse>("/.well-known/jwks.json");
    return response.data;
  },
};
