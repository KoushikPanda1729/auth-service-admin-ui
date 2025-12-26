import axiosInstance from "../../../services/api/axios.config";
import type { RegisterRequest, RegisterResponse } from "./types";

export const registerApi = {
  register: async (userData: RegisterRequest): Promise<RegisterResponse> => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { confirmPassword, ...data } = userData;
    const response = await axiosInstance.post<RegisterResponse>("/auth/register", data);
    return response.data;
  },
};
