import axiosInstance from "../../../services/api/axios.config";
import type {
  GetOrdersParams,
  GetOrdersResponse,
  GetOrderByIdResponse,
  CreateOrderRequest,
  CreateOrderResponse,
  UpdateOrderStatusRequest,
  UpdateOrderStatusResponse,
} from "./types";
import { BILLING_SERVICE } from "../../../config/apiConfig";

export const ordersApi = {
  getAll: async (params: GetOrdersParams = {}): Promise<GetOrdersResponse> => {
    const response = await axiosInstance.get<GetOrdersResponse>(`${BILLING_SERVICE}/orders`, {
      params: {
        page: params.page || 1,
        limit: params.limit || 10,
        ...(params.search ? { q: params.search } : {}),
        ...(params.status ? { status: params.status } : {}),
        ...(params.tenantId ? { tenantId: params.tenantId } : {}),
      },
    });
    return response.data;
  },

  getById: async (orderId: string): Promise<GetOrderByIdResponse> => {
    const response = await axiosInstance.get<GetOrderByIdResponse>(
      `${BILLING_SERVICE}/orders/${orderId}`
    );
    return response.data;
  },

  create: async (data: CreateOrderRequest): Promise<CreateOrderResponse> => {
    const response = await axiosInstance.post<CreateOrderResponse>(
      `${BILLING_SERVICE}/orders`,
      data
    );
    return response.data;
  },

  updateStatus: async (
    orderId: string,
    data: UpdateOrderStatusRequest
  ): Promise<UpdateOrderStatusResponse> => {
    const response = await axiosInstance.patch<UpdateOrderStatusResponse>(
      `${BILLING_SERVICE}/orders/${orderId}/status`,
      data
    );
    return response.data;
  },
};
