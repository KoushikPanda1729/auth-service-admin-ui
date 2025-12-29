export const ROUTES = {
  HOME: "/",
  LOGIN: "/login",
  REGISTER: "/register",
  DASHBOARD: "/dashboard",
  USERS: "/users",
  TENANTS: "/tenants",
  MENU: "/menu",
  ORDERS: "/orders",
  SALES: "/sales",
  PROMOS: "/promos",
  SETTINGS: "/settings",
  HELP: "/help",
  NOT_FOUND: "*",
} as const;

export type RouteKey = keyof typeof ROUTES;
