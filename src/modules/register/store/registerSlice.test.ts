import { describe, it, expect, vi, beforeEach } from "vitest";
import { configureStore } from "@reduxjs/toolkit";
import registerReducer, { register, clearError, resetRegisterState } from "./registerSlice";
import type { RegisterResponse } from "../api/types";
import * as registerApi from "../api/registerApi";
import * as storage from "../../../services/storage/localStorage";

// Mock the API and storage
vi.mock("../api/registerApi");
vi.mock("../../../services/storage/localStorage");

const mockUser = {
  id: "1",
  email: "newuser@example.com",
  name: "New User",
  role: "user",
  createdAt: "2024-01-01",
  updatedAt: "2024-01-01",
};

const mockRegisterResponse: RegisterResponse = {
  success: true,
  message: "Registration successful",
  data: {
    user: mockUser,
    token: "mock-token",
  },
};

describe("Register Redux Slice", () => {
  let store: ReturnType<typeof configureStore>;

  beforeEach(() => {
    store = configureStore({
      reducer: {
        register: registerReducer,
      },
    });
    vi.clearAllMocks();
  });

  describe("Initial State", () => {
    it("should have correct initial state", () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const state = (store.getState() as any).register;
      expect(state).toEqual({
        user: null,
        token: null,
        loading: false,
        error: null,
        success: false,
      });
    });
  });

  describe("Reducers", () => {
    it("should handle clearError", () => {
      // Set an error first
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      store.dispatch({ type: "register/register/rejected", payload: "Test error" } as any);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      expect((store.getState() as any).register.error).toBe("Test error");

      // Clear error
      store.dispatch(clearError());
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      expect((store.getState() as any).register.error).toBeNull();
    });

    it("should handle resetRegisterState", () => {
      // Set some state first
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      store.dispatch({ type: "register/register/fulfilled", payload: mockRegisterResponse } as any);

      // Reset state
      store.dispatch(resetRegisterState());
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const state = (store.getState() as any).register;
      expect(state.user).toBeNull();
      expect(state.token).toBeNull();
      expect(state.loading).toBe(false);
      expect(state.error).toBeNull();
      expect(state.success).toBe(false);
    });
  });

  describe("Async Thunks - register", () => {
    it("should handle register.pending", () => {
      const action = { type: register.pending.type };
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const state = registerReducer(undefined, action as any);

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      expect((state as any).loading).toBe(true);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      expect((state as any).error).toBeNull();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      expect((state as any).success).toBe(false);
    });

    it("should handle register.fulfilled", async () => {
      vi.mocked(registerApi.registerApi.register).mockResolvedValue(mockRegisterResponse);

      await store.dispatch(
        register({
          name: "New User",
          email: "newuser@example.com",
          password: "password123",
          confirmPassword: "password123",
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
        }) as any
      );

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const state = (store.getState() as any).register;
      expect(state.loading).toBe(false);
      expect(state.success).toBe(true);
      expect(state.user).toEqual(mockUser);
      expect(state.token).toBe("mock-token");
      expect(state.error).toBeNull();

      // Verify storage was called
      expect(storage.setToken).toHaveBeenCalledWith("mock-token");
      expect(storage.setUser).toHaveBeenCalledWith(mockUser);
    });

    it("should handle register.rejected", async () => {
      const errorMessage = "Email already exists";
      vi.mocked(registerApi.registerApi.register).mockRejectedValue({
        response: { data: { message: errorMessage } },
      });

      await store.dispatch(
        register({
          name: "Test User",
          email: "existing@example.com",
          password: "password123",
          confirmPassword: "password123",
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
        }) as any
      );

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const state = (store.getState() as any).register;
      expect(state.loading).toBe(false);
      expect(state.success).toBe(false);
      expect(state.error).toBe(errorMessage);
      expect(state.user).toBeNull();
      expect(state.token).toBeNull();
    });

    it("should handle register.rejected with default error message", async () => {
      vi.mocked(registerApi.registerApi.register).mockRejectedValue(new Error("Network error"));

      await store.dispatch(
        register({
          name: "Test User",
          email: "test@example.com",
          password: "password123",
          confirmPassword: "password123",
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
        }) as any
      );

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const state = (store.getState() as any).register;
      expect(state.error).toBe("Registration failed");
    });
  });
});
