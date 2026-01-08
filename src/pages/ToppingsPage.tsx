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
import { useToppings } from "../modules/toppings/hooks/useToppings";
import type { Topping } from "../modules/toppings/api/types";
import dayjs from "dayjs";
import { useAppSelector } from "../app/hooks";
import { useTenants } from "../modules/tenants/hooks/useTenants";
import { ToppingDrawer, type ToppingFormValues } from "../components/toppings/ToppingDrawer";

interface ToppingTableData extends Topping {
  key: string;
}

export const ToppingsPage = () => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [editingTopping, setEditingTopping] = useState<ToppingTableData | null>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);

  // Get current user from Redux
  const { user } = useAppSelector((state) => state.login);
  const isAdmin = user?.role === "admin";

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
    loadToppings,
    loadToppingById,
    handleUploadImage,
    handleCreateTopping,
    handleUpdateTopping,
    handleDeleteTopping,
    handleSearchChange,
    handlePageChange,
    clearTopping,
    clearImage,
  } = useToppings();

  // Fetch tenants for admin dropdown
  const { tenants, loadTenants } = useTenants();

  useEffect(() => {
    loadToppings();
    if (isAdmin) {
      loadTenants();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAdmin]);

  const handleEdit = async (topping: ToppingTableData) => {
    await loadToppingById(topping._id);
    setEditingTopping(topping);
    setIsDrawerOpen(true);
  };

  const handleView = async (topping: ToppingTableData) => {
    await loadToppingById(topping._id);
    setIsViewModalOpen(true);
  };

  const handleDelete = (topping: ToppingTableData) => {
    Modal.confirm({
      title: "Delete Topping",
      content: `Are you sure you want to delete "${topping.name}"? This action cannot be undone.`,
      okText: "Delete",
      okType: "danger",
      cancelText: "Cancel",
      async onOk() {
        await handleDeleteTopping(topping._id);
      },
    });
  };

  const getActionMenu = (record: ToppingTableData): MenuProps => ({
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

  const columns: ColumnType<ToppingTableData>[] = [
    {
      title: "Image",
      dataIndex: "image",
      key: "image",
      width: 80,
      render: (image: string) => (
        <Image src={image} alt="Topping" width={50} height={50} style={{ objectFit: "cover" }} />
      ),
    },
    {
      title: "Topping Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Price",
      dataIndex: "price",
      key: "price",
      render: (price: number) => `$${price}`,
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

  const tableData: ToppingTableData[] = toppings.map((topping) => ({
    ...topping,
    key: topping._id,
  }));

  const handleDrawerSubmit = async (values: ToppingFormValues, imageFile?: File) => {
    try {
      if (editingTopping) {
        // Update existing topping
        let imageUrl = editingTopping.image;

        // Upload new image if provided
        if (imageFile) {
          const uploadedUrl = await handleUploadImage(imageFile);
          if (!uploadedUrl) {
            message.error("Failed to upload image");
            return;
          }
          imageUrl = uploadedUrl;
        }

        await handleUpdateTopping(editingTopping._id, {
          name: values.name,
          price: Number(values.price),
          image: imageUrl,
          isPublished: values.isPublished,
        });
        clearImage();
      } else {
        // Create new topping
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

        const createPayload = {
          name: values.name,
          image: imageUrl,
          price: Number(values.price),
          isPublished: values.isPublished,
          ...(isAdmin && values.tenantId && { tenantId: values.tenantId }),
        };

        await handleCreateTopping(createPayload);
        clearImage();
      }

      setEditingTopping(null);
      setIsDrawerOpen(false);
    } catch (error) {
      console.error("Error saving topping:", error);
    }
  };

  const handleDrawerClose = () => {
    setEditingTopping(null);
    setIsDrawerOpen(false);
    clearImage();
    clearTopping();
  };

  const handleCreateNew = () => {
    setEditingTopping(null);
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
        title={<span style={{ fontSize: "20px", fontWeight: "600" }}>Toppings</span>}
        extra={
          <Space>
            <Input
              placeholder="Search toppings..."
              prefix={<SearchOutlined />}
              style={{ width: 200 }}
              value={searchQuery}
              onChange={(e) => {
                handleSearchChange(e.target.value);
                loadToppings();
              }}
              allowClear
            />
            <Button
              type="primary"
              icon={<PlusOutlined />}
              style={{ background: "#ff4d4f" }}
              onClick={handleCreateNew}
            >
              Create Topping
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

      <ToppingDrawer
        open={isDrawerOpen}
        onClose={handleDrawerClose}
        onSubmit={handleDrawerSubmit}
        isAdmin={isAdmin}
        tenants={tenants}
        editingTopping={editingTopping}
        uploadingImage={uploadingImage}
      />

      <Modal
        title="Topping Details"
        open={isViewModalOpen}
        onCancel={() => {
          setIsViewModalOpen(false);
          clearTopping();
        }}
        footer={[
          <Button
            key="close"
            onClick={() => {
              setIsViewModalOpen(false);
              clearTopping();
            }}
          >
            Close
          </Button>,
        ]}
        width={600}
      >
        {selectedTopping && (
          <div style={{ maxHeight: "500px", overflowY: "auto" }}>
            {/* Topping Image */}
            <Card size="small" style={{ marginBottom: "16px" }}>
              <Image
                src={selectedTopping.image}
                alt={selectedTopping.name}
                style={{ width: "100%", maxHeight: "300px", objectFit: "contain" }}
              />
            </Card>

            {/* Basic Info */}
            <Card size="small">
              <h3 style={{ fontSize: "16px", fontWeight: "600", marginBottom: "12px" }}>
                Basic Information
              </h3>
              <Space direction="vertical" style={{ width: "100%" }}>
                <div>
                  <strong>ID:</strong> <span style={{ color: "#666" }}>{selectedTopping._id}</span>
                </div>
                <div>
                  <strong>Name:</strong>{" "}
                  <span style={{ color: "#666" }}>{selectedTopping.name}</span>
                </div>
                <div>
                  <strong>Price:</strong>{" "}
                  <span style={{ color: "#666" }}>${selectedTopping.price}</span>
                </div>
                <div>
                  <strong>Tenant ID:</strong>{" "}
                  <span style={{ color: "#666" }}>{selectedTopping.tenantId}</span>
                </div>
                <div>
                  <strong>Status:</strong>{" "}
                  <Tag color={selectedTopping.isPublished ? "green" : "default"}>
                    {selectedTopping.isPublished ? "Published" : "Draft"}
                  </Tag>
                </div>
                <div>
                  <strong>Created:</strong>{" "}
                  <span style={{ color: "#666" }}>
                    {dayjs(selectedTopping.createdAt).format("DD MMMM YYYY, HH:mm")}
                  </span>
                </div>
                <div>
                  <strong>Updated:</strong>{" "}
                  <span style={{ color: "#666" }}>
                    {dayjs(selectedTopping.updatedAt).format("DD MMMM YYYY, HH:mm")}
                  </span>
                </div>
              </Space>
            </Card>
          </div>
        )}
      </Modal>
    </DashboardLayout>
  );
};
