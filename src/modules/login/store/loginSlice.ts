import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { loginApi } from "../api/loginApi";
import type { LoginRequest, LoginResponse } from "../api/types";

interface LoginState {
  userId: number | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

const initialState: LoginState = {
  userId: null,
  isAuthenticated: false,
  loading: false,
  error: null,
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
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.userId = action.payload.id;
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
        state.userId = null;
        state.error = null;
      })
      .addCase(logout.rejected, (state) => {
        state.loading = false;
        state.isAuthenticated = false;
        state.userId = null;
        state.error = null;
      });
  },
});

export const { clearError } = loginSlice.actions;
export default loginSlice.reducer;
