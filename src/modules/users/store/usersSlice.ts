import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { usersApi } from "../api/usersApi";
import type {
  User,
  GetUsersParams,
  GetUsersResponse,
  CreateManagerRequest,
  UpdateUserRequest,
  GetUserByIdResponse,
  UpdateUserResponse,
} from "../api/types";

interface UsersState {
  users: User[];
  selectedUser: User | null;
  loading: boolean;
  error: string | null;
  currentPage: number;
  pageSize: number;
  total: number;
  searchQuery: string;
  roleFilter: string;
}

const initialState: UsersState = {
  users: [],
  selectedUser: null,
  loading: false,
  error: null,
  currentPage: 1,
  pageSize: 10,
  total: 0,
  searchQuery: "",
  roleFilter: "all",
};

export const fetchUsers = createAsyncThunk<GetUsersResponse, GetUsersParams>(
  "users/fetchAll",
  async (params, { rejectWithValue }) => {
    try {
      const response = await usersApi.getAll(params);
      return response;
    } catch (error) {
      const err = error as { response?: { data?: { message?: string } } };
      return rejectWithValue(err.response?.data?.message || "Failed to fetch users");
    }
  }
);

export const fetchUserById = createAsyncThunk<GetUserByIdResponse, number>(
  "users/fetchById",
  async (userId, { rejectWithValue }) => {
    try {
      const user = await usersApi.getById(userId);
      return user;
    } catch (error) {
      const err = error as { response?: { data?: { message?: string } } };
      return rejectWithValue(err.response?.data?.message || "Failed to fetch user");
    }
  }
);

export const createManager = createAsyncThunk<{ id: number }, CreateManagerRequest>(
  "users/createManager",
  async (data, { rejectWithValue }) => {
    try {
      const response = await usersApi.createManager(data);
      return response;
    } catch (error) {
      const err = error as { response?: { data?: { message?: string } } };
      return rejectWithValue(err.response?.data?.message || "Failed to create manager");
    }
  }
);

export const updateUser = createAsyncThunk<
  UpdateUserResponse,
  { userId: number; data: UpdateUserRequest }
>("users/update", async ({ userId, data }, { rejectWithValue }) => {
  try {
    const user = await usersApi.update(userId, data);
    return user;
  } catch (error) {
    const err = error as { response?: { data?: { message?: string } } };
    return rejectWithValue(err.response?.data?.message || "Failed to update user");
  }
});

export const deleteUser = createAsyncThunk<number, number>(
  "users/delete",
  async (userId, { rejectWithValue }) => {
    try {
      await usersApi.delete(userId);
      return userId;
    } catch (error) {
      const err = error as { response?: { data?: { message?: string } } };
      return rejectWithValue(err.response?.data?.message || "Failed to delete user");
    }
  }
);

const usersSlice = createSlice({
  name: "users",
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
    setSearchQuery: (state, action) => {
      state.searchQuery = action.payload;
      state.currentPage = 1; // Reset to first page when searching
    },
    setRoleFilter: (state, action) => {
      state.roleFilter = action.payload;
      state.currentPage = 1; // Reset to first page when filtering
    },
    clearSelectedUser: (state) => {
      state.selectedUser = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload.data;
        state.total = action.payload.pagination.total;
        state.error = null;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchUserById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedUser = action.payload;
        state.error = null;
      })
      .addCase(fetchUserById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(createManager.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createManager.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(createManager.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(updateUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.users.findIndex((u) => u.id === action.payload.id);
        if (index !== -1) {
          state.users[index] = action.payload;
        }
        state.error = null;
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(deleteUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.loading = false;
        state.users = state.users.filter((u) => u.id !== action.payload);
        state.error = null;
      })
      .addCase(deleteUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const {
  clearError,
  setCurrentPage,
  setPageSize,
  setSearchQuery,
  setRoleFilter,
  clearSelectedUser,
} = usersSlice.actions;
export default usersSlice.reducer;
