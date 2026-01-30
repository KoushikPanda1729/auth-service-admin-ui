import axiosInstance from "../../../services/api/axios.config";
import type {
  GetTaxConfigResponse,
  CreateTaxConfigRequest,
  CreateTaxConfigResponse,
  UpdateTaxConfigRequest,
  UpdateTaxConfigResponse,
  ToggleTaxRequest,
  ToggleTaxResponse,
  DeleteTaxConfigRequest,
  DeleteTaxConfigResponse,
} from "./types";
import { BILLING_SERVICE } from "../../../config/apiConfig";

export const taxesApi = {
  get: async (tenantId?: string): Promise<GetTaxConfigResponse> => {
    const response = await axiosInstance.get<GetTaxConfigResponse>(`${BILLING_SERVICE}/taxes`, {
      params: tenantId ? { tenantId } : {},
    });
    return response.data;
  },

  create: async (data: CreateTaxConfigRequest): Promise<CreateTaxConfigResponse> => {
    const response = await axiosInstance.post<CreateTaxConfigResponse>(
      `${BILLING_SERVICE}/taxes`,
      data
    );
    return response.data;
  },

  update: async (data: UpdateTaxConfigRequest): Promise<UpdateTaxConfigResponse> => {
    const response = await axiosInstance.put<UpdateTaxConfigResponse>(
      `${BILLING_SERVICE}/taxes`,
      data
    );
    return response.data;
  },

  toggle: async (data: ToggleTaxRequest): Promise<ToggleTaxResponse> => {
    const response = await axiosInstance.patch<ToggleTaxResponse>(
      `${BILLING_SERVICE}/taxes/toggle`,
      data
    );
    return response.data;
  },

  delete: async (data: DeleteTaxConfigRequest): Promise<DeleteTaxConfigResponse> => {
    const response = await axiosInstance.delete<DeleteTaxConfigResponse>(
      `${BILLING_SERVICE}/taxes`,
      { data }
    );
    return response.data;
  },
};
