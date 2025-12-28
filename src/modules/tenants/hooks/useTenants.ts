import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import {
  fetchTenants,
  fetchTenantById,
  createTenant,
  updateTenant,
  deleteTenant,
  clearError,
  setCurrentPage,
  setPageSize,
  clearSelectedTenant,
} from "../store/tenantsSlice";
import type { CreateTenantRequest, UpdateTenantRequest } from "../api/types";
import { notification } from "../../../services/notification/notification";

export const useTenants = () => {
  const dispatch = useAppDispatch();
  const { tenants, selectedTenant, loading, error, currentPage, pageSize, total } = useAppSelector(
    (state) => state.tenants
  );

  const loadTenants = async (page?: number, limit?: number) => {
    try {
      const pageNum = page || currentPage;
      const pageLimit = limit || pageSize;
      await dispatch(fetchTenants({ page: pageNum, limit: pageLimit })).unwrap();
    } catch (err) {
      const error = err as { message?: string };
      notification.error(error.message || "Failed to load tenants");
    }
  };

  const loadTenantById = async (tenantId: number) => {
    try {
      await dispatch(fetchTenantById(tenantId)).unwrap();
    } catch (err) {
      const error = err as { message?: string };
      notification.error(error.message || "Failed to load tenant");
    }
  };

  const handleCreateTenant = async (data: CreateTenantRequest) => {
    try {
      await dispatch(createTenant(data)).unwrap();
      notification.success("Tenant created successfully");
      await loadTenants();
      return true;
    } catch (err) {
      const error = err as { message?: string };
      notification.error(error.message || "Failed to create tenant");
      return false;
    }
  };

  const handleUpdateTenant = async (tenantId: number, data: UpdateTenantRequest) => {
    try {
      await dispatch(updateTenant({ tenantId, data })).unwrap();
      notification.success("Tenant updated successfully");
      await loadTenants();
      return true;
    } catch (err) {
      const error = err as { message?: string };
      notification.error(error.message || "Failed to update tenant");
      return false;
    }
  };

  const handleDeleteTenant = async (tenantId: number) => {
    try {
      await dispatch(deleteTenant(tenantId)).unwrap();
      notification.success("Tenant deleted successfully");
      await loadTenants();
      return true;
    } catch (err) {
      const error = err as { message?: string };
      notification.error(error.message || "Failed to delete tenant");
      return false;
    }
  };

  const handlePageChange = (page: number) => {
    dispatch(setCurrentPage(page));
    loadTenants(page);
  };

  const handlePageSizeChange = (size: number) => {
    dispatch(setPageSize(size));
    dispatch(setCurrentPage(1));
    loadTenants(1, size);
  };

  const clearTenantsError = () => {
    dispatch(clearError());
  };

  const clearTenant = () => {
    dispatch(clearSelectedTenant());
  };

  return {
    tenants,
    selectedTenant,
    loading,
    error,
    currentPage,
    pageSize,
    total,
    loadTenants,
    loadTenantById,
    handleCreateTenant,
    handleUpdateTenant,
    handleDeleteTenant,
    handlePageChange,
    handlePageSizeChange,
    clearTenantsError,
    clearTenant,
  };
};
