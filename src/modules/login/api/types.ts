export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  id: number;
}

export interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
}

export interface RefreshTokenResponse {
  id: number;
}

export interface LogoutResponse {
  message: string;
}
