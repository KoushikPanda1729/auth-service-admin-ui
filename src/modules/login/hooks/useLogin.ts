import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import { login, logout, clearError } from "../store/loginSlice";
import type { LoginRequest } from "../api/types";
import { notification } from "../../../services/notification/notification";

export const useLogin = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const { user, isAuthenticated, loading, error } = useAppSelector((state) => state.login);

  const handleLogin = async (credentials: LoginRequest) => {
    try {
      await dispatch(login(credentials)).unwrap();
      notification.success("Login successful!");
      navigate("/dashboard");
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
