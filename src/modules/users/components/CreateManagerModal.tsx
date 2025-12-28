import { Modal, Form, Input, InputNumber } from "antd";
import { useUsers } from "../hooks/useUsers";
import type { CreateManagerRequest } from "../api/types";

interface CreateManagerModalProps {
  visible: boolean;
  onClose: () => void;
}

export const CreateManagerModal = ({ visible, onClose }: CreateManagerModalProps) => {
  const [form] = Form.useForm();
  const { handleCreateManager, loading } = useUsers();

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      const success = await handleCreateManager(values as CreateManagerRequest);
      if (success) {
        form.resetFields();
        onClose();
      }
    } catch (error) {
      // Validation failed or submission error
      console.error("Form validation or submission failed:", error);
    }
  };

  const handleCancel = () => {
    form.resetFields();
    onClose();
  };

  return (
    <Modal
      title="Create Manager"
      open={visible}
      onOk={handleSubmit}
      onCancel={handleCancel}
      confirmLoading={loading}
      okText="Create"
      cancelText="Cancel"
    >
      <Form form={form} layout="vertical" autoComplete="off">
        <Form.Item
          label="First Name"
          name="firstName"
          rules={[
            { required: true, message: "Please enter first name" },
            { min: 2, message: "First name must be at least 2 characters" },
          ]}
        >
          <Input placeholder="Enter first name" />
        </Form.Item>

        <Form.Item
          label="Last Name"
          name="lastName"
          rules={[
            { required: true, message: "Please enter last name" },
            { min: 2, message: "Last name must be at least 2 characters" },
          ]}
        >
          <Input placeholder="Enter last name" />
        </Form.Item>

        <Form.Item
          label="Email"
          name="email"
          rules={[
            { required: true, message: "Please enter email" },
            { type: "email", message: "Please enter a valid email" },
          ]}
        >
          <Input placeholder="Enter email" type="email" />
        </Form.Item>

        <Form.Item
          label="Password"
          name="password"
          rules={[
            { required: true, message: "Please enter password" },
            { min: 6, message: "Password must be at least 6 characters" },
          ]}
        >
          <Input.Password placeholder="Enter password" />
        </Form.Item>

        <Form.Item
          label="Tenant ID"
          name="tenantId"
          rules={[
            { required: true, message: "Please enter tenant ID" },
            { type: "number", message: "Please enter a valid number" },
          ]}
        >
          <InputNumber placeholder="Enter tenant ID" style={{ width: "100%" }} min={1} />
        </Form.Item>
      </Form>
    </Modal>
  );
};
