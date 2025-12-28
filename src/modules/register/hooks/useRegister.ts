import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import { register, clearError, resetRegisterState } from "../store/registerSlice";
import type { RegisterRequest } from "../api/types";
import { notification } from "../../../services/notification/notification";

export const useRegister = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const { userId, loading, error, success } = useAppSelector((state) => state.register);

  const handleRegister = async (userData: RegisterRequest) => {
    try {
      await dispatch(register(userData)).unwrap();
      notification.success("Registration successful! Redirecting to login...");
      setTimeout(() => {
        navigate("/login");
      }, 1000);
    } catch (err) {
      const error = err as { message?: string };
      notification.error(error.message || "Registration failed");
    }
  };

  const clearRegisterError = () => {
    dispatch(clearError());
  };

  const resetState = () => {
    dispatch(resetRegisterState());
  };

  return {
    userId,
    loading,
    error,
    success,
    handleRegister,
    clearRegisterError,
    resetState,
  };
};
