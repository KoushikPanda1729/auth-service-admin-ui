import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { categoriesApi } from "../api/categoriesApi";
import type {
  Category,
  GetCategoriesParams,
  GetCategoriesResponse,
  CreateCategoryRequest,
  UpdateCategoryRequest,
} from "../api/types";

interface CategoriesState {
  categories: Category[];
  selectedCategory: Category | null;
  loading: boolean;
  error: string | null;
  currentPage: number;
  pageSize: number;
  total: number;
  searchQuery: string;
}

const initialState: CategoriesState = {
  categories: [],
  selectedCategory: null,
  loading: false,
  error: null,
  currentPage: 1,
  pageSize: 10,
  total: 0,
  searchQuery: "",
};

export const fetchCategories = createAsyncThunk<GetCategoriesResponse, GetCategoriesParams>(
  "categories/fetchAll",
  async (params, { rejectWithValue }) => {
    try {
      const response = await categoriesApi.getAll(params);
      return response;
    } catch (error) {
      const err = error as { response?: { data?: { message?: string } } };
      return rejectWithValue(err.response?.data?.message || "Failed to fetch categories");
    }
  }
);

export const fetchCategoryById = createAsyncThunk<Category, string>(
  "categories/fetchById",
  async (categoryId, { rejectWithValue }) => {
    try {
      const response = await categoriesApi.getById(categoryId);
      return response.data;
    } catch (error) {
      const err = error as { response?: { data?: { message?: string } } };
      return rejectWithValue(err.response?.data?.message || "Failed to fetch category");
    }
  }
);

export const createCategory = createAsyncThunk<Category, CreateCategoryRequest>(
  "categories/create",
  async (data, { rejectWithValue }) => {
    try {
      const response = await categoriesApi.create(data);
      return response.data;
    } catch (error) {
      const err = error as { response?: { data?: { message?: string } } };
      return rejectWithValue(err.response?.data?.message || "Failed to create category");
    }
  }
);

export const updateCategory = createAsyncThunk<
  Category,
  { categoryId: string; data: UpdateCategoryRequest }
>("categories/update", async ({ categoryId, data }, { rejectWithValue }) => {
  try {
    const response = await categoriesApi.update(categoryId, data);
    return response.data;
  } catch (error) {
    const err = error as { response?: { data?: { message?: string } } };
    return rejectWithValue(err.response?.data?.message || "Failed to update category");
  }
});

export const deleteCategory = createAsyncThunk<string, string>(
  "categories/delete",
  async (categoryId, { rejectWithValue }) => {
    try {
      await categoriesApi.delete(categoryId);
      return categoryId;
    } catch (error) {
      const err = error as { response?: { data?: { message?: string } } };
      return rejectWithValue(err.response?.data?.message || "Failed to delete category");
    }
  }
);

const categoriesSlice = createSlice({
  name: "categories",
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
    clearSelectedCategory: (state) => {
      state.selectedCategory = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCategories.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.loading = false;
        state.categories = action.payload.data;
        state.total = action.payload.total;
        state.error = null;
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchCategoryById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCategoryById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedCategory = action.payload;
        state.error = null;
      })
      .addCase(fetchCategoryById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(createCategory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createCategory.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(createCategory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(updateCategory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateCategory.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.categories.findIndex((c) => c._id === action.payload._id);
        if (index !== -1) {
          state.categories[index] = action.payload;
        }
        state.error = null;
      })
      .addCase(updateCategory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(deleteCategory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteCategory.fulfilled, (state, action) => {
        state.loading = false;
        state.categories = state.categories.filter((c) => c._id !== action.payload);
        state.error = null;
      })
      .addCase(deleteCategory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearError, setCurrentPage, setPageSize, setSearchQuery, clearSelectedCategory } =
  categoriesSlice.actions;
export default categoriesSlice.reducer;
