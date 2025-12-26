import { describe, it, expect, beforeAll, afterEach, afterAll } from "vitest";
import { http, HttpResponse } from "msw";
import { setupServer } from "msw/node";
import { registerApi } from "./registerApi";
import type { RegisterResponse } from "./types";

const API_BASE_URL = "http://localhost:3000/api";

// Mock responses
const mockRegisterSuccess: RegisterResponse = {
  success: true,
  message: "Registration successful",
  data: {
    user: {
      id: "1",
      email: "newuser@example.com",
      name: "New User",
      role: "user",
      createdAt: "2024-01-01",
      updatedAt: "2024-01-01",
    },
    token: "mock-jwt-token",
  },
};

// Setup MSW server
const server = setupServer(
  http.post(`${API_BASE_URL}/auth/register`, () => {
    return HttpResponse.json(mockRegisterSuccess);
  })
);

describe("Register API", () => {
  beforeAll(() => server.listen());
  afterEach(() => server.resetHandlers());
  afterAll(() => server.close());

  describe("registerApi.register", () => {
    it("should register successfully with valid data", async () => {
      const userData = {
        name: "New User",
        email: "newuser@example.com",
        password: "password123",
        confirmPassword: "password123",
      };

      const response = await registerApi.register(userData);

      expect(response.success).toBe(true);
      expect(response.data.user.email).toBe("newuser@example.com");
      expect(response.data.user.name).toBe("New User");
      expect(response.data.token).toBeDefined();
    });

    it("should not send confirmPassword to the API", async () => {
      let requestBody: Record<string, unknown> = {};

      server.use(
        http.post(`${API_BASE_URL}/auth/register`, async ({ request }) => {
          requestBody = (await request.json()) as Record<string, unknown>;
          return HttpResponse.json(mockRegisterSuccess);
        })
      );

      const userData = {
        name: "New User",
        email: "newuser@example.com",
        password: "password123",
        confirmPassword: "password123",
      };

      await registerApi.register(userData);

      expect(requestBody).not.toHaveProperty("confirmPassword");
      expect(requestBody).toHaveProperty("name");
      expect(requestBody).toHaveProperty("email");
      expect(requestBody).toHaveProperty("password");
    });

    it("should return error for duplicate email", async () => {
      server.use(
        http.post(`${API_BASE_URL}/auth/register`, () => {
          return HttpResponse.json(
            {
              success: false,
              message: "Email already exists",
            },
            { status: 409 }
          );
        })
      );

      const userData = {
        name: "Test User",
        email: "existing@example.com",
        password: "password123",
        confirmPassword: "password123",
      };

      await expect(registerApi.register(userData)).rejects.toThrow();
    });

    it("should handle network errors", async () => {
      server.use(
        http.post(`${API_BASE_URL}/auth/register`, () => {
          return HttpResponse.error();
        })
      );

      const userData = {
        name: "Test User",
        email: "test@example.com",
        password: "password123",
        confirmPassword: "password123",
      };

      await expect(registerApi.register(userData)).rejects.toThrow();
    });

    it("should handle validation errors from server", async () => {
      server.use(
        http.post(`${API_BASE_URL}/auth/register`, () => {
          return HttpResponse.json(
            {
              success: false,
              message: "Validation failed",
              errors: {
                email: ["Invalid email format"],
                password: ["Password too weak"],
              },
            },
            { status: 400 }
          );
        })
      );

      const userData = {
        name: "Test User",
        email: "invalid",
        password: "123",
        confirmPassword: "123",
      };

      await expect(registerApi.register(userData)).rejects.toThrow();
    });

    it("should handle server errors", async () => {
      server.use(
        http.post(`${API_BASE_URL}/auth/register`, () => {
          return HttpResponse.json(
            {
              success: false,
              message: "Internal server error",
            },
            { status: 500 }
          );
        })
      );

      const userData = {
        name: "Test User",
        email: "test@example.com",
        password: "password123",
        confirmPassword: "password123",
      };

      await expect(registerApi.register(userData)).rejects.toThrow();
    });
  });
});
