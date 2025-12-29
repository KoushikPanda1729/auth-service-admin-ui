import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { EditUserModal } from "../EditUserModal";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import rootReducer from "../../../../app/rootReducer";

const mockStore = configureStore({
  reducer: rootReducer,
  preloadedState: {
    users: {
      users: [],
      selectedUser: null,
      loading: false,
      error: null,
      currentPage: 1,
      pageSize: 10,
      total: 0,
      searchQuery: "",
      roleFilter: "all",
    },
    tenants: {
      tenants: [],
      selectedTenant: null,
      loading: false,
      error: null,
      currentPage: 1,
      pageSize: 10,
      total: 0,
      searchQuery: "",
    },
  },
});

const renderWithProvider = (component: React.ReactElement) => {
  return render(<Provider store={mockStore}>{component}</Provider>);
};

describe("EditUserModal", () => {
  const mockOnClose = vi.fn();

  it("should render modal when visible", () => {
    renderWithProvider(<EditUserModal visible={true} userId={1} onClose={mockOnClose} />);
    expect(screen.getByText("Edit User")).toBeInTheDocument();
  });

  it("should not render modal when not visible", () => {
    renderWithProvider(<EditUserModal visible={false} userId={null} onClose={mockOnClose} />);
    expect(screen.queryByText("Edit User")).not.toBeInTheDocument();
  });

  it("should call onClose when cancel button is clicked", async () => {
    renderWithProvider(<EditUserModal visible={true} userId={1} onClose={mockOnClose} />);
    const cancelButton = screen.getByRole("button", { name: /cancel/i });
    await userEvent.click(cancelButton);
    expect(mockOnClose).toHaveBeenCalled();
  });
});
