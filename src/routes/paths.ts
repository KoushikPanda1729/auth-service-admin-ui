export const ROUTES = {
  HOME: "/",
  LOGIN: "/login",
  REGISTER: "/register",
  DASHBOARD: "/dashboard",
  USERS: "/users",
  TENANTS: "/tenants",
  NOT_FOUND: "*",
} as const;

export type RouteKey = keyof typeof ROUTES;
