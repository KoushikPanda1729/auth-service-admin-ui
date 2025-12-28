import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { registerApi } from "../api/registerApi";
import type { RegisterRequest, RegisterResponse } from "../api/types";

interface RegisterState {
  userId: number | null;
  loading: boolean;
  error: string | null;
  success: boolean;
}

const initialState: RegisterState = {
  userId: null,
  loading: false,
  error: null,
  success: false,
};

export const register = createAsyncThunk<RegisterResponse, RegisterRequest>(
  "register/register",
  async (userData, { rejectWithValue }) => {
    try {
      const response = await registerApi.register(userData);
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
      state.userId = null;
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
        state.userId = action.payload.id;
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
