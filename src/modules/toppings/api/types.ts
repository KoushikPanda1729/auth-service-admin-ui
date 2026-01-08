export interface Topping {
  _id: string;
  name: string;
  image: string;
  price: number;
  tenantId: string;
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface GetToppingsParams {
  page?: number;
  limit?: number;
  search?: string;
}

export interface GetToppingsResponse {
  message: string;
  data: Topping[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface GetToppingByIdResponse {
  message: string;
  topping: Topping;
}

export interface UploadImageResponse {
  message: string;
  data: {
    url: string;
    key: string;
  };
}

export interface CreateToppingRequest {
  name: string;
  image: string;
  price: number;
  isPublished: boolean;
  tenantId?: string;
}

export interface CreateToppingResponse {
  message: string;
  topping: Topping;
}

export interface UpdateToppingRequest {
  name?: string;
  image?: string;
  price?: number;
  isPublished?: boolean;
}

export interface UpdateToppingResponse {
  message: string;
  topping: Topping;
}

export interface DeleteToppingResponse {
  message: string;
  topping: Topping;
}
