import axiosInstance from "../../../services/api/axios.config";
import type {
  GetUsersParams,
  GetUsersResponse,
  GetUserByIdResponse,
  CreateManagerRequest,
  CreateManagerResponse,
  UpdateUserRequest,
  UpdateUserResponse,
  DeleteUserResponse,
} from "./types";

export const usersApi = {
  getAll: async (params: GetUsersParams): Promise<GetUsersResponse> => {
    const response = await axiosInstance.get<GetUsersResponse>("/users", {
      params: {
        page: params.page,
        limit: params.limit,
      },
    });
    return response.data;
  },

  getById: async (userId: number): Promise<GetUserByIdResponse> => {
    const response = await axiosInstance.get<GetUserByIdResponse>(`/users/${userId}`);
    return response.data;
  },

  createManager: async (data: CreateManagerRequest): Promise<CreateManagerResponse> => {
    const response = await axiosInstance.post<CreateManagerResponse>("/users/create-manager", data);
    return response.data;
  },

  update: async (userId: number, data: UpdateUserRequest): Promise<UpdateUserResponse> => {
    const response = await axiosInstance.patch<UpdateUserResponse>(`/users/${userId}`, data);
    return response.data;
  },

  delete: async (userId: number): Promise<DeleteUserResponse> => {
    const response = await axiosInstance.delete<DeleteUserResponse>(`/users/${userId}`);
    return response.data;
  },
};
