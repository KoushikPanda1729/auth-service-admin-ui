import { useEffect } from "react";
import { Modal, Form, Input } from "antd";
import { useTenants } from "../hooks/useTenants";
import type { UpdateTenantRequest } from "../api/types";

interface EditTenantModalProps {
  visible: boolean;
  tenantId: number | null;
  onClose: () => void;
}

export const EditTenantModal = ({ visible, tenantId, onClose }: EditTenantModalProps) => {
  const [form] = Form.useForm();
  const { selectedTenant, handleUpdateTenant, loadTenantById, loading, clearTenant } = useTenants();

  useEffect(() => {
    if (visible && tenantId) {
      loadTenantById(tenantId);
    }
  }, [visible, tenantId, loadTenantById]);

  useEffect(() => {
    if (selectedTenant) {
      form.setFieldsValue({
        name: selectedTenant.name,
        address: selectedTenant.address,
      });
    }
  }, [selectedTenant, form]);

  const handleSubmit = async () => {
    try {
      if (!tenantId) return;
      const values = await form.validateFields();
      const success = await handleUpdateTenant(tenantId, values as UpdateTenantRequest);
      if (success) {
        form.resetFields();
        clearTenant();
        onClose();
      }
    } catch (error) {
      console.error("Form validation or submission failed:", error);
    }
  };

  const handleCancel = () => {
    form.resetFields();
    clearTenant();
    onClose();
  };

  return (
    <Modal
      title="Edit Tenant"
      open={visible}
      onOk={handleSubmit}
      onCancel={handleCancel}
      confirmLoading={loading}
      okText="Update"
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
