import { DashboardLayout } from "../components/layout/DashboardLayout";
import { Card, Table, Tag, Button, Input, Select, Space, Avatar } from "antd";
import { SearchOutlined, PlusOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import type { ColumnType } from "antd/es/table";

const { Option } = Select;

interface ProductData {
  key: string;
  id: string;
  name: string;
  description: string;
  category: string;
  status: "published" | "draft";
  createdAt: string;
  image: string;
}

export const MenuPage = () => {
  const navigate = useNavigate();

  const columns: ColumnType<ProductData>[] = [
    {
      title: "Product name",
      dataIndex: "name",
      key: "name",
      render: (name: string, record: ProductData) => (
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <Avatar size={48} style={{ fontSize: "24px" }}>
            {record.image}
          </Avatar>
          <span>{name}</span>
        </div>
      ),
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
      width: "30%",
    },
    {
      title: "Category",
      dataIndex: "category",
      key: "category",
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
  ];

  const data: ProductData[] = [
    {
      key: "1",
      id: "1",
      name: "Pepperoni Pizza",
      description: "Juicy chicken fillet and crispy bacon combined with...",
      category: "Pizza",
      status: "published",
      createdAt: "25 July 2022",
      image: "🍕",
    },
    {
      key: "2",
      id: "2",
      name: "Margarita",
      description: "Juicy chicken fillet and crispy bacon combined with...",
      category: "Pizza",
      status: "draft",
      createdAt: "25 July 2022",
      image: "🍕",
    },
    {
      key: "3",
      id: "3",
      name: "Pepsi",
      description: "Outstanding flavor cake ding by Pepsi",
      category: "Cold drinks",
      status: "published",
      createdAt: "25 July 2022",
      image: "🥤",
    },
    {
      key: "4",
      id: "4",
      name: "Orange Juice",
      description: "Fresh apple juicy with from great quality oranges",
      category: "Cold drinks",
      status: "published",
      createdAt: "25 July 2022",
      image: "🧃",
    },
  ];

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
            />
            <Select placeholder="Category" style={{ width: 150 }}>
              <Option value="all">All Categories</Option>
              <Option value="pizza">Pizza</Option>
              <Option value="drinks">Cold drinks</Option>
            </Select>
            <Select placeholder="Status" style={{ width: 150 }}>
              <Option value="all">All Status</Option>
              <Option value="published">Published</Option>
              <Option value="draft">Draft</Option>
            </Select>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              style={{ background: "#ff4d4f" }}
              onClick={() => navigate("/products/create")}
            >
              Create product
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
          onRow={(record) => ({
            onClick: () => {
              navigate(`/products/${record.id}`);
            },
            style: { cursor: "pointer" },
          })}
        />
      </Card>
    </DashboardLayout>
  );
};
