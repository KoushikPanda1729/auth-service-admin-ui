import axiosInstance from "../../../services/api/axios.config";
import type {
  GetCouponsParams,
  GetCouponsResponse,
  GetCouponByIdResponse,
  CreateCouponRequest,
  CreateCouponResponse,
  UpdateCouponRequest,
  UpdateCouponResponse,
  DeleteCouponResponse,
  ToggleCouponResponse,
} from "./types";
import { BILLING_SERVICE } from "../../../config/apiConfig";

export const couponsApi = {
  getAll: async (params: GetCouponsParams = {}): Promise<GetCouponsResponse> => {
    const response = await axiosInstance.get<GetCouponsResponse>(`${BILLING_SERVICE}/coupons`, {
      params: {
        page: params.page || 1,
        limit: params.limit || 10,
      },
    });
    return response.data;
  },

  getById: async (couponId: string): Promise<GetCouponByIdResponse> => {
    const response = await axiosInstance.get<GetCouponByIdResponse>(
      `${BILLING_SERVICE}/coupons/${couponId}`
    );
    return response.data;
  },

  create: async (data: CreateCouponRequest): Promise<CreateCouponResponse> => {
    const response = await axiosInstance.post<CreateCouponResponse>(
      `${BILLING_SERVICE}/coupons`,
      data
    );
    return response.data;
  },

  update: async (couponId: string, data: UpdateCouponRequest): Promise<UpdateCouponResponse> => {
    const response = await axiosInstance.put<UpdateCouponResponse>(
      `${BILLING_SERVICE}/coupons/${couponId}`,
      data
    );
    return response.data;
  },

  delete: async (couponId: string): Promise<DeleteCouponResponse> => {
    const response = await axiosInstance.delete<DeleteCouponResponse>(
      `${BILLING_SERVICE}/coupons/${couponId}`
    );
    return response.data;
  },

  toggleStatus: async (couponId: string): Promise<ToggleCouponResponse> => {
    const response = await axiosInstance.patch<ToggleCouponResponse>(
      `${BILLING_SERVICE}/coupons/${couponId}/toggle-status`
    );
    return response.data;
  },
};
