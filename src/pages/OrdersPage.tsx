import { useEffect } from "react";
import { DashboardLayout } from "../components/layout/DashboardLayout";
import { Card, Table, Tag, Button, Input, Space, Select } from "antd";
import { SearchOutlined, PlusOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import type { ColumnType } from "antd/es/table";
import dayjs from "dayjs";
import { useOrders } from "../modules/orders/hooks/useOrders";
import type { Order } from "../modules/orders/api/types";

const { Option } = Select;

export const OrdersPage = () => {
  const navigate = useNavigate();
  const {
    orders,
    loading,
    currentPage,
    pageSize,
    total,
    searchQuery,
    statusFilter,
    tenantIdFilter,
    loadOrders,
    handlePageChange,
    handleSearchChange,
    handleStatusFilterChange,
    handleTenantIdFilterChange,
  } = useOrders();

  useEffect(() => {
    loadOrders(1, pageSize, searchQuery, statusFilter, tenantIdFilter);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchQuery, statusFilter, tenantIdFilter]);

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
          pending: { color: "gray", text: "Pending" },
          confirmed: { color: "gold", text: "Confirmed" },
          preparing: { color: "orange", text: "Preparing" },
          out_for_delivery: { color: "blue", text: "Out for Delivery" },
          delivered: { color: "green", text: "Delivered" },
        };
        const config = statusConfig[status] || { color: "default", text: status };
        return <Tag color={config.color}>{config.text}</Tag>;
      },
    },
    {
      title: "Payment status",
      dataIndex: "paymentStatus",
      key: "paymentStatus",
      render: (paymentStatus: string) => {
        const paymentConfig: Record<string, { color: string; text: string }> = {
          pending: { color: "warning", text: "Pending" },
          paid: { color: "success", text: "Paid" },
          failed: { color: "error", text: "Failed" },
          refunded: { color: "default", text: "Refunded" },
        };
        const config = paymentConfig[paymentStatus] || { color: "default", text: paymentStatus };
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
            <Select
              placeholder="Filter by status"
              style={{ width: 180 }}
              value={statusFilter || undefined}
              onChange={handleStatusFilterChange}
              allowClear
            >
              <Option value="">All</Option>
              <Option value="pending">Pending</Option>
              <Option value="confirmed">Confirmed</Option>
              <Option value="preparing">Preparing</Option>
              <Option value="out_for_delivery">Out for Delivery</Option>
              <Option value="delivered">Delivered</Option>
            </Select>
            <Select
              placeholder="Filter by tenant"
              style={{ width: 150 }}
              value={tenantIdFilter || undefined}
              onChange={handleTenantIdFilterChange}
              allowClear
            >
              <Option value="">All Tenants</Option>
            </Select>
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
