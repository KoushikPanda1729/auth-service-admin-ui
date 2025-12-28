import axiosInstance from "../../../services/api/axios.config";
import type {
  Tenant,
  GetTenantsParams,
  GetTenantByIdResponse,
  CreateTenantRequest,
  CreateTenantResponse,
  UpdateTenantRequest,
  UpdateTenantResponse,
  DeleteTenantResponse,
} from "./types";

export const tenantsApi = {
  getAll: async (params: GetTenantsParams): Promise<Tenant[]> => {
    const response = await axiosInstance.get<Tenant[]>("/tenants", {
      params: {
        page: params.page,
        limit: params.limit,
      },
    });
    return response.data;
  },

  getById: async (tenantId: number): Promise<GetTenantByIdResponse> => {
    const response = await axiosInstance.get<GetTenantByIdResponse>(`/tenants/${tenantId}`);
    return response.data;
  },

  create: async (data: CreateTenantRequest): Promise<CreateTenantResponse> => {
    const response = await axiosInstance.post<CreateTenantResponse>(
      "/tenants/create-tenants",
      data
    );
    return response.data;
  },

  update: async (tenantId: number, data: UpdateTenantRequest): Promise<UpdateTenantResponse> => {
    const response = await axiosInstance.patch<UpdateTenantResponse>(`/tenants/${tenantId}`, data);
    return response.data;
  },

  delete: async (tenantId: number): Promise<DeleteTenantResponse> => {
    const response = await axiosInstance.delete<DeleteTenantResponse>(`/tenants/${tenantId}`);
    return response.data;
  },
};
