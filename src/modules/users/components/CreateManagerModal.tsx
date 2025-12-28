import { useEffect, useState } from "react";
import { Modal, Form, Input, Select, Button, Divider } from "antd";
import { useUsers } from "../hooks/useUsers";
import { useTenants } from "../../tenants/hooks/useTenants";
import type { CreateManagerRequest } from "../api/types";

interface CreateManagerModalProps {
  visible: boolean;
  onClose: () => void;
}

export const CreateManagerModal = ({ visible, onClose }: CreateManagerModalProps) => {
  const [form] = Form.useForm();
  const { handleCreateManager, loading } = useUsers();
  const { tenants, loadTenants, loading: tenantsLoading, total } = useTenants();
  const [allTenants, setAllTenants] = useState<typeof tenants>([]);
  const [tenantPage, setTenantPage] = useState(1);
  const pageSize = 100;

  useEffect(() => {
    if (visible) {
      setTenantPage(1);
      setAllTenants([]);
      loadTenants(1, pageSize);
    }
  }, [visible]);

  useEffect(() => {
    if (tenants.length > 0) {
      setAllTenants((prev) => {
        const existingIds = new Set(prev.map((t) => t.id));
        const newTenants = tenants.filter((t) => !existingIds.has(t.id));
        return [...prev, ...newTenants];
      });
    }
  }, [tenants]);

  const loadMoreTenants = () => {
    const nextPage = tenantPage + 1;
    setTenantPage(nextPage);
    loadTenants(nextPage, pageSize);
  };

  const hasMoreTenants = allTenants.length < total;

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
          label="Tenant"
          name="tenantId"
          rules={[{ required: true, message: "Please select a tenant" }]}
        >
          <Select
            placeholder="Select a tenant"
            loading={tenantsLoading}
            showSearch
            optionFilterProp="children"
            filterOption={(input, option) =>
              (option?.label ?? "").toLowerCase().includes(input.toLowerCase())
            }
            options={allTenants.map((tenant) => ({
              value: tenant.id,
              label: `${tenant.name} - ${tenant.address}`,
            }))}
            dropdownRender={(menu) => (
              <>
                {menu}
                {hasMoreTenants && (
                  <>
                    <Divider style={{ margin: "8px 0" }} />
                    <div style={{ padding: "8px", textAlign: "center" }}>
                      <Button
                        type="link"
                        onClick={loadMoreTenants}
                        loading={tenantsLoading}
                        style={{ width: "100%" }}
                      >
                        Load More Tenants
                      </Button>
                    </div>
                  </>
                )}
              </>
            )}
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};
