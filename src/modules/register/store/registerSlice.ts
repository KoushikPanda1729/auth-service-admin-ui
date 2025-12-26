import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { registerApi } from "../api/registerApi";
import type { RegisterRequest, RegisterResponse } from "../api/types";
import { setToken, setUser } from "../../../services/storage/localStorage";
import type { User } from "../../../utils/types/common.types";

interface RegisterState {
  user: User | null;
  token: string | null;
  loading: boolean;
  error: string | null;
  success: boolean;
}

const initialState: RegisterState = {
  user: null,
  token: null,
  loading: false,
  error: null,
  success: false,
};

export const register = createAsyncThunk<RegisterResponse, RegisterRequest>(
  "register/register",
  async (userData, { rejectWithValue }) => {
    try {
      const response = await registerApi.register(userData);
      setToken(response.data.token);
      setUser(response.data.user);
      return response;
    } catch (error) {
      const err = error as { response?: { data?: { message?: string } } };
      return rejectWithValue(err.response?.data?.message || "Registration failed");
    }
  }
);

const registerSlice = createSlice({
  name: "register",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    resetRegisterState: (state) => {
      state.user = null;
      state.token = null;
      state.loading = false;
      state.error = null;
      state.success = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(register.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.data.user;
        state.token = action.payload.data.token;
        state.success = true;
        state.error = null;
      })
      .addCase(register.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.success = false;
      });
  },
});

export const { clearError, resetRegisterState } = registerSlice.actions;
export default registerSlice.reducer;
