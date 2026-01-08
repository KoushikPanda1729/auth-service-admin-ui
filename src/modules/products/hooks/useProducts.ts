import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import {
  fetchProducts,
  fetchProductById,
  uploadProductImage,
  createProduct,
  updateProduct,
  deleteProduct,
  clearError,
  setCurrentPage,
  setPageSize,
  setSearchQuery,
  clearSelectedProduct,
  clearUploadedImage,
} from "../store/productsSlice";
import type { CreateProductRequest, UpdateProductRequest } from "../api/types";
import { notification } from "../../../services/notification/notification";

export const useProducts = () => {
  const dispatch = useAppDispatch();
  const {
    products,
    selectedProduct,
    loading,
    error,
    currentPage,
    pageSize,
    total,
    searchQuery,
    uploadingImage,
    uploadedImageUrl,
  } = useAppSelector((state) => state.products);

  const loadProducts = async (page?: number, limit?: number) => {
    try {
      const pageNum = page || currentPage;
      const pageLimit = limit || pageSize;
      await dispatch(
        fetchProducts({
          page: pageNum,
          limit: pageLimit,
          search: searchQuery || undefined,
        })
      ).unwrap();
    } catch (err) {
      const error = err as { message?: string };
      notification.error(error.message || "Failed to load products");
    }
  };

  const loadProductById = async (productId: string) => {
    try {
      await dispatch(fetchProductById(productId)).unwrap();
    } catch (err) {
      const error = err as { message?: string };
      notification.error(error.message || "Failed to load product");
    }
  };

  const handleUploadImage = async (imageFile: File) => {
    try {
      const url = await dispatch(uploadProductImage(imageFile)).unwrap();
      notification.success("Image uploaded successfully");
      return url;
    } catch (err) {
      const error = err as { message?: string };
      notification.error(error.message || "Failed to upload image");
      return null;
    }
  };

  const handleCreateProduct = async (data: CreateProductRequest) => {
    try {
      await dispatch(createProduct(data)).unwrap();
      notification.success("Product created successfully");
      await loadProducts();
      return true;
    } catch (err) {
      const error = err as { message?: string };
      notification.error(error.message || "Failed to create product");
      return false;
    }
  };

  const handleUpdateProduct = async (productId: string, data: UpdateProductRequest) => {
    try {
      await dispatch(updateProduct({ productId, data })).unwrap();
      notification.success("Product updated successfully");
      await loadProducts();
      return true;
    } catch (err) {
      const error = err as { message?: string };
      notification.error(error.message || "Failed to update product");
      return false;
    }
  };

  const handleDeleteProduct = async (productId: string) => {
    try {
      await dispatch(deleteProduct(productId)).unwrap();
      notification.success("Product deleted successfully");
      await loadProducts();
      return true;
    } catch (err) {
      const error = err as { message?: string };
      notification.error(error.message || "Failed to delete product");
      return false;
    }
  };

  const handlePageChange = (page: number) => {
    dispatch(setCurrentPage(page));
    loadProducts(page);
  };

  const handlePageSizeChange = (size: number) => {
    dispatch(setPageSize(size));
    dispatch(setCurrentPage(1));
    loadProducts(1, size);
  };

  const handleSearchChange = (search: string) => {
    dispatch(setSearchQuery(search));
  };

  const clearProductsError = () => {
    dispatch(clearError());
  };

  const clearProduct = () => {
    dispatch(clearSelectedProduct());
  };

  const clearImage = () => {
    dispatch(clearUploadedImage());
  };

  return {
    products,
    selectedProduct,
    loading,
    error,
    currentPage,
    pageSize,
    total,
    searchQuery,
    uploadingImage,
    uploadedImageUrl,
    loadProducts,
    loadProductById,
    handleUploadImage,
    handleCreateProduct,
    handleUpdateProduct,
    handleDeleteProduct,
    handlePageChange,
    handlePageSizeChange,
    handleSearchChange,
    clearProductsError,
    clearProduct,
    clearImage,
  };
};
