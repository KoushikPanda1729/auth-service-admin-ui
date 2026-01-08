import axiosInstance from "../../../services/api/axios.config";
import type {
  GetCategoriesParams,
  GetCategoriesResponse,
  GetCategoryByIdResponse,
  CreateCategoryRequest,
  CreateCategoryResponse,
  UpdateCategoryRequest,
  UpdateCategoryResponse,
  DeleteCategoryResponse,
} from "./types";
import { CATALOG_SERVICE } from "../../../config/apiConfig";

export const categoriesApi = {
  getAll: async (params: GetCategoriesParams = {}): Promise<GetCategoriesResponse> => {
    const response = await axiosInstance.get<GetCategoriesResponse>(
      `${CATALOG_SERVICE}/categories`,
      {
        params: {
          page: params.page || 1,
          limit: params.limit || 10,
          ...(params.search && { q: params.search }),
        },
      }
    );
    return response.data;
  },

  getById: async (categoryId: string): Promise<GetCategoryByIdResponse> => {
    const response = await axiosInstance.get<GetCategoryByIdResponse>(
      `${CATALOG_SERVICE}/categories/${categoryId}`
    );
    return response.data;
  },

  create: async (data: CreateCategoryRequest): Promise<CreateCategoryResponse> => {
    const response = await axiosInstance.post<CreateCategoryResponse>(
      `${CATALOG_SERVICE}/categories`,
      data
    );
    return response.data;
  },

  update: async (
    categoryId: string,
    data: UpdateCategoryRequest
  ): Promise<UpdateCategoryResponse> => {
    const response = await axiosInstance.put<UpdateCategoryResponse>(
      `${CATALOG_SERVICE}/categories/${categoryId}`,
      data
    );
    return response.data;
  },

  delete: async (categoryId: string): Promise<DeleteCategoryResponse> => {
    const response = await axiosInstance.delete<DeleteCategoryResponse>(
      `${CATALOG_SERVICE}/categories/${categoryId}`
    );
    return response.data;
  },
};
