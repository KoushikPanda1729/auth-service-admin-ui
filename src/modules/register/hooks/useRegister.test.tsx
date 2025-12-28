import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import { configureStore } from "@reduxjs/toolkit";
import type { ReactNode } from "react";
import { useRegister } from "./useRegister";
import rootReducer from "../../../app/rootReducer";
import * as registerApi from "../api/registerApi";

// Mock dependencies
vi.mock("../api/registerApi");
vi.mock("../../../services/notification/notification", () => ({
  notification: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

const mockNavigate = vi.fn();
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

const createWrapper = () => {
  const store = configureStore({
    reducer: rootReducer,
  });

  return ({ children }: { children: ReactNode }) => (
    <Provider store={store}>
      <BrowserRouter>{children}</BrowserRouter>
    </Provider>
  );
};

describe("useRegister Hook", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should have correct initial state", () => {
    const { result } = renderHook(() => useRegister(), {
      wrapper: createWrapper(),
    });

    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBeNull();
    expect(result.current.success).toBe(false);
    expect(result.current.userId).toBeNull();
  });

  it("should handle successful registration", async () => {
    vi.mocked(registerApi.registerApi.register).mockResolvedValue({
      id: 1,
    });

    const { result } = renderHook(() => useRegister(), {
      wrapper: createWrapper(),
    });

    await result.current.handleRegister({
      firstName: "New",
      lastName: "User",
      email: "newuser@example.com",
      password: "password123",
      confirmPassword: "password123",
    });

    await waitFor(
      () => {
        expect(mockNavigate).toHaveBeenCalledWith("/dashboard");
      },
      { timeout: 2000 }
    );
  });

  it("should handle registration failure", async () => {
    const errorMessage = "Email already exists";
    vi.mocked(registerApi.registerApi.register).mockRejectedValue({
      response: { data: { message: errorMessage } },
    });

    const { result } = renderHook(() => useRegister(), {
      wrapper: createWrapper(),
    });

    await result.current.handleRegister({
      firstName: "Test",
      lastName: "User",
      email: "existing@example.com",
      password: "password123",
      confirmPassword: "password123",
    });

    await waitFor(() => {
      expect(mockNavigate).not.toHaveBeenCalled();
    });
  });

  it("should clear registration error", () => {
    const { result } = renderHook(() => useRegister(), {
      wrapper: createWrapper(),
    });

    result.current.clearRegisterError();

    expect(result.current.error).toBeNull();
  });

  it("should reset registration state", () => {
    const { result } = renderHook(() => useRegister(), {
      wrapper: createWrapper(),
    });

    result.current.resetState();

    expect(result.current.userId).toBeNull();
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBeNull();
    expect(result.current.success).toBe(false);
  });
});
