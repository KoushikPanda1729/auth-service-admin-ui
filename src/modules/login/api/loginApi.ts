import axiosInstance from "../../../services/api/axios.config";
import type { LoginRequest, LoginResponse, LogoutResponse, JWKSResponse, User } from "./types";
import { AUTH_SERVICE } from "../../../config/apiConfig";

export const loginApi = {
  login: async (credentials: LoginRequest): Promise<LoginResponse> => {
    const response = await axiosInstance.post<LoginResponse>(
      `${AUTH_SERVICE}/auth/login`,
      credentials
    );
    return response.data;
  },

  logout: async (): Promise<LogoutResponse> => {
    const response = await axiosInstance.post<LogoutResponse>(`${AUTH_SERVICE}/auth/logout`);
    return response.data;
  },

  self: async (): Promise<User> => {
    const response = await axiosInstance.get<User>(`${AUTH_SERVICE}/auth/self`);
    return response.data;
  },

  getJWKS: async (): Promise<JWKSResponse> => {
    const response = await axiosInstance.get<JWKSResponse>("/.well-known/jwks.json");
    return response.data;
  },
};
