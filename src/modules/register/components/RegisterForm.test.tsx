import { describe, it, expect, vi, beforeEach } from "vitest";
import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { renderWithProviders } from "../../../__tests__/test-utils";
import RegisterForm from "./RegisterForm";
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
    Link: ({ children, to }: { children: React.ReactNode; to: string }) => (
      <a href={to}>{children}</a>
    ),
  };
});

describe("RegisterForm Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should render all form fields", () => {
    renderWithProviders(<RegisterForm />);

    expect(screen.getByPlaceholderText(/enter your first name/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/enter your last name/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/enter your email/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/^enter your password$/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/confirm your password/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /sign up/i })).toBeInTheDocument();
  });

  it("should show validation errors for empty fields", async () => {
    const user = userEvent.setup();
    renderWithProviders(<RegisterForm />);

    const submitButton = screen.getByRole("button", { name: /sign up/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/first name is required/i)).toBeInTheDocument();
      expect(screen.getByText(/last name is required/i)).toBeInTheDocument();
      expect(screen.getByText(/email is required/i)).toBeInTheDocument();
      expect(screen.getByText(/password is required/i)).toBeInTheDocument();
      expect(screen.getByText(/please confirm your password/i)).toBeInTheDocument();
    });
  });

  it("should show error for short first name", async () => {
    const user = userEvent.setup();
    renderWithProviders(<RegisterForm />);

    const firstNameInput = screen.getByPlaceholderText(/enter your first name/i);
    const submitButton = screen.getByRole("button", { name: /sign up/i });

    await user.type(firstNameInput, "A");
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/first name must be at least 2 characters/i)).toBeInTheDocument();
    });
  });

  it("should show error for invalid email format", async () => {
    const user = userEvent.setup();
    renderWithProviders(<RegisterForm />);

    const emailInput = screen.getByPlaceholderText(/enter your email/i);
    const submitButton = screen.getByRole("button", { name: /sign up/i });

    await user.type(emailInput, "invalid-email");
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/please enter a valid email address/i)).toBeInTheDocument();
    });
  });

  it("should show error for short password", async () => {
    const user = userEvent.setup();
    renderWithProviders(<RegisterForm />);

    const firstNameInput = screen.getByPlaceholderText(/enter your first name/i);
    const lastNameInput = screen.getByPlaceholderText(/enter your last name/i);
    const emailInput = screen.getByPlaceholderText(/enter your email/i);
    const passwordInput = screen.getByPlaceholderText(/^enter your password$/i);
    const submitButton = screen.getByRole("button", { name: /sign up/i });

    await user.type(firstNameInput, "John");
    await user.type(lastNameInput, "Doe");
    await user.type(emailInput, "john@example.com");
    await user.type(passwordInput, "12345");
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/password must be at least 6 characters/i)).toBeInTheDocument();
    });
  });

  it("should show error when passwords do not match", async () => {
    const user = userEvent.setup();
    renderWithProviders(<RegisterForm />);

    const firstNameInput = screen.getByPlaceholderText(/enter your first name/i);
    const lastNameInput = screen.getByPlaceholderText(/enter your last name/i);
    const emailInput = screen.getByPlaceholderText(/enter your email/i);
    const passwordInput = screen.getByPlaceholderText(/^enter your password$/i);
    const confirmPasswordInput = screen.getByPlaceholderText(/confirm your password/i);
    const submitButton = screen.getByRole("button", { name: /sign up/i });

    await user.type(firstNameInput, "John");
    await user.type(lastNameInput, "Doe");
    await user.type(emailInput, "john@example.com");
    await user.type(passwordInput, "password123");
    await user.type(confirmPasswordInput, "password456");
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/passwords do not match/i)).toBeInTheDocument();
    });
  });

  it("should clear validation errors when user types", async () => {
    const user = userEvent.setup();
    renderWithProviders(<RegisterForm />);

    const firstNameInput = screen.getByPlaceholderText(/enter your first name/i);
    const submitButton = screen.getByRole("button", { name: /sign up/i });

    // Submit to trigger validation
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/first name is required/i)).toBeInTheDocument();
    });

    // Type to clear error
    await user.type(firstNameInput, "John");

    await waitFor(() => {
      expect(screen.queryByText(/first name is required/i)).not.toBeInTheDocument();
    });
  });

  it("should submit form with valid data", async () => {
    const user = userEvent.setup();

    vi.mocked(registerApi.registerApi.register).mockResolvedValue({
      id: 1,
    });

    renderWithProviders(<RegisterForm />);

    const firstNameInput = screen.getByPlaceholderText(/enter your first name/i);
    const lastNameInput = screen.getByPlaceholderText(/enter your last name/i);
    const emailInput = screen.getByPlaceholderText(/enter your email/i);
    const passwordInput = screen.getByPlaceholderText(/^enter your password$/i);
    const confirmPasswordInput = screen.getByPlaceholderText(/confirm your password/i);
    const submitButton = screen.getByRole("button", { name: /sign up/i });

    await user.type(firstNameInput, "New");
    await user.type(lastNameInput, "User");
    await user.type(emailInput, "newuser@example.com");
    await user.type(passwordInput, "password123");
    await user.type(confirmPasswordInput, "password123");
    await user.click(submitButton);

    await waitFor(() => {
      expect(registerApi.registerApi.register).toHaveBeenCalledWith({
        firstName: "New",
        lastName: "User",
        email: "newuser@example.com",
        password: "password123",
        confirmPassword: "password123",
      });
    });

    await waitFor(
      () => {
        expect(mockNavigate).toHaveBeenCalledWith("/dashboard");
      },
      { timeout: 2000 }
    );
  });

  it("should show loading state while submitting", async () => {
    const user = userEvent.setup();

    vi.mocked(registerApi.registerApi.register).mockImplementation(
      () => new Promise((resolve) => setTimeout(resolve, 100))
    );

    renderWithProviders(<RegisterForm />);

    const firstNameInput = screen.getByPlaceholderText(/enter your first name/i);
    const lastNameInput = screen.getByPlaceholderText(/enter your last name/i);
    const emailInput = screen.getByPlaceholderText(/enter your email/i);
    const passwordInput = screen.getByPlaceholderText(/^enter your password$/i);
    const confirmPasswordInput = screen.getByPlaceholderText(/confirm your password/i);
    const submitButton = screen.getByRole("button", { name: /sign up/i });

    await user.type(firstNameInput, "New");
    await user.type(lastNameInput, "User");
    await user.type(emailInput, "newuser@example.com");
    await user.type(passwordInput, "password123");
    await user.type(confirmPasswordInput, "password123");
    await user.click(submitButton);

    // Check for loading state
    await waitFor(() => {
      expect(screen.getByText(/creating account/i)).toBeInTheDocument();
    });
  });

  it("should have link to login page", () => {
    renderWithProviders(<RegisterForm />);

    expect(screen.getByText(/sign in/i)).toBeInTheDocument();
    expect(screen.getByText(/already have an account/i)).toBeInTheDocument();
  });

  it("should handle API errors", async () => {
    const user = userEvent.setup();

    vi.mocked(registerApi.registerApi.register).mockRejectedValue({
      response: {
        data: {
          message: "Email already exists",
        },
      },
    });

    renderWithProviders(<RegisterForm />);

    const firstNameInput = screen.getByPlaceholderText(/enter your first name/i);
    const lastNameInput = screen.getByPlaceholderText(/enter your last name/i);
    const emailInput = screen.getByPlaceholderText(/enter your email/i);
    const passwordInput = screen.getByPlaceholderText(/^enter your password$/i);
    const confirmPasswordInput = screen.getByPlaceholderText(/confirm your password/i);
    const submitButton = screen.getByRole("button", { name: /sign up/i });

    await user.type(firstNameInput, "Test");
    await user.type(lastNameInput, "User");
    await user.type(emailInput, "existing@example.com");
    await user.type(passwordInput, "password123");
    await user.type(confirmPasswordInput, "password123");
    await user.click(submitButton);

    await waitFor(() => {
      expect(mockNavigate).not.toHaveBeenCalled();
    });
  });
});
