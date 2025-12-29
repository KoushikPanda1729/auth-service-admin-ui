import { DashboardLayout } from "../components/layout/DashboardLayout";
import { Card, Typography } from "antd";
import { SettingOutlined } from "@ant-design/icons";

const { Title } = Typography;

export const SettingsPage = () => {
  return (
    <DashboardLayout>
      <Card bordered={false} style={{ borderRadius: "12px", textAlign: "center", padding: "48px" }}>
        <SettingOutlined style={{ fontSize: "64px", color: "#722ed1" }} />
        <Title level={2}>Settings</Title>
        <p>Configure your application settings here</p>
      </Card>
    </DashboardLayout>
  );
};
