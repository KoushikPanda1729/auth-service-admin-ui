import axiosInstance from "../../../services/api/axios.config";
import type {
  GetToppingsParams,
  GetToppingsResponse,
  GetToppingByIdResponse,
  UploadImageResponse,
  CreateToppingRequest,
  CreateToppingResponse,
  UpdateToppingRequest,
  UpdateToppingResponse,
  DeleteToppingResponse,
} from "./types";
import { CATALOG_SERVICE } from "../../../config/apiConfig";

export const toppingsApi = {
  getAll: async (params: GetToppingsParams = {}): Promise<GetToppingsResponse> => {
    const response = await axiosInstance.get<GetToppingsResponse>(`${CATALOG_SERVICE}/toppings`, {
      params: {
        page: params.page || 1,
        limit: params.limit || 10,
        ...(params.search && { search: params.search }),
      },
    });
    return response.data;
  },

  getById: async (toppingId: string): Promise<GetToppingByIdResponse> => {
    const response = await axiosInstance.get<GetToppingByIdResponse>(
      `${CATALOG_SERVICE}/toppings/${toppingId}`
    );
    return response.data;
  },

  uploadImage: async (imageFile: File): Promise<UploadImageResponse> => {
    const formData = new FormData();
    formData.append("image", imageFile);

    const response = await axiosInstance.post<UploadImageResponse>(
      `${CATALOG_SERVICE}/toppings/upload-image`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data;
  },

  create: async (data: CreateToppingRequest): Promise<CreateToppingResponse> => {
    const response = await axiosInstance.post<CreateToppingResponse>(
      `${CATALOG_SERVICE}/toppings`,
      data
    );
    return response.data;
  },

  update: async (toppingId: string, data: UpdateToppingRequest): Promise<UpdateToppingResponse> => {
    const response = await axiosInstance.put<UpdateToppingResponse>(
      `${CATALOG_SERVICE}/toppings/${toppingId}`,
      data
    );
    return response.data;
  },

  delete: async (toppingId: string): Promise<DeleteToppingResponse> => {
    const response = await axiosInstance.delete<DeleteToppingResponse>(
      `${CATALOG_SERVICE}/toppings/${toppingId}`
    );
    return response.data;
  },
};
