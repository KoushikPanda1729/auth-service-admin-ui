import { Modal, Form, Input } from "antd";
import { useTenants } from "../hooks/useTenants";
import type { CreateTenantRequest } from "../api/types";

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
    <Modal
      title="Create Tenant"
      open={visible}
      onOk={handleSubmit}
      onCancel={handleCancel}
      confirmLoading={loading}
      okText="Create"
      cancelText="Cancel"
    >
      <Form form={form} layout="vertical" autoComplete="off">
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
      </Form>
    </Modal>
  );
};
