import { describe, it, expect, vi } from "vitest";
import { render, screen } from "../../__tests__/test-utils";
import { DashboardPage } from "../DashboardPage";

// Mock the chart library to avoid Canvas issues in tests
vi.mock("@ant-design/plots", () => ({
  Line: () => <div data-testid="line-chart">Chart</div>,
}));

vi.mock("../../hooks/useAuth", () => ({
  useAuth: () => ({
    user: { firstName: "Test", lastName: "User", email: "test@example.com", role: "admin" },
    logout: vi.fn(),
  }),
}));

describe("DashboardPage", () => {
  it("should render welcome message", () => {
    render(<DashboardPage />);
    expect(screen.getByText(/Welcome back/i)).toBeInTheDocument();
  });

  it("should render stats cards", () => {
    render(<DashboardPage />);
    expect(screen.getByText("Total Orders")).toBeInTheDocument();
    expect(screen.getByText("Total Revenue")).toBeInTheDocument();
    expect(screen.getByText("Total Customers")).toBeInTheDocument();
  });

  it("should render sales overview chart", () => {
    render(<DashboardPage />);
    expect(screen.getByText("Sales Overview")).toBeInTheDocument();
    expect(screen.getByTestId("line-chart")).toBeInTheDocument();
  });
});
