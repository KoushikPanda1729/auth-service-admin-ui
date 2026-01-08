import axiosInstance from "../../../services/api/axios.config";
import type {
  GetTenantsParams,
  GetTenantsResponse,
  GetTenantByIdResponse,
  CreateTenantRequest,
  CreateTenantResponse,
  UpdateTenantRequest,
  UpdateTenantResponse,
  DeleteTenantResponse,
} from "./types";
import { AUTH_SERVICE } from "../../../config/apiConfig";

export const tenantsApi = {
  getAll: async (params: GetTenantsParams): Promise<GetTenantsResponse> => {
    const response = await axiosInstance.get<GetTenantsResponse>(`${AUTH_SERVICE}/tenants`, {
      params: {
        page: params.page,
        limit: params.limit,
        ...(params.search && { search: params.search }),
      },
    });
    return response.data;
  },

  getById: async (tenantId: number): Promise<GetTenantByIdResponse> => {
    const response = await axiosInstance.get<GetTenantByIdResponse>(
      `${AUTH_SERVICE}/tenants/${tenantId}`
    );
    return response.data;
  },

  create: async (data: CreateTenantRequest): Promise<CreateTenantResponse> => {
    const response = await axiosInstance.post<CreateTenantResponse>(
      `${AUTH_SERVICE}/tenants/create-tenants`,
      data
    );
    return response.data;
  },

  update: async (tenantId: number, data: UpdateTenantRequest): Promise<UpdateTenantResponse> => {
    const response = await axiosInstance.patch<UpdateTenantResponse>(
      `${AUTH_SERVICE}/tenants/${tenantId}`,
      data
    );
    return response.data;
  },

  delete: async (tenantId: number): Promise<DeleteTenantResponse> => {
    const response = await axiosInstance.delete<DeleteTenantResponse>(
      `${AUTH_SERVICE}/tenants/${tenantId}`
    );
    return response.data;
  },
};
