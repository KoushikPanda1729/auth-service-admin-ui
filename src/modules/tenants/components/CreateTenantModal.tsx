import { Drawer, Form, Input, Button, Space, Divider, Typography } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { useTenants } from "../hooks/useTenants";
import type { CreateTenantRequest } from "../api/types";

const { Title } = Typography;

interface CreateTenantModalProps {
  visible: boolean;
  onClose: () => void;
}

export const CreateTenantModal = ({ visible, onClose }: CreateTenantModalProps) => {
  const [form] = Form.useForm();
  const { handleCreateTenant, loading } = useTenants();

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      const success = await handleCreateTenant(values as CreateTenantRequest);
      if (success) {
        form.resetFields();
        onClose();
      }
    } catch (error) {
      console.error("Form validation or submission failed:", error);
    }
  };

  const handleCancel = () => {
    form.resetFields();
    onClose();
  };

  return (
    <Drawer
      title="Create Tenant"
      placement="right"
      onClose={handleCancel}
      open={visible}
      width={500}
      extra={
        <Space>
          <Button onClick={handleCancel}>Cancel</Button>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            style={{ background: "#ff4d4f" }}
            onClick={handleSubmit}
            loading={loading}
          >
            Save
          </Button>
        </Space>
      }
    >
      <Form form={form} layout="vertical" autoComplete="off">
        <Title level={5}>Basic Info</Title>

        <Form.Item
          label="Tenant Name"
          name="name"
          rules={[
            { required: true, message: "Please enter tenant name" },
            { min: 2, message: "Tenant name must be at least 2 characters" },
          ]}
        >
          <Input placeholder="Enter tenant name" />
        </Form.Item>

        <Form.Item
          label="Address"
          name="address"
          rules={[
            { required: true, message: "Please enter address" },
            { min: 5, message: "Address must be at least 5 characters" },
          ]}
        >
          <Input.TextArea placeholder="Enter tenant address" rows={3} />
        </Form.Item>

        <Divider />
        <Title level={5}>Contact Info (Coming Soon)</Title>

        <Form.Item label="Phone" name="phone">
          <Input placeholder="Enter phone number" disabled />
        </Form.Item>

        <Form.Item label="Email" name="email">
          <Input placeholder="Enter email" disabled />
        </Form.Item>

        <Divider />
        <Title level={5}>Business Details (Coming Soon)</Title>

        <Form.Item label="Business Type" name="businessType">
          <Input placeholder="Enter business type" disabled />
        </Form.Item>

        <Form.Item label="Tax ID" name="taxId">
          <Input placeholder="Enter tax ID" disabled />
        </Form.Item>
      </Form>
    </Drawer>
  );
};
