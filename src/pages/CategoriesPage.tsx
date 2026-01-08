import { DashboardLayout } from "../components/layout/DashboardLayout";
import {
  Card,
  Table,
  Tag,
  Button,
  Input,
  Space,
  Modal,
  Form,
  Switch,
  message,
  Dropdown,
} from "antd";
import {
  SearchOutlined,
  PlusOutlined,
  CloseOutlined,
  MoreOutlined,
  EditOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import { useState, useEffect } from "react";
import type { ColumnType } from "antd/es/table";
import type { MenuProps } from "antd";
import { useCategories } from "../modules/categories/hooks/useCategories";
import type { Category } from "../modules/categories/api/types";
import dayjs from "dayjs";

interface CategoryTableData extends Category {
  key: string;
}

export const CategoriesPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<CategoryTableData | null>(null);
  const [form] = Form.useForm();

  const {
    categories,
    loading,
    error,
    currentPage,
    pageSize,
    total,
    searchQuery,
    loadCategories,
    handleCreateCategory,
    handleUpdateCategory,
    handleDeleteCategory,
    handleSearchChange,
    handlePageChange,
  } = useCategories();

  useEffect(() => {
    loadCategories();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleEdit = (category: CategoryTableData) => {
    setEditingCategory(category);
    form.setFieldsValue({
      name: category.name,
      publish: category.isPublished ?? true,
    });
    setIsModalOpen(true);
  };

  const handleDelete = (category: CategoryTableData) => {
    Modal.confirm({
      title: "Delete Category",
      content: `Are you sure you want to delete "${category.name}"? This action cannot be undone.`,
      okText: "Delete",
      okType: "danger",
      cancelText: "Cancel",
      async onOk() {
        await handleDeleteCategory(category._id);
      },
    });
  };

  const getActionMenu = (record: CategoryTableData): MenuProps => ({
    items: [
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

  const columns: ColumnType<CategoryTableData>[] = [
    {
      title: "Category name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Status",
      dataIndex: "isPublished",
      key: "isPublished",
      render: (isPublished?: boolean) => (
        <Tag color={isPublished !== false ? "green" : "default"}>
          {isPublished !== false ? "Published" : "Draft"}
        </Tag>
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

  const tableData: CategoryTableData[] = categories.map((category) => ({
    ...category,
    key: category._id,
  }));

  const handleSave = async () => {
    try {
      const values = await form.validateFields();
      if (editingCategory) {
        await handleUpdateCategory(editingCategory._id, {
          name: values.name,
          priceCofigration: editingCategory.priceCofigration,
          attributes: editingCategory.attributes,
          isPublished: values.publish,
        });
      } else {
        await handleCreateCategory({
          name: values.name,
          priceCofigration: {},
          attributes: [],
          isPublished: values.publish,
        });
      }
      form.resetFields();
      setEditingCategory(null);
      setIsModalOpen(false);
    } catch (error) {
      console.error("Error saving category:", error);
    }
  };

  const handleCancel = () => {
    form.resetFields();
    setEditingCategory(null);
    setIsModalOpen(false);
  };

  const handleCreateNew = () => {
    setEditingCategory(null);
    form.resetFields();
    setIsModalOpen(true);
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
        title={<span style={{ fontSize: "20px", fontWeight: "600" }}>Categories</span>}
        extra={
          <Space>
            <Input
              placeholder="Search categories..."
              prefix={<SearchOutlined />}
              style={{ width: 200 }}
              value={searchQuery}
              onChange={(e) => {
                handleSearchChange(e.target.value);
                loadCategories();
              }}
              allowClear
            />
            <Button
              type="primary"
              icon={<PlusOutlined />}
              style={{ background: "#ff4d4f" }}
              onClick={handleCreateNew}
            >
              Create Category
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

      <Modal
        open={isModalOpen}
        onCancel={handleCancel}
        footer={null}
        closeIcon={<CloseOutlined />}
        width={400}
      >
        <h2 style={{ fontSize: "18px", fontWeight: "600", marginBottom: "24px" }}>
          {editingCategory ? "Edit category" : "Create category"}
        </h2>
        <Form form={form} layout="vertical" initialValues={{ publish: true }}>
          <Form.Item
            label="Category name"
            name="name"
            rules={[{ required: true, message: "Please enter category name" }]}
          >
            <Input placeholder="Enter category name" />
          </Form.Item>

          <Form.Item name="publish" valuePropName="checked" style={{ marginBottom: "24px" }}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <span>Publish</span>
              <Switch />
            </div>
          </Form.Item>

          <div style={{ display: "flex", justifyContent: "flex-end", gap: "8px" }}>
            <Button onClick={handleCancel}>Cancel</Button>
            <Button
              type="primary"
              icon={editingCategory ? <EditOutlined /> : <PlusOutlined />}
              style={{ background: "#ff4d4f" }}
              onClick={handleSave}
            >
              {editingCategory ? "Update" : "Create"}
            </Button>
          </div>
        </Form>
      </Modal>
    </DashboardLayout>
  );
};
