import { DashboardLayout } from "../components/layout/DashboardLayout";
import { Card, Table, Tag, Button, Input, Select, Space, Avatar } from "antd";
import { SearchOutlined, PlusOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import type { ColumnType } from "antd/es/table";

const { Option } = Select;

interface ToppingData {
  key: string;
  id: string;
  name: string;
  availableFor: string;
  status: "published" | "draft";
  createdAt: string;
  image: string;
}

export const ToppingsPage = () => {
  const navigate = useNavigate();

  const columns: ColumnType<ToppingData>[] = [
    {
      title: "Topping's name",
      dataIndex: "name",
      key: "name",
      render: (name: string, record: ToppingData) => (
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <Avatar size={48} style={{ fontSize: "24px" }}>
            {record.image}
          </Avatar>
          <span>{name}</span>
        </div>
      ),
    },
    {
      title: "Available for",
      dataIndex: "availableFor",
      key: "availableFor",
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

  const data: ToppingData[] = [
    {
      key: "1",
      id: "1",
      name: "Cheddar",
      availableFor: "Pizza",
      status: "published",
      createdAt: "25 July 2022",
      image: "🧀",
    },
    {
      key: "2",
      id: "2",
      name: "Chicken",
      availableFor: "Pizza",
      status: "published",
      createdAt: "25 July 2022",
      image: "🍗",
    },
    {
      key: "3",
      id: "3",
      name: "Mushroom",
      availableFor: "Pizza",
      status: "published",
      createdAt: "25 July 2022",
      image: "🍄",
    },
    {
      key: "4",
      id: "4",
      name: "Jalapeno",
      availableFor: "Pizza",
      status: "published",
      createdAt: "25 July 2022",
      image: "🌶️",
    },
    {
      key: "5",
      id: "5",
      name: "Jalapeno",
      availableFor: "Pizza",
      status: "published",
      createdAt: "25 July 2022",
      image: "🌶️",
    },
  ];

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
            />
            <Select placeholder="Status" style={{ width: 150 }}>
              <Option value="all">All Status</Option>
              <Option value="published">Published</Option>
              <Option value="draft">Draft</Option>
            </Select>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              style={{ background: "#ff4d4f" }}
              onClick={() => navigate("/toppings/create")}
            >
              Create topping
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
              navigate(`/toppings/${record.id}`);
            },
            style: { cursor: "pointer" },
          })}
        />
      </Card>
    </DashboardLayout>
  );
};
