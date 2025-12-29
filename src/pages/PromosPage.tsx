import { DashboardLayout } from "../components/layout/DashboardLayout";
import { Card, Typography } from "antd";
import { TagOutlined } from "@ant-design/icons";

const { Title } = Typography;

export const PromosPage = () => {
  return (
    <DashboardLayout>
      <Card bordered={false} style={{ borderRadius: "12px", textAlign: "center", padding: "48px" }}>
        <TagOutlined style={{ fontSize: "64px", color: "#faad14" }} />
        <Title level={2}>Promotions Management</Title>
        <p>Create and manage promotional campaigns here</p>
      </Card>
    </DashboardLayout>
  );
};
