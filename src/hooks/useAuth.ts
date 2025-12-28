import { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useAppDispatch } from "./useAppDispatch";
import { useAppSelector } from "./useAppSelector";
import { login as loginAction, logout as logoutAction } from "../modules/login/store/loginSlice";
import type { LoginRequest } from "../modules/login/api/types";
import { ROUTES } from "../routes/paths";

export const useAuth = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const { user, isAuthenticated, loading, error } = useAppSelector((state) => state.login);

  const login = useCallback(
    async (credentials: LoginRequest) => {
      const result = await dispatch(loginAction(credentials));
      if (loginAction.fulfilled.match(result)) {
        navigate(ROUTES.DASHBOARD);
      }
    },
    [dispatch, navigate]
  );

  const logout = useCallback(async () => {
    await dispatch(logoutAction());
    navigate(ROUTES.LOGIN);
  }, [dispatch, navigate]);

  return {
    user,
    isAuthenticated,
    loading,
    error,
    login,
    logout,
  };
};
