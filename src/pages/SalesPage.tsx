import { DashboardLayout } from "../components/layout/DashboardLayout";
import { Card, Typography } from "antd";
import { BarChartOutlined } from "@ant-design/icons";

const { Title } = Typography;

export const SalesPage = () => {
  return (
    <DashboardLayout>
      <Card style={{ borderRadius: "12px", textAlign: "center", padding: "48px" }}>
        <BarChartOutlined style={{ fontSize: "64px", color: "#ff4d4f" }} />
        <Title level={2}>Sales Analytics</Title>
        <p>View detailed sales reports and analytics here</p>
      </Card>
    </DashboardLayout>
  );
};
