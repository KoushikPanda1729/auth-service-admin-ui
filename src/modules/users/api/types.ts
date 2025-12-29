export interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
}

export interface GetUsersParams {
  page: number;
  limit: number;
}

export interface GetUsersResponse {
  data: User[];
  pagination: {
    total: number;
    currentPage: number;
    perPage: number;
    totalPages: number;
  };
}

export interface GetUserByIdResponse {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
}

export interface CreateManagerRequest {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  tenantId: number;
}

export interface CreateManagerResponse {
  id: number;
}

export interface UpdateUserRequest {
  firstName?: string;
  lastName?: string;
  role?: string;
}

export interface UpdateUserResponse {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
}

export interface DeleteUserResponse {
  message?: string;
}
