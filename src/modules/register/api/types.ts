import type { User, ApiResponse } from "../../../utils/types/common.types";

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface RegisterResponse extends ApiResponse<{
  user: User;
  token: string;
}> {}
