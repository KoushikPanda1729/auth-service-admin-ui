import { describe, it, expect, beforeAll, afterEach, afterAll } from "vitest";
import { http, HttpResponse } from "msw";
import { setupServer } from "msw/node";
import { registerApi } from "./registerApi";
import type { RegisterResponse } from "./types";

const API_BASE_URL = "http://localhost:5501";

// Mock responses
const mockRegisterSuccess: RegisterResponse = {
  id: 1,
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
        firstName: "New",
        lastName: "User",
        email: "newuser@example.com",
        password: "password123",
        confirmPassword: "password123",
      };

      const response = await registerApi.register(userData);

      expect(response.id).toBe(1);
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
        firstName: "New",
        lastName: "User",
        email: "newuser@example.com",
        password: "password123",
        confirmPassword: "password123",
      };

      await registerApi.register(userData);

      expect(requestBody).not.toHaveProperty("confirmPassword");
      expect(requestBody).toHaveProperty("firstName");
      expect(requestBody).toHaveProperty("lastName");
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
        firstName: "Test",
        lastName: "User",
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
        firstName: "Test",
        lastName: "User",
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
        firstName: "Test",
        lastName: "User",
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
        firstName: "Test",
        lastName: "User",
        email: "test@example.com",
        password: "password123",
        confirmPassword: "password123",
      };

      await expect(registerApi.register(userData)).rejects.toThrow();
    });
  });
});
