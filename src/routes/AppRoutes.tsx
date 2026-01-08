import { lazy, Suspense } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { ProtectedRoute } from "./ProtectedRoute";
import { AdminRoute } from "./AdminRoute";
import { PublicRoute } from "./PublicRoute";
import { ROUTES } from "./paths";

// Lazy load pages for better performance (using named exports)
const LoginPage = lazy(() => import("../pages/LoginPage").then((m) => ({ default: m.LoginPage })));
const RegisterPage = lazy(() =>
  import("../pages/RegisterPage").then((m) => ({ default: m.RegisterPage }))
);
const DashboardPage = lazy(() =>
  import("../pages/DashboardPage").then((m) => ({ default: m.DashboardPage }))
);
const NotFoundPage = lazy(() =>
  import("../pages/NotFoundPage").then((m) => ({ default: m.NotFoundPage }))
);
const UsersPage = lazy(() => import("../pages/UsersPage").then((m) => ({ default: m.UsersPage })));
const TenantsPage = lazy(() =>
  import("../pages/TenantsPage").then((m) => ({ default: m.TenantsPage }))
);
const CreateProductPage = lazy(() =>
  import("../pages/CreateProductPage").then((m) => ({ default: m.CreateProductPage }))
);
const ProductDetailPage = lazy(() =>
  import("../pages/ProductDetailPage").then((m) => ({ default: m.ProductDetailPage }))
);
const CategoriesPage = lazy(() =>
  import("../pages/CategoriesPage").then((m) => ({ default: m.CategoriesPage }))
);
const ProductsPage = lazy(() =>
  import("../pages/ProductsPage").then((m) => ({ default: m.ProductsPage }))
);
const ToppingsPage = lazy(() =>
  import("../pages/ToppingsPage").then((m) => ({ default: m.ToppingsPage }))
);
const CreateToppingPage = lazy(() =>
  import("../pages/CreateToppingPage").then((m) => ({ default: m.CreateToppingPage }))
);
const ToppingDetailPage = lazy(() =>
  import("../pages/ToppingDetailPage").then((m) => ({ default: m.ToppingDetailPage }))
);
const OrdersPage = lazy(() =>
  import("../pages/OrdersPage").then((m) => ({ default: m.OrdersPage }))
);
const OrderDetailPage = lazy(() =>
  import("../pages/OrderDetailPage").then((m) => ({ default: m.OrderDetailPage }))
);
const SalesPage = lazy(() => import("../pages/SalesPage").then((m) => ({ default: m.SalesPage })));
const PromosPage = lazy(() =>
  import("../pages/PromosPage").then((m) => ({ default: m.PromosPage }))
);
const SettingsPage = lazy(() =>
  import("../pages/SettingsPage").then((m) => ({ default: m.SettingsPage }))
);
const HelpPage = lazy(() => import("../pages/HelpPage").then((m) => ({ default: m.HelpPage })));

export const AppRoutes = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Routes>
        <Route path={ROUTES.HOME} element={<Navigate to={ROUTES.LOGIN} replace />} />
        <Route
          path={ROUTES.LOGIN}
          element={
            <PublicRoute>
              <LoginPage />
            </PublicRoute>
          }
        />
        <Route
          path={ROUTES.REGISTER}
          element={
            <PublicRoute>
              <RegisterPage />
            </PublicRoute>
          }
        />
        <Route
          path={ROUTES.DASHBOARD}
          element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          }
        />
        <Route
          path={ROUTES.PRODUCTS}
          element={
            <ProtectedRoute>
              <ProductsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path={ROUTES.CREATE_PRODUCT}
          element={
            <ProtectedRoute>
              <CreateProductPage />
            </ProtectedRoute>
          }
        />
        <Route
          path={ROUTES.PRODUCT_DETAIL}
          element={
            <ProtectedRoute>
              <ProductDetailPage />
            </ProtectedRoute>
          }
        />
        <Route
          path={ROUTES.CATEGORIES}
          element={
            <ProtectedRoute>
              <CategoriesPage />
            </ProtectedRoute>
          }
        />
        <Route
          path={ROUTES.TOPPINGS}
          element={
            <ProtectedRoute>
              <ToppingsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path={ROUTES.CREATE_TOPPING}
          element={
            <ProtectedRoute>
              <CreateToppingPage />
            </ProtectedRoute>
          }
        />
        <Route
          path={ROUTES.TOPPING_DETAIL}
          element={
            <ProtectedRoute>
              <ToppingDetailPage />
            </ProtectedRoute>
          }
        />
        <Route
          path={ROUTES.ORDERS}
          element={
            <ProtectedRoute>
              <OrdersPage />
            </ProtectedRoute>
          }
        />
        <Route
          path={ROUTES.ORDER_DETAIL}
          element={
            <ProtectedRoute>
              <OrderDetailPage />
            </ProtectedRoute>
          }
        />
        <Route
          path={ROUTES.SALES}
          element={
            <ProtectedRoute>
              <SalesPage />
            </ProtectedRoute>
          }
        />
        <Route
          path={ROUTES.PROMOS}
          element={
            <ProtectedRoute>
              <PromosPage />
            </ProtectedRoute>
          }
        />
        <Route
          path={ROUTES.USERS}
          element={
            <AdminRoute>
              <UsersPage />
            </AdminRoute>
          }
        />
        <Route
          path={ROUTES.TENANTS}
          element={
            <ProtectedRoute>
              <TenantsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path={ROUTES.SETTINGS}
          element={
            <ProtectedRoute>
              <SettingsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path={ROUTES.HELP}
          element={
            <ProtectedRoute>
              <HelpPage />
            </ProtectedRoute>
          }
        />
        <Route path={ROUTES.NOT_FOUND} element={<NotFoundPage />} />
      </Routes>
    </Suspense>
  );
};
