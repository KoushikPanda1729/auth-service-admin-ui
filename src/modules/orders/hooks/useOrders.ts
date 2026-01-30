import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import {
  fetchOrders,
  fetchOrderById,
  createOrder,
  clearError,
  setCurrentPage,
  setSearchQuery,
  clearSelectedOrder,
} from "../store/ordersSlice";
import type { CreateOrderRequest } from "../api/types";
import { notification } from "../../../services/notification/notification";

export const useOrders = () => {
  const dispatch = useAppDispatch();
  const { orders, selectedOrder, loading, error, currentPage, pageSize, total, searchQuery } =
    useAppSelector((state) => state.orders);

  const loadOrders = async (page?: number, limit?: number, search?: string) => {
    try {
      const pageNum = page || currentPage;
      const pageLimit = limit || pageSize;
      const searchTerm = search !== undefined ? search : searchQuery;

      const params: { page: number; limit: number; search?: string } = {
        page: pageNum,
        limit: pageLimit,
      };

      if (searchTerm && searchTerm.trim() !== "") {
        params.search = searchTerm;
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

  const handlePageChange = (page: number) => {
    dispatch(setCurrentPage(page));
    loadOrders(page);
  };

  const handleSearchChange = (search: string) => {
    dispatch(setSearchQuery(search));
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
    loadOrders,
    loadOrderById,
    handleCreateOrder,
    handlePageChange,
    handleSearchChange,
    clearOrdersError,
    clearOrder,
  };
};
