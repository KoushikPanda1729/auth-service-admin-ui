// Kong Gateway URL - uses environment variable or defaults to localhost:8000
export const KONG_GATEWAY_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

// API Routes
export const AUTH_SERVICE = "/api/auth";
export const CATALOG_SERVICE = "/api/catalog";
export const BILLING_SERVICE = "/api/billing";
