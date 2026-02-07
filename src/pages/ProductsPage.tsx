import { DashboardLayout } from "../components/layout/DashboardLayout";
import { Card, Table, Tag, Button, Input, Space, Modal, message, Dropdown, Image } from "antd";
import {
  SearchOutlined,
  PlusOutlined,
  MoreOutlined,
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
} from "@ant-design/icons";
import { useState, useEffect } from "react";
import type { ColumnType } from "antd/es/table";
import type { MenuProps } from "antd";
import { useProducts } from "../modules/products/hooks/useProducts";
import { useCategories } from "../modules/categories/hooks/useCategories";
import type { Product } from "../modules/products/api/types";
import dayjs from "dayjs";
import { useAppSelector } from "../app/hooks";
import { useTenants } from "../modules/tenants/hooks/useTenants";
import { ProductDrawer, type ProductFormValues } from "../components/products/ProductDrawer";

interface ProductTableData extends Product {
  key: string;
}

export const ProductsPage = () => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<ProductTableData | null>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);

  // Get current user from Redux
  const { user } = useAppSelector((state) => state.login);
  const isAdmin = user?.role === "admin";

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
    loadProducts,
    loadProductById,
    handleUploadImage,
    handleCreateProduct,
    handleUpdateProduct,
    handleDeleteProduct,
    handleSearchChange,
    handlePageChange,
    clearProduct,
    clearImage,
  } = useProducts();

  // Fetch tenants and categories for form
  const { tenants, loadTenants } = useTenants();
  const { categories, loadCategories } = useCategories();

  useEffect(() => {
    loadProducts();
    loadCategories();
    if (isAdmin) {
      loadTenants();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAdmin]);

  const handleEdit = async (product: ProductTableData) => {
    // Fetch full product details to ensure category is populated
    await loadProductById(product._id);
    // Use the product from table as it already has the full category populated
    setEditingProduct(product);
    setIsDrawerOpen(true);
  };

  const handleView = async (product: ProductTableData) => {
    await loadProductById(product._id);
    setIsViewModalOpen(true);
  };

  const handleDelete = (product: ProductTableData) => {
    Modal.confirm({
      title: "Delete Product",
      content: `Are you sure you want to delete "${product.name}"? This action cannot be undone.`,
      okText: "Delete",
      okType: "danger",
      cancelText: "Cancel",
      async onOk() {
        await handleDeleteProduct(product._id);
      },
    });
  };

  const getActionMenu = (record: ProductTableData): MenuProps => ({
    items: [
      {
        key: "view",
        icon: <EyeOutlined />,
        label: "View",
        onClick: () => handleView(record),
      },
      {
        key: "edit",
        icon: <EditOutlined />,
        label: "Edit",
        onClick: () => handleEdit(record),
      },
      {
        key: "delete",
        icon: <DeleteOutlined />,
        label: "Delete",
        danger: true,
        onClick: () => handleDelete(record),
      },
    ],
  });

  const columns: ColumnType<ProductTableData>[] = [
    {
      title: "Image",
      dataIndex: "image",
      key: "image",
      width: 80,
      render: (image: string) => (
        <Image src={image} alt="Product" width={50} height={50} style={{ objectFit: "cover" }} />
      ),
    },
    {
      title: "Product Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Category",
      dataIndex: ["category", "name"],
      key: "category",
    },
    {
      title: "Status",
      dataIndex: "isPublished",
      key: "isPublished",
      render: (isPublished: boolean) => (
        <Tag color={isPublished ? "green" : "default"}>{isPublished ? "Published" : "Draft"}</Tag>
      ),
    },
    {
      title: "Created at",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (date: string) => dayjs(date).format("DD MMMM YYYY"),
    },
    {
      title: "Actions",
      key: "actions",
      width: 80,
      render: (_, record) => (
        <Dropdown menu={getActionMenu(record)} trigger={["click"]}>
          <Button type="text" icon={<MoreOutlined />} />
        </Dropdown>
      ),
    },
  ];

  const tableData: ProductTableData[] = products.map((product) => ({
    ...product,
    key: product._id,
  }));

  const handleDrawerSubmit = async (values: ProductFormValues, imageFile?: File) => {
    try {
      if (editingProduct) {
        // Update existing product
        let imageUrl = editingProduct.image;

        // Upload new image if provided
        if (imageFile) {
          const uploadedUrl = await handleUploadImage(imageFile);
          if (!uploadedUrl) {
            message.error("Failed to upload image");
            return;
          }
          imageUrl = uploadedUrl;
        }

        await handleUpdateProduct(editingProduct._id, {
          name: values.name,
          description: values.description,
          image: imageUrl,
          isPublished: values.isPublished,
        });
        clearImage();
      } else {
        // Create new product
        let imageUrl = values.image;

        // Upload image if provided
        if (imageFile) {
          const uploadedUrl = await handleUploadImage(imageFile);
          if (!uploadedUrl) {
            message.error("Failed to upload image");
            return;
          }
          imageUrl = uploadedUrl;
        }

        if (!imageUrl) {
          message.error("Please upload an image");
          return;
        }

        // Transform priceConfiguration to match API structure
        const selectedCategory = categories.find((c) => c._id === values.category);
        const transformedPriceConfig: {
          [key: string]: {
            priceType: "base" | "additional";
            availableOptions: {
              [option: string]: number;
            };
          };
        } = {};

        if (selectedCategory && values.priceConfiguration) {
          Object.entries(values.priceConfiguration).forEach(([configKey, options]) => {
            const categoryConfig = selectedCategory.priceCofigration[configKey];
            if (categoryConfig) {
              transformedPriceConfig[configKey] = {
                priceType: categoryConfig.priceType,
                availableOptions: Object.entries(options as Record<string, number>).reduce(
                  (acc, [option, price]) => {
                    acc[option] = Number(price);
                    return acc;
                  },
                  {} as Record<string, number>
                ),
              };
            }
          });
        }

        const createPayload = {
          name: values.name,
          description: values.description,
          image: imageUrl,
          category: values.category,
          priceConfiguration: transformedPriceConfig,
          attributes: values.attributes,
          isPublished: values.isPublished,
          ...(isAdmin && values.tenantId && { tenantId: values.tenantId }),
        };

        await handleCreateProduct(createPayload);
        clearImage();
      }

      setEditingProduct(null);
      setIsDrawerOpen(false);
    } catch (error) {
      console.error("Error saving product:", error);
    }
  };

  const handleDrawerClose = () => {
    setEditingProduct(null);
    setIsDrawerOpen(false);
    clearImage();
    clearProduct();
  };

  const handleCreateNew = () => {
    setEditingProduct(null);
    setIsDrawerOpen(true);
  };

  useEffect(() => {
    if (error) {
      message.error(error);
    }
  }, [error]);

  return (
    <DashboardLayout>
      <Card
        style={{ borderRadius: "12px" }}
        title={<span style={{ fontSize: "20px", fontWeight: "600" }}>Products</span>}
        extra={
          <Space>
            <Input
              placeholder="Search products..."
              prefix={<SearchOutlined />}
              style={{ width: 200 }}
              value={searchQuery}
              onChange={(e) => {
                handleSearchChange(e.target.value);
                loadProducts();
              }}
              allowClear
            />
            <Button
              type="primary"
              icon={<PlusOutlined />}
              style={{ background: "#ff4d4f" }}
              onClick={handleCreateNew}
            >
              Create Product
            </Button>
          </Space>
        }
      >
        <Table
          columns={columns}
          dataSource={tableData}
          loading={loading}
          pagination={{
            current: currentPage,
            pageSize: pageSize,
            total: total,
            showSizeChanger: false,
            onChange: handlePageChange,
          }}
        />
      </Card>

      <ProductDrawer
        open={isDrawerOpen}
        onClose={handleDrawerClose}
        onSubmit={handleDrawerSubmit}
        isAdmin={isAdmin}
        tenants={tenants}
        categories={categories}
        editingProduct={editingProduct}
        uploadingImage={uploadingImage}
      />

      <Modal
        title="Product Details"
        open={isViewModalOpen}
        onCancel={() => {
          setIsViewModalOpen(false);
          clearProduct();
        }}
        footer={[
          <Button
            key="close"
            onClick={() => {
              setIsViewModalOpen(false);
              clearProduct();
            }}
          >
            Close
          </Button>,
        ]}
        width={800}
      >
        {selectedProduct && (
          <div style={{ maxHeight: "600px", overflowY: "auto" }}>
            {/* Product Image */}
            <Card size="small" style={{ marginBottom: "16px" }}>
              <Image
                src={selectedProduct.image}
                alt={selectedProduct.name}
                style={{ width: "100%", maxHeight: "300px", objectFit: "contain" }}
              />
            </Card>

            {/* Basic Info */}
            <Card size="small" style={{ marginBottom: "16px" }}>
              <h3 style={{ fontSize: "16px", fontWeight: "600", marginBottom: "12px" }}>
                Basic Information
              </h3>
              <Space direction="vertical" style={{ width: "100%" }}>
                <div>
                  <strong>ID:</strong> <span style={{ color: "#666" }}>{selectedProduct._id}</span>
                </div>
                <div>
                  <strong>Name:</strong>{" "}
                  <span style={{ color: "#666" }}>{selectedProduct.name}</span>
                </div>
                <div>
                  <strong>Description:</strong>{" "}
                  <span style={{ color: "#666" }}>{selectedProduct.description}</span>
                </div>
                <div>
                  <strong>Category:</strong>{" "}
                  <span style={{ color: "#666" }}>{selectedProduct.category.name}</span>
                </div>
                <div>
                  <strong>Tenant ID:</strong>{" "}
                  <span style={{ color: "#666" }}>{selectedProduct.tenantId}</span>
                </div>
                <div>
                  <strong>Status:</strong>{" "}
                  <Tag color={selectedProduct.isPublished ? "green" : "default"}>
                    {selectedProduct.isPublished ? "Published" : "Draft"}
                  </Tag>
                </div>
                <div>
                  <strong>Created:</strong>{" "}
                  <span style={{ color: "#666" }}>
                    {dayjs(selectedProduct.createdAt).format("DD MMMM YYYY, HH:mm")}
                  </span>
                </div>
              </Space>
            </Card>

            {/* Price Configuration */}
            <Card size="small" style={{ marginBottom: "16px" }}>
              <h3 style={{ fontSize: "16px", fontWeight: "600", marginBottom: "12px" }}>
                Price Configuration
              </h3>
              {Object.entries(selectedProduct.priceConfiguration).map(([key, config]) => (
                <Card
                  key={key}
                  type="inner"
                  size="small"
                  title={key.charAt(0).toUpperCase() + key.slice(1)}
                  style={{ marginBottom: "8px" }}
                >
                  <Space direction="vertical" style={{ width: "100%" }}>
                    <div>
                      <strong>Price Type:</strong>{" "}
                      <Tag color={config.priceType === "base" ? "blue" : "orange"}>
                        {config.priceType === "base" ? "Base Price" : "Additional Price"}
                      </Tag>
                    </div>
                    <div>
                      <strong>Options:</strong>
                      <div style={{ marginTop: "8px" }}>
                        {Object.entries(config.availableOptions).map(([option, price]) => (
                          <Tag key={option} color="green" style={{ marginBottom: "4px" }}>
                            {option}: ${price}
                          </Tag>
                        ))}
                      </div>
                    </div>
                  </Space>
                </Card>
              ))}
            </Card>

            {/* Attributes */}
            {selectedProduct.attributes && selectedProduct.attributes.length > 0 && (
              <Card size="small">
                <h3 style={{ fontSize: "16px", fontWeight: "600", marginBottom: "12px" }}>
                  Attributes
                </h3>
                {selectedProduct.attributes.map((attr) => (
                  <Card
                    key={attr._id}
                    type="inner"
                    size="small"
                    title={attr.name}
                    style={{ marginBottom: "8px" }}
                  >
                    <div>
                      <strong>Value:</strong> <span style={{ color: "#666" }}>{attr.value}</span>
                    </div>
                  </Card>
                ))}
              </Card>
            )}
          </div>
        )}
      </Modal>
    </DashboardLayout>
  );
};
