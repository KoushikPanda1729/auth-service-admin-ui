import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import {
  fetchUsers,
  fetchUserById,
  createManager,
  updateUser,
  deleteUser,
  clearError,
  setCurrentPage,
  setPageSize,
  setSearchQuery,
  setRoleFilter,
  clearSelectedUser,
} from "../store/usersSlice";
import type { CreateManagerRequest, UpdateUserRequest } from "../api/types";
import { notification } from "../../../services/notification/notification";

export const useUsers = () => {
  const dispatch = useAppDispatch();
  const {
    users,
    selectedUser,
    loading,
    error,
    currentPage,
    pageSize,
    total,
    searchQuery,
    roleFilter,
  } = useAppSelector((state) => state.users);

  const loadUsers = async (page?: number, limit?: number) => {
    try {
      const pageNum = page || currentPage;
      const pageLimit = limit || pageSize;
      await dispatch(
        fetchUsers({
          page: pageNum,
          limit: pageLimit,
          search: searchQuery || undefined,
          role: roleFilter !== "all" ? roleFilter : undefined,
        })
      ).unwrap();
    } catch (err) {
      const error = err as { message?: string };
      notification.error(error.message || "Failed to load users");
    }
  };

  const loadUserById = async (userId: number) => {
    try {
      await dispatch(fetchUserById(userId)).unwrap();
    } catch (err) {
      const error = err as { message?: string };
      notification.error(error.message || "Failed to load user");
    }
  };

  const handleCreateManager = async (data: CreateManagerRequest) => {
    try {
      await dispatch(createManager(data)).unwrap();
      notification.success("Manager created successfully");
      await loadUsers();
      return true;
    } catch (err) {
      const error = err as { message?: string };
      notification.error(error.message || "Failed to create manager");
      return false;
    }
  };

  const handleUpdateUser = async (userId: number, data: UpdateUserRequest) => {
    try {
      await dispatch(updateUser({ userId, data })).unwrap();
      notification.success("User updated successfully");
      await loadUsers();
      return true;
    } catch (err) {
      const error = err as { message?: string };
      notification.error(error.message || "Failed to update user");
      return false;
    }
  };

  const handleDeleteUser = async (userId: number) => {
    try {
      await dispatch(deleteUser(userId)).unwrap();
      notification.success("User deleted successfully");
      await loadUsers();
      return true;
    } catch (err) {
      const error = err as { message?: string };
      notification.error(error.message || "Failed to delete user");
      return false;
    }
  };

  const handlePageChange = (page: number) => {
    dispatch(setCurrentPage(page));
    loadUsers(page);
  };

  const handlePageSizeChange = (size: number) => {
    dispatch(setPageSize(size));
    dispatch(setCurrentPage(1));
    loadUsers(1, size);
  };

  const handleSearchChange = (search: string) => {
    dispatch(setSearchQuery(search));
  };

  const handleRoleFilterChange = (role: string) => {
    dispatch(setRoleFilter(role));
  };

  const clearUsersError = () => {
    dispatch(clearError());
  };

  const clearUser = () => {
    dispatch(clearSelectedUser());
  };

  return {
    users,
    selectedUser,
    loading,
    error,
    currentPage,
    pageSize,
    total,
    searchQuery,
    roleFilter,
    loadUsers,
    loadUserById,
    handleCreateManager,
    handleUpdateUser,
    handleDeleteUser,
    handlePageChange,
    handlePageSizeChange,
    handleSearchChange,
    handleRoleFilterChange,
    clearUsersError,
    clearUser,
  };
};
