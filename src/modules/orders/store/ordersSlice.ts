import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { ordersApi } from "../api/ordersApi";
import type { Order, GetOrdersParams, GetOrdersResponse, CreateOrderRequest } from "../api/types";

interface OrdersState {
  orders: Order[];
  selectedOrder: Order | null;
  loading: boolean;
  error: string | null;
  currentPage: number;
  pageSize: number;
  total: number;
  searchQuery: string;
}

const initialState: OrdersState = {
  orders: [],
  selectedOrder: null,
  loading: false,
  error: null,
  currentPage: 1,
  pageSize: 10,
  total: 0,
  searchQuery: "",
};

export const fetchOrders = createAsyncThunk<GetOrdersResponse, GetOrdersParams>(
  "orders/fetchAll",
  async (params, { rejectWithValue }) => {
    try {
      const response = await ordersApi.getAll(params);
      return response;
    } catch (error) {
      const err = error as { response?: { data?: { message?: string } } };
      return rejectWithValue(err.response?.data?.message || "Failed to fetch orders");
    }
  }
);

export const fetchOrderById = createAsyncThunk<Order, string>(
  "orders/fetchById",
  async (orderId, { rejectWithValue }) => {
    try {
      const response = await ordersApi.getById(orderId);
      return response.order;
    } catch (error) {
      const err = error as { response?: { data?: { message?: string } } };
      return rejectWithValue(err.response?.data?.message || "Failed to fetch order");
    }
  }
);

export const createOrder = createAsyncThunk<Order, CreateOrderRequest>(
  "orders/create",
  async (data, { rejectWithValue }) => {
    try {
      const response = await ordersApi.create(data);
      return response.order;
    } catch (error) {
      const err = error as { response?: { data?: { message?: string } } };
      return rejectWithValue(err.response?.data?.message || "Failed to create order");
    }
  }
);

const ordersSlice = createSlice({
  name: "orders",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setCurrentPage: (state, action) => {
      state.currentPage = action.payload;
    },
    setSearchQuery: (state, action) => {
      state.searchQuery = action.payload;
      state.currentPage = 1;
    },
    clearSelectedOrder: (state) => {
      state.selectedOrder = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload.data;
        state.total = action.payload.total;
        state.error = null;
      })
      .addCase(fetchOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchOrderById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOrderById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedOrder = action.payload;
        state.error = null;
      })
      .addCase(fetchOrderById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(createOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createOrder.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearError, setCurrentPage, setSearchQuery, clearSelectedOrder } =
  ordersSlice.actions;
export default ordersSlice.reducer;
