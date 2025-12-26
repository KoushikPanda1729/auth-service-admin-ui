import type { User, ApiResponse } from "../../../utils/types/common.types";

export interface LoginRequest {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface LoginResponse extends ApiResponse<{
  user: User;
  token: string;
}> {}

export interface RefreshTokenResponse {
  token: string;
}
