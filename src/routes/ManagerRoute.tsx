import { Navigate, useLocation } from "react-router-dom";
import { useAppSelector } from "../hooks/useAppSelector";
import { ROUTES } from "./paths";

interface ManagerRouteProps {
  children: React.ReactNode;
}

export const ManagerRoute = ({ children }: ManagerRouteProps) => {
  const { user, isAuthenticated, authChecked } = useAppSelector((state) => state.login);
  const location = useLocation();

  if (!authChecked) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    // Save the current location to redirect back after login
    return <Navigate to={`${ROUTES.LOGIN}?redirect=${location.pathname}`} replace />;
  }

  if (user?.role !== "admin" && user?.role !== "manager") {
    return <Navigate to={ROUTES.DASHBOARD} replace />;
  }

  return <>{children}</>;
};
