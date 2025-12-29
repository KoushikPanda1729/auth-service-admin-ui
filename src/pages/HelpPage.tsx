import { DashboardLayout } from "../components/layout/DashboardLayout";
import { Card, Typography } from "antd";
import { QuestionCircleOutlined } from "@ant-design/icons";

const { Title } = Typography;

export const HelpPage = () => {
  return (
    <DashboardLayout>
      <Card style={{ borderRadius: "12px", textAlign: "center", padding: "48px" }}>
        <QuestionCircleOutlined style={{ fontSize: "64px", color: "#13c2c2" }} />
        <Title level={2}>Help & Support</Title>
        <p>Find answers to your questions and get support</p>
      </Card>
    </DashboardLayout>
  );
};
