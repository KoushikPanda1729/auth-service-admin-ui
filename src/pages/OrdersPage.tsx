import { DashboardLayout } from "../components/layout/DashboardLayout";
import { Card, Typography } from "antd";
import { ShoppingCartOutlined } from "@ant-design/icons";

const { Title } = Typography;

export const OrdersPage = () => {
  return (
    <DashboardLayout>
      <Card bordered={false} style={{ borderRadius: "12px", textAlign: "center", padding: "48px" }}>
        <ShoppingCartOutlined style={{ fontSize: "64px", color: "#52c41a" }} />
        <Title level={2}>Orders Management</Title>
        <p>View and manage all orders here</p>
      </Card>
    </DashboardLayout>
  );
};
