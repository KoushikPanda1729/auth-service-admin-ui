import { useEffect, useState, useCallback } from "react";
import {
  Drawer,
  Form,
  Input,
  Select,
  Button,
  Divider,
  Row,
  Col,
  Upload,
  Switch,
  Typography,
  Space,
} from "antd";
import { SaveOutlined, InboxOutlined } from "@ant-design/icons";
import { useUsers } from "../hooks/useUsers";
import { useTenants } from "../../tenants/hooks/useTenants";
import type { UpdateUserRequest } from "../api/types";
import { TenantDropdownRender } from "./shared/TenantDropdownRender";

const { Title } = Typography;

interface EditUserModalProps {
  visible: boolean;
  userId: number | null;
  onClose: () => void;
}

export const EditUserModal = ({ visible, userId, onClose }: EditUserModalProps) => {
  const [form] = Form.useForm();
  const { selectedUser, handleUpdateUser, loadUserById, loading, clearUser } = useUsers();
  const { tenants, loadTenants, loading: tenantsLoading, total } = useTenants();
  const [allTenants, setAllTenants] = useState<typeof tenants>([]);
  const [tenantPage, setTenantPage] = useState(1);
  const [selectedRole, setSelectedRole] = useState<string>("");
  const pageSize = 100;

  useEffect(() => {
    if (visible && userId) {
      loadUserById(userId);
      setTenantPage(1);
      setAllTenants([]);
      loadTenants(1, pageSize);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible, userId]);

  useEffect(() => {
    if (tenants.length > 0) {
      setAllTenants((prev) => {
        const existingIds = new Set(prev.map((t) => t.id));
        const newTenants = tenants.filter((t) => !existingIds.has(t.id));
        return [...prev, ...newTenants];
      });
    }
  }, [tenants]);

  useEffect(() => {
    if (selectedUser) {
      form.setFieldsValue({
        firstName: selectedUser.firstName,
        lastName: selectedUser.lastName,
        email: selectedUser.email,
        role: selectedUser.role,
        tenantId: selectedUser.tenant?.id,
      });
      setSelectedRole(selectedUser.role);
    }
  }, [selectedUser, form]);

  const loadMoreTenants = useCallback(() => {
    const nextPage = tenantPage + 1;
    setTenantPage(nextPage);
    loadTenants(nextPage, pageSize);
  }, [tenantPage, loadTenants, pageSize]);

  const hasMoreTenants = allTenants.length < total;

  const renderTenantDropdown = useCallback(
    (menu: React.ReactNode) => (
      <TenantDropdownRender
        menu={menu}
        hasMoreTenants={hasMoreTenants}
        loadMoreTenants={loadMoreTenants}
        tenantsLoading={tenantsLoading}
      />
    ),
    [hasMoreTenants, loadMoreTenants, tenantsLoading]
  );

  const handleSubmit = async () => {
    try {
      if (!userId) return;
      const values = await form.validateFields();
      const success = await handleUpdateUser(userId, values as UpdateUserRequest);
      if (success) {
        form.resetFields();
        setSelectedRole("");
        clearUser();
        onClose();
      }
    } catch (error) {
      console.error("Form validation or submission failed:", error);
    }
  };

  const handleCancel = () => {
    form.resetFields();
    setSelectedRole("");
    clearUser();
    onClose();
  };

  const handleRoleChange = (role: string) => {
    setSelectedRole(role);
    // Clear tenant field when role is not manager
    if (role !== "manager") {
      form.setFieldValue("tenantId", undefined);
    }
  };

  return (
    <Drawer
      title="Edit User"
      placement="right"
      onClose={handleCancel}
      open={visible}
      width={720}
      extra={
        <Space>
          <Button onClick={handleCancel}>Cancel</Button>
          <Button
            type="primary"
            icon={<SaveOutlined />}
            style={{ background: "#ff4d4f" }}
            onClick={handleSubmit}
            loading={loading}
          >
            Update
          </Button>
        </Space>
      }
    >
      <Form form={form} layout="vertical" autoComplete="off">
        <Row gutter={24}>
          {/* Left Column - Basic Info */}
          <Col span={12}>
            <Title level={5}>Basic Info</Title>

            <Form.Item
              label="First name"
              name="firstName"
              rules={[
                { required: true, message: "Please enter first name" },
                { min: 2, message: "First name must be at least 2 characters" },
              ]}
            >
              <Input placeholder="Enter first name" />
            </Form.Item>

            <Form.Item
              label="Last name"
              name="lastName"
              rules={[
                { required: true, message: "Please enter last name" },
                { min: 2, message: "Last name must be at least 2 characters" },
              ]}
            >
              <Input placeholder="Enter last name" />
            </Form.Item>

            <Form.Item label="Email" name="email">
              <Input placeholder="Enter email" type="email" disabled />
            </Form.Item>

            <Form.Item label="Phone number" name="phoneNumber">
              <Input placeholder="Enter phone number" disabled />
            </Form.Item>
          </Col>

          {/* Right Column - Roles */}
          <Col span={12}>
            <Title level={5}>Roles</Title>

            <Form.Item
              label="Select role"
              name="role"
              rules={[{ required: true, message: "Please select a role" }]}
            >
              <Select placeholder="Select role" onChange={handleRoleChange}>
                <Select.Option value="admin">Admin</Select.Option>
                <Select.Option value="manager">Manager</Select.Option>
                <Select.Option value="customer">Customer</Select.Option>
              </Select>
            </Form.Item>

            <Form.Item label="Designation" name="designation">
              <Input placeholder="Enter designation" disabled />
            </Form.Item>
          </Col>
        </Row>

        {/* Profile Image */}
        <Divider />
        <Title level={5}>Profile Image</Title>
        <Form.Item name="profileImage">
          <Upload.Dragger disabled>
            <p className="ant-upload-drag-icon">
              <InboxOutlined style={{ fontSize: "48px", color: "#ff4d4f" }} />
            </p>
            <p className="ant-upload-text">Click or drag file to this area to upload</p>
            <p className="ant-upload-hint">Support only single file</p>
          </Upload.Dragger>
        </Form.Item>

        {/* Tenant Selection - Only show for managers */}
        {selectedRole === "manager" && (
          <>
            <Divider />
            <Form.Item
              label="Restaurant"
              name="tenantId"
              rules={[{ required: true, message: "Please select a restaurant" }]}
            >
              <Select
                placeholder="Select a restaurant"
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
                dropdownRender={renderTenantDropdown}
              />
            </Form.Item>
          </>
        )}

        <Row gutter={24}>
          <Col span={12}>
            {/* Other Properties */}
            <Divider />
            <Title level={5}>Other properties</Title>
            <Form.Item name="ban" valuePropName="checked">
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <span>Ban</span>
                <Switch disabled />
              </div>
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Drawer>
  );
};
