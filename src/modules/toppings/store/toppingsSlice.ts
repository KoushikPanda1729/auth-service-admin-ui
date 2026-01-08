import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { toppingsApi } from "../api/toppingsApi";
import type {
  Topping,
  GetToppingsParams,
  GetToppingsResponse,
  CreateToppingRequest,
  UpdateToppingRequest,
} from "../api/types";

interface ToppingsState {
  toppings: Topping[];
  selectedTopping: Topping | null;
  loading: boolean;
  error: string | null;
  currentPage: number;
  pageSize: number;
  total: number;
  searchQuery: string;
  uploadingImage: boolean;
  uploadedImageUrl: string | null;
}

const initialState: ToppingsState = {
  toppings: [],
  selectedTopping: null,
  loading: false,
  error: null,
  currentPage: 1,
  pageSize: 10,
  total: 0,
  searchQuery: "",
  uploadingImage: false,
  uploadedImageUrl: null,
};

export const fetchToppings = createAsyncThunk<GetToppingsResponse, GetToppingsParams>(
  "toppings/fetchAll",
  async (params, { rejectWithValue }) => {
    try {
      const response = await toppingsApi.getAll(params);
      return response;
    } catch (error) {
      const err = error as { response?: { data?: { message?: string } } };
      return rejectWithValue(err.response?.data?.message || "Failed to fetch toppings");
    }
  }
);

export const fetchToppingById = createAsyncThunk<Topping, string>(
  "toppings/fetchById",
  async (toppingId, { rejectWithValue }) => {
    try {
      const response = await toppingsApi.getById(toppingId);
      return response.topping;
    } catch (error) {
      const err = error as { response?: { data?: { message?: string } } };
      return rejectWithValue(err.response?.data?.message || "Failed to fetch topping");
    }
  }
);

export const uploadToppingImage = createAsyncThunk<string, File>(
  "toppings/uploadImage",
  async (imageFile, { rejectWithValue }) => {
    try {
      const response = await toppingsApi.uploadImage(imageFile);
      return response.data.url;
    } catch (error) {
      const err = error as { response?: { data?: { message?: string } } };
      return rejectWithValue(err.response?.data?.message || "Failed to upload image");
    }
  }
);

export const createTopping = createAsyncThunk<Topping, CreateToppingRequest>(
  "toppings/create",
  async (data, { rejectWithValue }) => {
    try {
      const response = await toppingsApi.create(data);
      return response.topping;
    } catch (error) {
      const err = error as { response?: { data?: { message?: string } } };
      return rejectWithValue(err.response?.data?.message || "Failed to create topping");
    }
  }
);

export const updateTopping = createAsyncThunk<
  Topping,
  { toppingId: string; data: UpdateToppingRequest }
>("toppings/update", async ({ toppingId, data }, { rejectWithValue }) => {
  try {
    const response = await toppingsApi.update(toppingId, data);
    return response.topping;
  } catch (error) {
    const err = error as { response?: { data?: { message?: string } } };
    return rejectWithValue(err.response?.data?.message || "Failed to update topping");
  }
});

export const deleteTopping = createAsyncThunk<string, string>(
  "toppings/delete",
  async (toppingId, { rejectWithValue }) => {
    try {
      await toppingsApi.delete(toppingId);
      return toppingId;
    } catch (error) {
      const err = error as { response?: { data?: { message?: string } } };
      return rejectWithValue(err.response?.data?.message || "Failed to delete topping");
    }
  }
);

const toppingsSlice = createSlice({
  name: "toppings",
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
      state.currentPage = 1;
    },
    clearSelectedTopping: (state) => {
      state.selectedTopping = null;
    },
    clearUploadedImage: (state) => {
      state.uploadedImageUrl = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchToppings.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchToppings.fulfilled, (state, action) => {
        state.loading = false;
        state.toppings = action.payload.data;
        state.total = action.payload.total;
        state.error = null;
      })
      .addCase(fetchToppings.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchToppingById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchToppingById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedTopping = action.payload;
        state.error = null;
      })
      .addCase(fetchToppingById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(uploadToppingImage.pending, (state) => {
        state.uploadingImage = true;
        state.error = null;
      })
      .addCase(uploadToppingImage.fulfilled, (state, action) => {
        state.uploadingImage = false;
        state.uploadedImageUrl = action.payload;
        state.error = null;
      })
      .addCase(uploadToppingImage.rejected, (state, action) => {
        state.uploadingImage = false;
        state.error = action.payload as string;
      })
      .addCase(createTopping.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createTopping.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(createTopping.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(updateTopping.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateTopping.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.toppings.findIndex((t) => t._id === action.payload._id);
        if (index !== -1) {
          state.toppings[index] = action.payload;
        }
        state.error = null;
      })
      .addCase(updateTopping.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(deleteTopping.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteTopping.fulfilled, (state, action) => {
        state.loading = false;
        state.toppings = state.toppings.filter((t) => t._id !== action.payload);
        state.error = null;
      })
      .addCase(deleteTopping.rejected, (state, action) => {
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
  clearSelectedTopping,
  clearUploadedImage,
} = toppingsSlice.actions;
export default toppingsSlice.reducer;
