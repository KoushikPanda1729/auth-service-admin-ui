import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import {
  fetchToppings,
  fetchToppingById,
  uploadToppingImage,
  createTopping,
  updateTopping,
  deleteTopping,
  clearError,
  setCurrentPage,
  setPageSize,
  setSearchQuery,
  clearSelectedTopping,
  clearUploadedImage,
} from "../store/toppingsSlice";
import type { CreateToppingRequest, UpdateToppingRequest } from "../api/types";
import { notification } from "../../../services/notification/notification";

export const useToppings = () => {
  const dispatch = useAppDispatch();
  const {
    toppings,
    selectedTopping,
    loading,
    error,
    currentPage,
    pageSize,
    total,
    searchQuery,
    uploadingImage,
    uploadedImageUrl,
  } = useAppSelector((state) => state.toppings);

  const loadToppings = async (page?: number, limit?: number) => {
    try {
      const pageNum = page || currentPage;
      const pageLimit = limit || pageSize;
      await dispatch(
        fetchToppings({
          page: pageNum,
          limit: pageLimit,
          search: searchQuery || undefined,
        })
      ).unwrap();
    } catch (err) {
      const error = err as { message?: string };
      notification.error(error.message || "Failed to load toppings");
    }
  };

  const loadToppingById = async (toppingId: string) => {
    try {
      await dispatch(fetchToppingById(toppingId)).unwrap();
    } catch (err) {
      const error = err as { message?: string };
      notification.error(error.message || "Failed to load topping");
    }
  };

  const handleUploadImage = async (imageFile: File) => {
    try {
      const url = await dispatch(uploadToppingImage(imageFile)).unwrap();
      notification.success("Image uploaded successfully");
      return url;
    } catch (err) {
      const error = err as { message?: string };
      notification.error(error.message || "Failed to upload image");
      return null;
    }
  };

  const handleCreateTopping = async (data: CreateToppingRequest) => {
    try {
      await dispatch(createTopping(data)).unwrap();
      notification.success("Topping created successfully");
      await loadToppings();
      return true;
    } catch (err) {
      const error = err as { message?: string };
      notification.error(error.message || "Failed to create topping");
      return false;
    }
  };

  const handleUpdateTopping = async (toppingId: string, data: UpdateToppingRequest) => {
    try {
      await dispatch(updateTopping({ toppingId, data })).unwrap();
      notification.success("Topping updated successfully");
      await loadToppings();
      return true;
    } catch (err) {
      const error = err as { message?: string };
      notification.error(error.message || "Failed to update topping");
      return false;
    }
  };

  const handleDeleteTopping = async (toppingId: string) => {
    try {
      await dispatch(deleteTopping(toppingId)).unwrap();
      notification.success("Topping deleted successfully");
      await loadToppings();
      return true;
    } catch (err) {
      const error = err as { message?: string };
      notification.error(error.message || "Failed to delete topping");
      return false;
    }
  };

  const handlePageChange = (page: number) => {
    dispatch(setCurrentPage(page));
    loadToppings(page);
  };

  const handlePageSizeChange = (size: number) => {
    dispatch(setPageSize(size));
    dispatch(setCurrentPage(1));
    loadToppings(1, size);
  };

  const handleSearchChange = (search: string) => {
    dispatch(setSearchQuery(search));
  };

  const clearToppingsError = () => {
    dispatch(clearError());
  };

  const clearTopping = () => {
    dispatch(clearSelectedTopping());
  };

  const clearImage = () => {
    dispatch(clearUploadedImage());
  };

  return {
    toppings,
    selectedTopping,
    loading,
    error,
    currentPage,
    pageSize,
    total,
    searchQuery,
    uploadingImage,
    uploadedImageUrl,
    loadToppings,
    loadToppingById,
    handleUploadImage,
    handleCreateTopping,
    handleUpdateTopping,
    handleDeleteTopping,
    handlePageChange,
    handlePageSizeChange,
    handleSearchChange,
    clearToppingsError,
    clearTopping,
    clearImage,
  };
};
