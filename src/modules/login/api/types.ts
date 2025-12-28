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

export interface JWK {
  kty: string;
  n: string;
  e: string;
  alg: string;
  use: string;
  kid: string;
}

export interface JWKSResponse {
  keys: JWK[];
}
