import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import {
  fetchOrders,
  fetchOrderById,
  createOrder,
  updateOrderStatus,
  clearError,
  setCurrentPage,
  setSearchQuery,
  setStatusFilter,
  setTenantIdFilter,
  clearSelectedOrder,
} from "../store/ordersSlice";
import type { CreateOrderRequest } from "../api/types";
import { notification } from "../../../services/notification/notification";

export const useOrders = () => {
  const dispatch = useAppDispatch();
  const {
    orders,
    selectedOrder,
    loading,
    error,
    currentPage,
    pageSize,
    total,
    searchQuery,
    statusFilter,
    tenantIdFilter,
  } = useAppSelector((state) => state.orders);

  const loadOrders = async (
    page?: number,
    limit?: number,
    search?: string,
    status?: string,
    tenantId?: string
  ) => {
    try {
      const pageNum = page || currentPage;
      const pageLimit = limit || pageSize;
      const searchTerm = search !== undefined ? search : searchQuery;
      const statusValue = status !== undefined ? status : statusFilter;
      const tenantIdValue = tenantId !== undefined ? tenantId : tenantIdFilter;

      const params: {
        page: number;
        limit: number;
        search?: string;
        status?: string;
        tenantId?: string;
      } = {
        page: pageNum,
        limit: pageLimit,
      };

      if (searchTerm && searchTerm.trim() !== "") {
        params.search = searchTerm;
      }

      if (statusValue && statusValue.trim() !== "") {
        params.status = statusValue;
      }

      if (tenantIdValue && tenantIdValue.trim() !== "") {
        params.tenantId = tenantIdValue;
      }

      await dispatch(fetchOrders(params)).unwrap();
    } catch (err) {
      const error = err as { message?: string };
      notification.error(error.message || "Failed to load orders");
    }
  };

  const loadOrderById = async (orderId: string) => {
    try {
      await dispatch(fetchOrderById(orderId)).unwrap();
    } catch (err) {
      const error = err as { message?: string };
      notification.error(error.message || "Failed to load order");
    }
  };

  const handleCreateOrder = async (data: CreateOrderRequest) => {
    try {
      await dispatch(createOrder(data)).unwrap();
      notification.success("Order created successfully");
      await loadOrders();
      return true;
    } catch (err) {
      const error = err as { message?: string };
      notification.error(error.message || "Failed to create order");
      return false;
    }
  };

  const handleUpdateStatus = async (
    orderId: string,
    status: "pending" | "confirmed" | "preparing" | "out_for_delivery" | "delivered"
  ) => {
    try {
      await dispatch(updateOrderStatus({ orderId, status })).unwrap();
      notification.success("Order status updated successfully");
      return true;
    } catch (err) {
      const error = err as { message?: string };
      notification.error(error.message || "Failed to update order status");
      return false;
    }
  };

  const handlePageChange = (page: number) => {
    dispatch(setCurrentPage(page));
    loadOrders(page);
  };

  const handleSearchChange = (search: string) => {
    dispatch(setSearchQuery(search));
  };

  const handleStatusFilterChange = (status: string) => {
    dispatch(setStatusFilter(status));
  };

  const handleTenantIdFilterChange = (tenantId: string) => {
    dispatch(setTenantIdFilter(tenantId));
  };

  const clearOrdersError = () => {
    dispatch(clearError());
  };

  const clearOrder = () => {
    dispatch(clearSelectedOrder());
  };

  return {
    orders,
    selectedOrder,
    loading,
    error,
    currentPage,
    pageSize,
    total,
    searchQuery,
    statusFilter,
    tenantIdFilter,
    loadOrders,
    loadOrderById,
    handleCreateOrder,
    handleUpdateStatus,
    handlePageChange,
    handleSearchChange,
    handleStatusFilterChange,
    handleTenantIdFilterChange,
    clearOrdersError,
    clearOrder,
  };
};
