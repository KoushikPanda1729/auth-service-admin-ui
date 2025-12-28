import { Link, useLocation } from "react-router-dom";
import { Button } from "../ui";
import { useAuth } from "../../hooks/useAuth";
import { ROUTES } from "../../routes/paths";

export const Header = () => {
  const { user, logout } = useAuth();
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center gap-8">
            <h1 className="text-xl font-bold text-gray-900">Admin Dashboard</h1>
            <div className="flex gap-4">
              <Link
                to={ROUTES.DASHBOARD}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive(ROUTES.DASHBOARD)
                    ? "bg-blue-100 text-blue-700"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                Dashboard
              </Link>
              {user?.role === "admin" && (
                <Link
                  to={ROUTES.USERS}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive(ROUTES.USERS)
                      ? "bg-blue-100 text-blue-700"
                      : "text-gray-700 hover:bg-gray-100"
                  }`}
                >
                  Users
                </Link>
              )}
            </div>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-700">
              Welcome,{" "}
              <span className="font-semibold">
                {user?.firstName} {user?.lastName}
              </span>
            </span>
            <Button onClick={logout} variant="secondary">
              Logout
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
};
