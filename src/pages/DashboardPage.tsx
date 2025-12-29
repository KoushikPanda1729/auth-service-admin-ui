import { useAuth } from "../hooks/useAuth";
import { DashboardLayout } from "../components/layout/DashboardLayout";
import { Card, Row, Col, Typography, Tag, Button, Segmented } from "antd";
import { ShoppingCartOutlined, RiseOutlined, ShoppingOutlined } from "@ant-design/icons";
import { Line } from "@ant-design/plots";

const { Title, Text } = Typography;

export const DashboardPage = () => {
  const { user } = useAuth();

  const statsData = [
    {
      title: "Total orders",
      value: "28",
      icon: <ShoppingCartOutlined style={{ fontSize: "24px", color: "#52c41a" }} />,
      bgColor: "#f6ffed",
    },
    {
      title: "Total sale",
      value: "₹ 50 000",
      icon: <RiseOutlined style={{ fontSize: "24px", color: "#1890ff" }} />,
      bgColor: "#e6f7ff",
    },
    {
      title: "Recent orders",
      icon: <ShoppingOutlined style={{ fontSize: "24px", color: "#ff4d4f" }} />,
      bgColor: "#fff1f0",
    },
  ];

  const recentOrders = [
    {
      name: "Rakesh Kohali",
      address: "main street, bandra",
      amount: "₹ 1250",
      status: "Preparing",
      statusColor: "orange",
    },
    {
      name: "John Doe",
      address: "side street, bandra",
      amount: "₹ 900",
      status: "On the way",
      statusColor: "blue",
    },
    {
      name: "Naman Kar",
      address: "down street, bandra",
      amount: "₹ 1900",
      status: "Delivered",
      statusColor: "green",
    },
    {
      name: "Naman Kar",
      address: "down street, bandra",
      amount: "₹ 1900",
      status: "Delivered",
      statusColor: "green",
    },
    {
      name: "Naman Kar",
      address: "down street, bandra",
      amount: "₹ 1900",
      status: "Delivered",
      statusColor: "green",
    },
  ];

  const salesData = [
    { date: "1 Jan", value: 10000 },
    { date: "2 Jan", value: 6000 },
    { date: "3 Jan", value: 18000 },
    { date: "4 Jan", value: 24000 },
    { date: "5 Jan", value: 20000 },
    { date: "6 Jan", value: 28000 },
  ];

  const chartConfig = {
    data: salesData,
    xField: "date",
    yField: "value",
    smooth: true,
    color: "#ff6b6b",
    point: {
      size: 0,
    },
    lineStyle: {
      lineWidth: 2,
    },
    yAxis: {
      label: {
        formatter: (v: string) => `₹ ${parseInt(v) / 1000} 000`,
      },
    },
  };

  return (
    <DashboardLayout>
      <div style={{ marginBottom: "24px" }}>
        <Title level={3} style={{ marginBottom: "4px" }}>
          Good morning
        </Title>
        <Title level={2} style={{ marginTop: 0 }}>
          {user?.firstName || "Rakesh"} 😊
        </Title>
      </div>

      <Row gutter={[16, 16]}>
        <Col xs={24} md={8}>
          <Card
            bordered={false}
            style={{
              borderRadius: "12px",
              background: statsData[0].bgColor,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <div
                style={{
                  background: "#fff",
                  padding: "12px",
                  borderRadius: "8px",
                }}
              >
                {statsData[0].icon}
              </div>
              <div>
                <Text type="secondary" style={{ display: "block" }}>
                  {statsData[0].title}
                </Text>
                <Title level={2} style={{ margin: 0 }}>
                  {statsData[0].value}
                </Title>
              </div>
            </div>
          </Card>
        </Col>

        <Col xs={24} md={8}>
          <Card
            bordered={false}
            style={{
              borderRadius: "12px",
              background: statsData[1].bgColor,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <div
                style={{
                  background: "#fff",
                  padding: "12px",
                  borderRadius: "8px",
                }}
              >
                {statsData[1].icon}
              </div>
              <div>
                <Text type="secondary" style={{ display: "block" }}>
                  {statsData[1].title}
                </Text>
                <Title level={2} style={{ margin: 0 }}>
                  {statsData[1].value}
                </Title>
              </div>
            </div>
          </Card>
        </Col>

        <Col xs={24} md={8}>
          <Card
            bordered={false}
            style={{
              borderRadius: "12px",
              background: statsData[2].bgColor,
              height: "100%",
            }}
          >
            <div
              style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "16px" }}
            >
              <div
                style={{
                  background: "#fff",
                  padding: "12px",
                  borderRadius: "8px",
                }}
              >
                {statsData[2].icon}
              </div>
              <Text strong style={{ fontSize: "16px" }}>
                {statsData[2].title}
              </Text>
            </div>
            {recentOrders.slice(0, 2).map((order, index) => (
              <div
                key={index}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: "12px",
                }}
              >
                <div>
                  <Text strong style={{ display: "block" }}>
                    {order.name}
                  </Text>
                  <Text type="secondary" style={{ fontSize: "12px" }}>
                    {order.address}
                  </Text>
                </div>
                <div style={{ textAlign: "right" }}>
                  <Text strong style={{ display: "block" }}>
                    {order.amount}
                  </Text>
                  <Tag color={order.statusColor} style={{ margin: 0 }}>
                    {order.status}
                  </Tag>
                </div>
              </div>
            ))}
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]} style={{ marginTop: "16px" }}>
        <Col xs={24} lg={14}>
          <Card
            bordered={false}
            style={{ borderRadius: "12px" }}
            title={
              <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <div
                  style={{
                    background: "#e6f7ff",
                    padding: "8px",
                    borderRadius: "8px",
                  }}
                >
                  <RiseOutlined style={{ fontSize: "20px", color: "#1890ff" }} />
                </div>
                <Text strong style={{ fontSize: "16px" }}>
                  Sales
                </Text>
              </div>
            }
            extra={
              <Segmented
                options={["W", "M", "Y"]}
                defaultValue="M"
                style={{ background: "#f5f5f5" }}
              />
            }
          >
            <Line {...chartConfig} />
          </Card>
        </Col>

        <Col xs={24} lg={10}>
          <Card
            bordered={false}
            style={{ borderRadius: "12px", height: "100%" }}
            title={
              <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <div
                  style={{
                    background: "#fff1f0",
                    padding: "8px",
                    borderRadius: "8px",
                  }}
                >
                  <ShoppingOutlined style={{ fontSize: "20px", color: "#ff4d4f" }} />
                </div>
                <Text strong style={{ fontSize: "16px" }}>
                  Recent orders
                </Text>
              </div>
            }
          >
            <div style={{ maxHeight: "300px", overflowY: "auto" }}>
              {recentOrders.map((order, index) => (
                <div
                  key={index}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: "16px",
                    paddingBottom: "16px",
                    borderBottom: index < recentOrders.length - 1 ? "1px solid #f0f0f0" : "none",
                  }}
                >
                  <div>
                    <Text strong style={{ display: "block" }}>
                      {order.name}
                    </Text>
                    <Text type="secondary" style={{ fontSize: "12px" }}>
                      {order.address}
                    </Text>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <Text strong style={{ display: "block", marginBottom: "4px" }}>
                      {order.amount}
                    </Text>
                    <Tag color={order.statusColor} style={{ margin: 0 }}>
                      {order.status}
                    </Tag>
                  </div>
                </div>
              ))}
            </div>
            <Button
              type="link"
              style={{
                padding: 0,
                color: "#ff4d4f",
                marginTop: "8px",
                borderBottom: "2px solid #ff4d4f",
                borderRadius: 0,
              }}
            >
              See all orders
            </Button>
          </Card>
        </Col>
      </Row>
    </DashboardLayout>
  );
};
