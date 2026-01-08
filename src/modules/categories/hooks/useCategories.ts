import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import {
  fetchCategories,
  fetchCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
  clearError,
  setCurrentPage,
  setPageSize,
  setSearchQuery,
  clearSelectedCategory,
} from "../store/categoriesSlice";
import type { CreateCategoryRequest, UpdateCategoryRequest } from "../api/types";
import { notification } from "../../../services/notification/notification";

export const useCategories = () => {
  const dispatch = useAppDispatch();
  const {
    categories,
    selectedCategory,
    loading,
    error,
    currentPage,
    pageSize,
    total,
    searchQuery,
  } = useAppSelector((state) => state.categories);

  const loadCategories = async (page?: number, limit?: number, search?: string) => {
    try {
      const pageNum = page || currentPage;
      const pageLimit = limit || pageSize;
      const searchTerm = search !== undefined ? search : searchQuery;
      await dispatch(
        fetchCategories({
          page: pageNum,
          limit: pageLimit,
          search: searchTerm || undefined,
        })
      ).unwrap();
    } catch (err) {
      const error = err as { message?: string };
      notification.error(error.message || "Failed to load categories");
    }
  };

  const loadCategoryById = async (categoryId: string) => {
    try {
      await dispatch(fetchCategoryById(categoryId)).unwrap();
    } catch (err) {
      const error = err as { message?: string };
      notification.error(error.message || "Failed to load category");
    }
  };

  const handleCreateCategory = async (data: CreateCategoryRequest) => {
    try {
      await dispatch(createCategory(data)).unwrap();
      notification.success("Category created successfully");
      await loadCategories();
      return true;
    } catch (err) {
      const error = err as { message?: string };
      notification.error(error.message || "Failed to create category");
      return false;
    }
  };

  const handleUpdateCategory = async (categoryId: string, data: UpdateCategoryRequest) => {
    try {
      await dispatch(updateCategory({ categoryId, data })).unwrap();
      notification.success("Category updated successfully");
      await loadCategories();
      return true;
    } catch (err) {
      const error = err as { message?: string };
      notification.error(error.message || "Failed to update category");
      return false;
    }
  };

  const handleDeleteCategory = async (categoryId: string) => {
    try {
      await dispatch(deleteCategory(categoryId)).unwrap();
      notification.success("Category deleted successfully");
      await loadCategories();
      return true;
    } catch (err) {
      const error = err as { message?: string };
      notification.error(error.message || "Failed to delete category");
      return false;
    }
  };

  const handlePageChange = (page: number) => {
    dispatch(setCurrentPage(page));
    loadCategories(page);
  };

  const handlePageSizeChange = (size: number) => {
    dispatch(setPageSize(size));
    dispatch(setCurrentPage(1));
    loadCategories(1, size);
  };

  const handleSearchChange = (search: string) => {
    dispatch(setSearchQuery(search));
  };

  const clearCategoriesError = () => {
    dispatch(clearError());
  };

  const clearCategory = () => {
    dispatch(clearSelectedCategory());
  };

  return {
    categories,
    selectedCategory,
    loading,
    error,
    currentPage,
    pageSize,
    total,
    searchQuery,
    loadCategories,
    loadCategoryById,
    handleCreateCategory,
    handleUpdateCategory,
    handleDeleteCategory,
    handlePageChange,
    handlePageSizeChange,
    handleSearchChange,
    clearCategoriesError,
    clearCategory,
  };
};
