import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { tenantsApi } from "../api/tenantsApi";
import type {
  Tenant,
  GetTenantsParams,
  GetTenantsResponse,
  CreateTenantRequest,
  UpdateTenantRequest,
} from "../api/types";

interface TenantsState {
  tenants: Tenant[];
  selectedTenant: Tenant | null;
  loading: boolean;
  error: string | null;
  currentPage: number;
  pageSize: number;
  total: number;
}

const initialState: TenantsState = {
  tenants: [],
  selectedTenant: null,
  loading: false,
  error: null,
  currentPage: 1,
  pageSize: 10,
  total: 0,
};

export const fetchTenants = createAsyncThunk<GetTenantsResponse, GetTenantsParams>(
  "tenants/fetchAll",
  async (params, { rejectWithValue }) => {
    try {
      const response = await tenantsApi.getAll(params);
      return response;
    } catch (error) {
      const err = error as { response?: { data?: { message?: string } } };
      return rejectWithValue(err.response?.data?.message || "Failed to fetch tenants");
    }
  }
);

export const fetchTenantById = createAsyncThunk<Tenant, number>(
  "tenants/fetchById",
  async (tenantId, { rejectWithValue }) => {
    try {
      const tenant = await tenantsApi.getById(tenantId);
      return tenant;
    } catch (error) {
      const err = error as { response?: { data?: { message?: string } } };
      return rejectWithValue(err.response?.data?.message || "Failed to fetch tenant");
    }
  }
);

export const createTenant = createAsyncThunk<{ id: number }, CreateTenantRequest>(
  "tenants/create",
  async (data, { rejectWithValue }) => {
    try {
      const response = await tenantsApi.create(data);
      return response;
    } catch (error) {
      const err = error as { response?: { data?: { message?: string } } };
      return rejectWithValue(err.response?.data?.message || "Failed to create tenant");
    }
  }
);

export const updateTenant = createAsyncThunk<
  Tenant,
  { tenantId: number; data: UpdateTenantRequest }
>("tenants/update", async ({ tenantId, data }, { rejectWithValue }) => {
  try {
    const tenant = await tenantsApi.update(tenantId, data);
    return tenant;
  } catch (error) {
    const err = error as { response?: { data?: { message?: string } } };
    return rejectWithValue(err.response?.data?.message || "Failed to update tenant");
  }
});

export const deleteTenant = createAsyncThunk<number, number>(
  "tenants/delete",
  async (tenantId, { rejectWithValue }) => {
    try {
      await tenantsApi.delete(tenantId);
      return tenantId;
    } catch (error) {
      const err = error as { response?: { data?: { message?: string } } };
      return rejectWithValue(err.response?.data?.message || "Failed to delete tenant");
    }
  }
);

const tenantsSlice = createSlice({
  name: "tenants",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setCurrentPage: (state, action) => {
      state.currentPage = action.payload;
    },
    setPageSize: (state, action) => {
      state.pageSize = action.payload;
    },
    clearSelectedTenant: (state) => {
      state.selectedTenant = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTenants.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTenants.fulfilled, (state, action) => {
        state.loading = false;
        state.tenants = action.payload.data;
        state.total = action.payload.pagination.total;
        state.error = null;
      })
      .addCase(fetchTenants.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchTenantById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTenantById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedTenant = action.payload;
        state.error = null;
      })
      .addCase(fetchTenantById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(createTenant.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createTenant.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(createTenant.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(updateTenant.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateTenant.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.tenants.findIndex((t) => t.id === action.payload.id);
        if (index !== -1) {
          state.tenants[index] = action.payload;
        }
        state.error = null;
      })
      .addCase(updateTenant.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(deleteTenant.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteTenant.fulfilled, (state, action) => {
        state.loading = false;
        state.tenants = state.tenants.filter((t) => t.id !== action.payload);
        state.error = null;
      })
      .addCase(deleteTenant.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearError, setCurrentPage, setPageSize, clearSelectedTenant } =
  tenantsSlice.actions;
export default tenantsSlice.reducer;
