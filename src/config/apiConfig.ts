// Kong Gateway URL - uses environment variable or defaults to localhost:8000
export const KONG_GATEWAY_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

// API Routes
export const AUTH_SERVICE = "/api/auth";
export const CATALOG_SERVICE = "/api/catalog";
export const BILLING_SERVICE = "/api/billing";
export const WS_SERVICE = "/api/socket";

// Calling service (WebRTC signaling) - direct connection, port 5505
export const CALLING_SERVICE_URL =
  import.meta.env.VITE_CALLING_SERVICE_URL || "http://localhost:5505";

// Chat service - direct connection, port 5506
export const CHAT_SERVICE_URL = import.meta.env.VITE_CHAT_SERVICE_URL || "http://localhost:5506";
