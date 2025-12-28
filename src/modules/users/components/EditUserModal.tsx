import { useEffect } from "react";
import { Modal, Form, Input, Select } from "antd";
import { useUsers } from "../hooks/useUsers";
import type { UpdateUserRequest } from "../api/types";

interface EditUserModalProps {
  visible: boolean;
  userId: number | null;
  onClose: () => void;
}

export const EditUserModal = ({ visible, userId, onClose }: EditUserModalProps) => {
  const [form] = Form.useForm();
  const { selectedUser, handleUpdateUser, loadUserById, loading, clearUser } = useUsers();

  useEffect(() => {
    if (visible && userId) {
      loadUserById(userId);
    }
  }, [visible, userId]);

  useEffect(() => {
    if (selectedUser) {
      form.setFieldsValue({
        firstName: selectedUser.firstName,
        lastName: selectedUser.lastName,
        role: selectedUser.role,
      });
    }
  }, [selectedUser, form]);

  const handleSubmit = async () => {
    try {
      if (!userId) return;
      const values = await form.validateFields();
      const success = await handleUpdateUser(userId, values as UpdateUserRequest);
      if (success) {
        form.resetFields();
        clearUser();
        onClose();
      }
    } catch (error) {
      console.error("Form validation or submission failed:", error);
    }
  };

  const handleCancel = () => {
    form.resetFields();
    clearUser();
    onClose();
  };

  return (
    <Modal
      title="Edit User"
      open={visible}
      onOk={handleSubmit}
      onCancel={handleCancel}
      confirmLoading={loading}
      okText="Update"
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
          label="Role"
          name="role"
          rules={[{ required: true, message: "Please select a role" }]}
        >
          <Select placeholder="Select role">
            <Select.Option value="admin">Admin</Select.Option>
            <Select.Option value="manager">Manager</Select.Option>
            <Select.Option value="customer">Customer</Select.Option>
          </Select>
        </Form.Item>
      </Form>
    </Modal>
  );
};
