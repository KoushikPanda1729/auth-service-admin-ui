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
import { useState } from "react";
import type { ColumnType } from "antd/es/table";
import type { MenuProps } from "antd";

interface CategoryData {
  key: string;
  id: string;
  name: string;
  status: "published" | "draft";
  createdAt: string;
}

export const CategoriesPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<CategoryData | null>(null);
  const [form] = Form.useForm();

  const handleEdit = (category: CategoryData) => {
    setEditingCategory(category);
    form.setFieldsValue({
      name: category.name,
      publish: category.status === "published",
    });
    setIsModalOpen(true);
  };

  const handleDelete = (category: CategoryData) => {
    Modal.confirm({
      title: "Delete Category",
      content: `Are you sure you want to delete "${category.name}"? This action cannot be undone.`,
      okText: "Delete",
      okType: "danger",
      cancelText: "Cancel",
      onOk() {
        console.log("Deleting category:", category.id);
        message.success("Category deleted successfully!");
      },
    });
  };

  const getActionMenu = (record: CategoryData): MenuProps => ({
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

  const columns: ColumnType<CategoryData>[] = [
    {
      title: "Category name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status: string) => {
        const statusConfig = {
          published: { color: "green", text: "Published" },
          draft: { color: "default", text: "Draft" },
        };
        const config = statusConfig[status as keyof typeof statusConfig];
        return <Tag color={config.color}>{config.text}</Tag>;
      },
    },
    {
      title: "Created at",
      dataIndex: "createdAt",
      key: "createdAt",
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

  const data: CategoryData[] = [
    {
      key: "1",
      id: "1",
      name: "Pizza",
      status: "published",
      createdAt: "25 July 2022",
    },
    {
      key: "2",
      id: "2",
      name: "Cold drinks",
      status: "published",
      createdAt: "25 July 2022",
    },
  ];

  const handleSave = () => {
    form.validateFields().then((values) => {
      if (editingCategory) {
        console.log("Updating category:", editingCategory.id, values);
        message.success("Category updated successfully!");
      } else {
        console.log("Creating category:", values);
        message.success("Category created successfully!");
      }
      form.resetFields();
      setEditingCategory(null);
      setIsModalOpen(false);
    });
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

  return (
    <DashboardLayout>
      <Card
        bordered={false}
        style={{ borderRadius: "12px" }}
        title={<span style={{ fontSize: "20px", fontWeight: "600" }}>Categories</span>}
        extra={
          <Space>
            <Input
              placeholder="Search categories..."
              prefix={<SearchOutlined />}
              style={{ width: 200 }}
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
          dataSource={data}
          pagination={{
            pageSize: 10,
            showSizeChanger: false,
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
