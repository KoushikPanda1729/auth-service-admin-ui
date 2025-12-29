import { useNavigate, useSearchParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import { login, logout, clearError, fetchUser } from "../store/loginSlice";
import type { LoginRequest } from "../api/types";
import { notification } from "../../../services/notification/notification";

export const useLogin = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const { user, isAuthenticated, loading, error } = useAppSelector((state) => state.login);

  const handleLogin = async (credentials: LoginRequest) => {
    try {
      await dispatch(login(credentials)).unwrap();
      await dispatch(fetchUser()).unwrap();
      notification.success("Login successful!");

      // Redirect to the page user was trying to access, or default to dashboard
      const redirectTo = searchParams.get("redirect") || "/dashboard";
      navigate(redirectTo, { replace: true });
    } catch (err) {
      const error = err as { message?: string };
      notification.error(error.message || "Login failed");
    }
  };

  const handleLogout = async () => {
    try {
      await dispatch(logout()).unwrap();
      notification.success("Logged out successfully");
      navigate("/login");
    } catch (err) {
      const error = err as { message?: string };
      notification.error(error.message || "Logout failed");
    }
  };

  const clearLoginError = () => {
    dispatch(clearError());
  };

  return {
    user,
    isAuthenticated,
    loading,
    error,
    handleLogin,
    handleLogout,
    clearLoginError,
  };
};
