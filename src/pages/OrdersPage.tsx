import { DashboardLayout } from "../components/layout/DashboardLayout";
import { Card, Table, Tag, Button, Input, Space } from "antd";
import { SearchOutlined, PlusOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import type { ColumnType } from "antd/es/table";

interface OrderData {
  key: string;
  id: string;
  customerName: string;
  address: string;
  status: "preparing" | "delivered" | "on-way";
  amount: number;
  placedTime: string;
}

export const OrdersPage = () => {
  const navigate = useNavigate();

  const columns: ColumnType<OrderData>[] = [
    {
      title: "Customer name",
      dataIndex: "customerName",
      key: "customerName",
    },
    {
      title: "Address",
      dataIndex: "address",
      key: "address",
    },
    {
      title: "Order status",
      dataIndex: "status",
      key: "status",
      render: (status: string) => {
        const statusConfig = {
          preparing: { color: "orange", text: "Preparing" },
          delivered: { color: "green", text: "Delivered" },
          "on-way": { color: "blue", text: "On way" },
        };
        const config = statusConfig[status as keyof typeof statusConfig];
        return <Tag color={config.color}>{config.text}</Tag>;
      },
    },
    {
      title: "Order amount",
      dataIndex: "amount",
      key: "amount",
      render: (amount: number) => `₹ ${amount}`,
    },
    {
      title: "Placed time",
      dataIndex: "placedTime",
      key: "placedTime",
    },
  ];

  const data: OrderData[] = [
    {
      key: "1",
      id: "3423232",
      customerName: "Rakesh Kohali",
      address: "Main street, Bandra, Mumbai 403 515",
      status: "preparing",
      amount: 1250,
      placedTime: "25 July 2022 11:30 PM",
    },
    {
      key: "2",
      id: "3423233",
      customerName: "John Doe",
      address: "Left street, Bandra, Mumbai 403 515",
      status: "delivered",
      amount: 1000,
      placedTime: "25 July 2022 11:30 PM",
    },
    {
      key: "3",
      id: "3423234",
      customerName: "Jane Doe",
      address: "Down street, Bandra, Mumbai 403 515",
      status: "on-way",
      amount: 650,
      placedTime: "25 July 2022 11:30 PM",
    },
    {
      key: "4",
      id: "3423235",
      customerName: "Jane Doe",
      address: "Down street, Bandra, Mumbai 403 515",
      status: "delivered",
      amount: 4500,
      placedTime: "25 July 2022 11:30 PM",
    },
    {
      key: "5",
      id: "3423236",
      customerName: "Jane Doe",
      address: "Down street, Bandra, Mumbai 403 515",
      status: "preparing",
      amount: 900,
      placedTime: "25 July 2022 11:30 PM",
    },
  ];

  return (
    <DashboardLayout>
      <Card
        style={{ borderRadius: "12px" }}
        title={<span style={{ fontSize: "20px", fontWeight: "600" }}>Orders</span>}
        extra={
          <Space>
            <Input
              placeholder="Search orders..."
              prefix={<SearchOutlined />}
              style={{ width: 250 }}
            />
            <Button type="primary" icon={<PlusOutlined />} style={{ background: "#ff4d4f" }}>
              Create order
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
              navigate(`/orders/${record.id}`);
            },
            style: { cursor: "pointer" },
          })}
        />
      </Card>
    </DashboardLayout>
  );
};
