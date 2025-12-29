export interface Tenant {
  id: number;
  name: string;
  address: string;
  createdAt: string;
  updatedAt: string;
}

export interface GetTenantsParams {
  page: number;
  limit: number;
  search?: string;
}

export interface GetTenantsResponse {
  data: Tenant[];
  pagination: {
    total: number;
    currentPage: number;
    perPage: number;
    totalPages: number;
  };
}

export interface GetTenantByIdResponse {
  id: number;
  name: string;
  address: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateTenantRequest {
  name: string;
  address: string;
}

export interface CreateTenantResponse {
  id: number;
}

export interface UpdateTenantRequest {
  name?: string;
  address?: string;
}

export interface UpdateTenantResponse {
  id: number;
  name: string;
  address: string;
  createdAt: string;
  updatedAt: string;
}

export interface DeleteTenantResponse {
  message?: string;
}
