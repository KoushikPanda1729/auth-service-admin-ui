export interface Coupon {
  _id: string;
  title: string;
  code: string;
  discount: number;
  validUpto: string;
  tenantId: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface GetCouponsParams {
  page?: number;
  limit?: number;
}

export interface GetCouponsResponse {
  message: string;
  data: Coupon[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface GetCouponByIdResponse {
  message: string;
  coupon: Coupon;
}

export interface CreateCouponRequest {
  title: string;
  code: string;
  discount: number;
  validUpto: string;
  tenantId?: string;
}

export interface CreateCouponResponse {
  message: string;
  coupon: Coupon;
}

export interface UpdateCouponRequest {
  title?: string;
  code?: string;
  discount?: number;
  validUpto?: string;
}

export interface UpdateCouponResponse {
  message: string;
  coupon: Coupon;
}

export interface DeleteCouponResponse {
  message: string;
}

export interface ToggleCouponResponse {
  message: string;
  coupon: Coupon;
}
