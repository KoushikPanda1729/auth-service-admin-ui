import { useAuth } from "../hooks/useAuth";
import { DashboardLayout } from "../components/layout/DashboardLayout";
import { Card, Row, Col, Typography, Statistic, Tag, Segmented } from "antd";
import { ShoppingCartOutlined, RiseOutlined, UserOutlined, GiftOutlined } from "@ant-design/icons";
import { Line } from "@ant-design/plots";
import { useState } from "react";

const { Title } = Typography;

export const DashboardPage = () => {
  const { user } = useAuth();
  const [timeFilter, setTimeFilter] = useState<string>("Weekly");

  const recentOrders = [
    {
      id: "1",
      name: "Rakesh Kohali",
      address: "main street, bandra",
      amount: "₹ 1250",
      status: "Preparing",
      statusColor: "#fff1f0",
      statusTextColor: "#cf1322",
    },
    {
      id: "2",
      name: "John Doe",
      address: "side street, bandra",
      amount: "₹ 900",
      status: "On the way",
      statusColor: "#e6f7ff",
      statusTextColor: "#0958d9",
    },
    {
      id: "3",
      name: "Naman Kar",
      address: "down street, bandra",
      amount: "₹ 1900",
      status: "Delivered",
      statusColor: "#f6ffed",
      statusTextColor: "#389e0d",
    },
    {
      id: "4",
      name: "Naman Kar",
      address: "down street, bandra",
      amount: "₹ 1900",
      status: "Delivered",
      statusColor: "#f6ffed",
      statusTextColor: "#389e0d",
    },
    {
      id: "5",
      name: "Naman Kar",
      address: "down street, bandra",
      amount: "₹ 1900",
      status: "Delivered",
      statusColor: "#f6ffed",
      statusTextColor: "#389e0d",
    },
  ];

  const salesDataSets: Record<string, Array<{ date: string; value: number }>> = {
    Daily: [
      { date: "12 AM", value: 2000 },
      { date: "4 AM", value: 1500 },
      { date: "8 AM", value: 8000 },
      { date: "12 PM", value: 15000 },
      { date: "4 PM", value: 18000 },
      { date: "8 PM", value: 22000 },
      { date: "11 PM", value: 12000 },
    ],
    Weekly: [
      { date: "Mon", value: 15000 },
      { date: "Tue", value: 12000 },
      { date: "Wed", value: 18000 },
      { date: "Thu", value: 21000 },
      { date: "Fri", value: 25000 },
      { date: "Sat", value: 32000 },
      { date: "Sun", value: 28000 },
    ],
    Monthly: [
      { date: "Week 1", value: 65000 },
      { date: "Week 2", value: 78000 },
      { date: "Week 3", value: 82000 },
      { date: "Week 4", value: 95000 },
    ],
    All: [
      { date: "Jan", value: 180000 },
      { date: "Feb", value: 165000 },
      { date: "Mar", value: 195000 },
      { date: "Apr", value: 210000 },
      { date: "May", value: 225000 },
      { date: "Jun", value: 240000 },
    ],
  };

  const salesData = salesDataSets[timeFilter] || salesDataSets.Weekly;

  const chartConfig = {
    data: salesData,
    xField: "date",
    yField: "value",
    smooth: true,
    color: "#ff4d4f",
    height: 300,
    point: {
      size: 5,
      shape: "circle",
      style: {
        fill: "#ff4d4f",
        stroke: "#fff",
        lineWidth: 2,
      },
    },
    lineStyle: {
      lineWidth: 3,
    },
    yAxis: {
      label: {
        formatter: (v: string) => `₹${(Number.parseInt(v) / 1000).toFixed(0)}k`,
      },
    },
    xAxis: {
      label: {
        style: {
          fill: "#666",
        },
      },
    },
  };

  return (
    <DashboardLayout>
      <div style={{ marginBottom: "32px" }}>
        <Title level={2} style={{ margin: 0 }}>
          Welcome back, {user?.firstName || "Admin"}! 👋
        </Title>
      </div>

      {/* Stats Cards */}
      <Row gutter={[24, 24]}>
        <Col xs={24} sm={12} lg={6}>
          <Card variant="borderless" style={{ borderRadius: "12px" }}>
            <Statistic
              title="Total Orders"
              value={156}
              prefix={<ShoppingCartOutlined style={{ color: "#ff4d4f" }} />}
              valueStyle={{ color: "#000", fontWeight: 600 }}
            />
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <Card variant="borderless" style={{ borderRadius: "12px" }}>
            <Statistic
              title="Total Revenue"
              value={50000}
              prefix="₹"
              suffix={<RiseOutlined style={{ color: "#52c41a", fontSize: "16px" }} />}
              valueStyle={{ color: "#000", fontWeight: 600 }}
            />
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <Card variant="borderless" style={{ borderRadius: "12px" }}>
            <Statistic
              title="Total Customers"
              value={89}
              prefix={<UserOutlined style={{ color: "#1890ff" }} />}
              valueStyle={{ color: "#000", fontWeight: 600 }}
            />
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <Card variant="borderless" style={{ borderRadius: "12px" }}>
            <Statistic
              title="Avg Order Value"
              value={1250}
              prefix="₹"
              valueStyle={{ color: "#000", fontWeight: 600 }}
            />
          </Card>
        </Col>
      </Row>

      {/* Charts & Recent Orders */}
      <Row gutter={[24, 24]} style={{ marginTop: "24px" }}>
        <Col xs={24} lg={16}>
          <Card
            variant="borderless"
            style={{ borderRadius: "12px" }}
            title={<span style={{ fontSize: "18px", fontWeight: 600 }}>Sales Overview</span>}
            extra={
              <Segmented
                options={["Daily", "Weekly", "Monthly", "All"]}
                value={timeFilter}
                onChange={(value) => setTimeFilter(value as string)}
                style={{ fontWeight: 500 }}
              />
            }
          >
            <Line {...chartConfig} />
          </Card>
        </Col>

        <Col xs={24} lg={8}>
          <Card
            variant="borderless"
            style={{ borderRadius: "12px" }}
            title={
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <GiftOutlined style={{ fontSize: "20px", color: "#ff4d4f" }} />
                <span style={{ fontSize: "18px", fontWeight: 600 }}>Recent orders</span>
              </div>
            }
          >
            <div>
              {recentOrders.map((order, index) => (
                <div
                  key={order.id}
                  style={{
                    marginBottom: index < recentOrders.length - 1 ? "24px" : "16px",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "flex-start",
                      marginBottom: "4px",
                    }}
                  >
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 600, fontSize: "14px", marginBottom: "2px" }}>
                        {order.name}
                      </div>
                      <div style={{ fontSize: "13px", color: "#666" }}>{order.address}</div>
                    </div>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "12px",
                        marginLeft: "16px",
                      }}
                    >
                      <span style={{ fontWeight: 600, fontSize: "14px", whiteSpace: "nowrap" }}>
                        {order.amount}
                      </span>
                      <Tag
                        style={{
                          backgroundColor: order.statusColor,
                          color: order.statusTextColor,
                          border: "none",
                          borderRadius: "12px",
                          padding: "2px 12px",
                          fontSize: "12px",
                          margin: 0,
                        }}
                      >
                        {order.status}
                      </Tag>
                    </div>
                  </div>
                </div>
              ))}
              <a
                href="/orders"
                style={{
                  color: "#000",
                  fontSize: "14px",
                  fontWeight: 500,
                  textDecoration: "none",
                  borderBottom: "2px solid #ff4d4f",
                  paddingBottom: "2px",
                  display: "inline-block",
                }}
              >
                See all orders
              </a>
            </div>
          </Card>
        </Col>
      </Row>
    </DashboardLayout>
  );
};
