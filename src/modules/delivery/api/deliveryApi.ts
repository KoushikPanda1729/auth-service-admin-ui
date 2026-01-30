import axiosInstance from "../../../services/api/axios.config";
import type {
  GetDeliveryConfigResponse,
  CreateDeliveryConfigRequest,
  CreateDeliveryConfigResponse,
  UpdateDeliveryConfigRequest,
  UpdateDeliveryConfigResponse,
  ToggleDeliveryRequest,
  ToggleDeliveryResponse,
  DeleteDeliveryConfigRequest,
  DeleteDeliveryConfigResponse,
} from "./types";
import { BILLING_SERVICE } from "../../../config/apiConfig";

export const deliveryApi = {
  get: async (tenantId?: string): Promise<GetDeliveryConfigResponse> => {
    const response = await axiosInstance.get<GetDeliveryConfigResponse>(
      `${BILLING_SERVICE}/delivery`,
      {
        params: tenantId ? { tenantId } : {},
      }
    );
    return response.data;
  },

  create: async (data: CreateDeliveryConfigRequest): Promise<CreateDeliveryConfigResponse> => {
    const response = await axiosInstance.post<CreateDeliveryConfigResponse>(
      `${BILLING_SERVICE}/delivery`,
      data
    );
    return response.data;
  },

  update: async (data: UpdateDeliveryConfigRequest): Promise<UpdateDeliveryConfigResponse> => {
    const response = await axiosInstance.put<UpdateDeliveryConfigResponse>(
      `${BILLING_SERVICE}/delivery`,
      data
    );
    return response.data;
  },

  toggle: async (data: ToggleDeliveryRequest): Promise<ToggleDeliveryResponse> => {
    const response = await axiosInstance.patch<ToggleDeliveryResponse>(
      `${BILLING_SERVICE}/delivery/toggle`,
      data
    );
    return response.data;
  },

  delete: async (data: DeleteDeliveryConfigRequest): Promise<DeleteDeliveryConfigResponse> => {
    const response = await axiosInstance.delete<DeleteDeliveryConfigResponse>(
      `${BILLING_SERVICE}/delivery`,
      { data }
    );
    return response.data;
  },
};
