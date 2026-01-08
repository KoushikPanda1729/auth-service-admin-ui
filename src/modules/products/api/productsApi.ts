import axiosInstance from "../../../services/api/axios.config";
import type {
  GetProductsParams,
  GetProductsResponse,
  GetProductByIdResponse,
  UploadImageResponse,
  CreateProductRequest,
  CreateProductResponse,
  UpdateProductRequest,
  UpdateProductResponse,
  DeleteProductResponse,
} from "./types";
import { CATALOG_SERVICE } from "../../../config/apiConfig";

export const productsApi = {
  getAll: async (params: GetProductsParams = {}): Promise<GetProductsResponse> => {
    const response = await axiosInstance.get<GetProductsResponse>(`${CATALOG_SERVICE}/products`, {
      params: {
        page: params.page || 1,
        limit: params.limit || 10,
        ...(params.search ? { q: params.search } : {}),
      },
    });
    return response.data;
  },

  getById: async (productId: string): Promise<GetProductByIdResponse> => {
    const response = await axiosInstance.get<GetProductByIdResponse>(
      `${CATALOG_SERVICE}/products/${productId}`
    );
    return response.data;
  },

  uploadImage: async (imageFile: File): Promise<UploadImageResponse> => {
    const formData = new FormData();
    formData.append("image", imageFile);

    const response = await axiosInstance.post<UploadImageResponse>(
      `${CATALOG_SERVICE}/products/upload-image`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data;
  },

  create: async (data: CreateProductRequest): Promise<CreateProductResponse> => {
    const response = await axiosInstance.post<CreateProductResponse>(
      `${CATALOG_SERVICE}/products`,
      data
    );
    return response.data;
  },

  update: async (productId: string, data: UpdateProductRequest): Promise<UpdateProductResponse> => {
    const response = await axiosInstance.put<UpdateProductResponse>(
      `${CATALOG_SERVICE}/products/${productId}`,
      data
    );
    return response.data;
  },

  delete: async (productId: string): Promise<DeleteProductResponse> => {
    const response = await axiosInstance.delete<DeleteProductResponse>(
      `${CATALOG_SERVICE}/products/${productId}`
    );
    return response.data;
  },
};
