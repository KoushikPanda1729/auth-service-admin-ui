export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  id: number;
}

export interface RefreshTokenResponse {
  token: string;
}
