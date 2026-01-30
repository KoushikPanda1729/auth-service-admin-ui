import { useEffect } from "react";
import { DashboardLayout } from "../components/layout/DashboardLayout";
import { Card, Table, Tag, Button, Input, Space } from "antd";
import { SearchOutlined, PlusOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import type { ColumnType } from "antd/es/table";
import dayjs from "dayjs";
import { useOrders } from "../modules/orders/hooks/useOrders";
import type { Order } from "../modules/orders/api/types";

export const OrdersPage = () => {
  const navigate = useNavigate();
  const {
    orders,
    loading,
    currentPage,
    pageSize,
    total,
    searchQuery,
    loadOrders,
    handlePageChange,
    handleSearchChange,
  } = useOrders();

  useEffect(() => {
    loadOrders();
  }, []);

  useEffect(() => {
    loadOrders(1, pageSize, searchQuery);
  }, [searchQuery]);

  const columns: ColumnType<Order>[] = [
    {
      title: "Customer ID",
      dataIndex: "customerId",
      key: "customerId",
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
        const statusConfig: Record<string, { color: string; text: string }> = {
          pending: { color: "gold", text: "Pending" },
          preparing: { color: "orange", text: "Preparing" },
          "on-way": { color: "blue", text: "On way" },
          delivered: { color: "green", text: "Delivered" },
        };
        const config = statusConfig[status] || { color: "default", text: status };
        return <Tag color={config.color}>{config.text}</Tag>;
      },
    },
    {
      title: "Order amount",
      dataIndex: "total",
      key: "total",
      render: (total: number) => `₹ ${total}`,
    },
    {
      title: "Placed time",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (createdAt: string) => dayjs(createdAt).format("DD MMM YYYY hh:mm A"),
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
              value={searchQuery}
              onChange={(e) => handleSearchChange(e.target.value)}
              allowClear
            />
            <Button type="primary" icon={<PlusOutlined />} style={{ background: "#ff4d4f" }}>
              Create order
            </Button>
          </Space>
        }
      >
        <Table
          columns={columns}
          dataSource={orders}
          rowKey="_id"
          loading={loading}
          pagination={{
            current: currentPage,
            pageSize: pageSize,
            total: total,
            showSizeChanger: false,
            onChange: handlePageChange,
          }}
          onRow={(record) => ({
            onClick: () => {
              navigate(`/orders/${record._id}`);
            },
            style: { cursor: "pointer" },
          })}
        />
      </Card>
    </DashboardLayout>
  );
};
