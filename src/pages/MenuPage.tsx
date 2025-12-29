import { DashboardLayout } from "../components/layout/DashboardLayout";
import { Card, Typography } from "antd";
import { ShoppingOutlined } from "@ant-design/icons";

const { Title } = Typography;

export const MenuPage = () => {
  return (
    <DashboardLayout>
      <Card bordered={false} style={{ borderRadius: "12px", textAlign: "center", padding: "48px" }}>
        <ShoppingOutlined style={{ fontSize: "64px", color: "#1890ff" }} />
        <Title level={2}>Menu Management</Title>
        <p>Manage your menu items here</p>
      </Card>
    </DashboardLayout>
  );
};
