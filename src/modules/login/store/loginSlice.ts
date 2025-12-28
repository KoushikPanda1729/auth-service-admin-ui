import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { loginApi } from "../api/loginApi";
import type { LoginRequest, LoginResponse, User } from "../api/types";

interface LoginState {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
  authChecked: boolean;
}

const initialState: LoginState = {
  user: null,
  isAuthenticated: false,
  loading: false,
  error: null,
  authChecked: false,
};

export const login = createAsyncThunk<LoginResponse, LoginRequest>(
  "login/login",
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await loginApi.login(credentials);
      return response;
    } catch (error) {
      const err = error as { response?: { data?: { message?: string } } };
      return rejectWithValue(err.response?.data?.message || "Login failed");
    }
  }
);

export const logout = createAsyncThunk("login/logout", async (_, { rejectWithValue }) => {
  try {
    await loginApi.logout();
  } catch (error) {
    const err = error as { response?: { data?: { message?: string } } };
    return rejectWithValue(err.response?.data?.message || "Logout failed");
  }
});

export const fetchUser = createAsyncThunk<User>(
  "login/fetchUser",
  async (_, { rejectWithValue }) => {
    try {
      const user = await loginApi.self();
      return user;
    } catch (error) {
      const err = error as { response?: { data?: { message?: string } } };
      return rejectWithValue(err.response?.data?.message || "Failed to fetch user");
    }
  }
);

const loginSlice = createSlice({
  name: "login",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.authChecked = true;
        state.error = null;
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.isAuthenticated = false;
        state.error = action.payload as string;
      })
      .addCase(logout.pending, (state) => {
        state.loading = true;
      })
      .addCase(logout.fulfilled, (state) => {
        state.loading = false;
        state.isAuthenticated = false;
        state.user = null;
        state.error = null;
      })
      .addCase(logout.rejected, (state) => {
        state.loading = false;
        state.isAuthenticated = false;
        state.user = null;
        state.error = null;
      })
      .addCase(fetchUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
        state.authChecked = true;
        state.error = null;
      })
      .addCase(fetchUser.rejected, (state, action) => {
        state.loading = false;
        state.isAuthenticated = false;
        state.user = null;
        state.authChecked = true;
        state.error = action.payload as string;
      });
  },
});

export const { clearError } = loginSlice.actions;
export default loginSlice.reducer;
