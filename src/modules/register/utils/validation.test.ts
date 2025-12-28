import { describe, it, expect } from "vitest";
import { validateRegisterForm } from "./validation";

describe("Register Validation Utils", () => {
  describe("validateRegisterForm", () => {
    it("should return no errors for valid input", () => {
      const errors = validateRegisterForm(
        "John",
        "Doe",
        "john@example.com",
        "password123",
        "password123"
      );
      expect(Object.keys(errors)).toHaveLength(0);
    });

    it("should return error when firstName is empty", () => {
      const errors = validateRegisterForm(
        "",
        "Doe",
        "john@example.com",
        "password123",
        "password123"
      );
      expect(errors.firstName).toBe("First name is required");
    });

    it("should return error when firstName is too short", () => {
      const errors = validateRegisterForm(
        "J",
        "Doe",
        "john@example.com",
        "password123",
        "password123"
      );
      expect(errors.firstName).toBe("First name must be at least 2 characters");
    });

    it("should return error when lastName is empty", () => {
      const errors = validateRegisterForm(
        "John",
        "",
        "john@example.com",
        "password123",
        "password123"
      );
      expect(errors.lastName).toBe("Last name is required");
    });

    it("should return error when lastName is too short", () => {
      const errors = validateRegisterForm(
        "John",
        "D",
        "john@example.com",
        "password123",
        "password123"
      );
      expect(errors.lastName).toBe("Last name must be at least 2 characters");
    });

    it("should return error when email is empty", () => {
      const errors = validateRegisterForm("John", "Doe", "", "password123", "password123");
      expect(errors.email).toBe("Email is required");
    });

    it("should return error when email format is invalid", () => {
      const errors = validateRegisterForm(
        "John",
        "Doe",
        "invalid-email",
        "password123",
        "password123"
      );
      expect(errors.email).toBe("Please enter a valid email address");
    });

    it("should return error when password is empty", () => {
      const errors = validateRegisterForm("John", "Doe", "john@example.com", "", "password123");
      expect(errors.password).toBe("Password is required");
    });

    it("should return error when password is too short", () => {
      const errors = validateRegisterForm("John", "Doe", "john@example.com", "12345", "12345");
      expect(errors.password).toBe("Password must be at least 6 characters");
    });

    it("should return error when confirm password is empty", () => {
      const errors = validateRegisterForm("John", "Doe", "john@example.com", "password123", "");
      expect(errors.confirmPassword).toBe("Please confirm your password");
    });

    it("should return error when passwords do not match", () => {
      const errors = validateRegisterForm(
        "John",
        "Doe",
        "john@example.com",
        "password123",
        "password456"
      );
      expect(errors.confirmPassword).toBe("Passwords do not match");
    });

    it("should return multiple errors when multiple fields are invalid", () => {
      const errors = validateRegisterForm("", "", "invalid-email", "123", "456");
      expect(errors.firstName).toBe("First name is required");
      expect(errors.lastName).toBe("Last name is required");
      expect(errors.email).toBe("Please enter a valid email address");
      expect(errors.password).toBe("Password must be at least 6 characters");
      expect(errors.confirmPassword).toBe("Passwords do not match");
    });

    it("should validate various valid email formats", () => {
      const validEmails = [
        "user@example.com",
        "user.name@example.com",
        "user+tag@example.co.uk",
        "user123@test-domain.com",
      ];

      validEmails.forEach((email) => {
        const errors = validateRegisterForm("John", "Doe", email, "password123", "password123");
        expect(errors.email).toBeUndefined();
      });
    });

    it("should validate various invalid email formats", () => {
      const invalidEmails = ["plaintext", "@example.com", "user@", "user @example.com"];

      invalidEmails.forEach((email) => {
        const errors = validateRegisterForm("John", "Doe", email, "password123", "password123");
        expect(errors.email).toBe("Please enter a valid email address");
      });
    });
  });
});
