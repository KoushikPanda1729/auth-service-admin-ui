import { DashboardLayout } from "../components/layout/DashboardLayout";
import {
  Card,
  Table,
  Tag,
  Button,
  Select,
  Space,
  Modal,
  Form,
  Input,
  InputNumber,
  Switch,
  message,
} from "antd";
import {
  PlusOutlined,
  CloseOutlined,
  EditOutlined,
  DeleteOutlined,
  MinusCircleOutlined,
} from "@ant-design/icons";
import { useState, useEffect, useCallback } from "react";
import type { ColumnType } from "antd/es/table";
import { taxesApi } from "../modules/taxes/api";
import type { TaxConfig, TaxItem } from "../modules/taxes/api";
import { useAppSelector } from "../app/hooks";
import { useTenants } from "../modules/tenants/hooks/useTenants";

const { Option } = Select;

export const TaxConfigPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [taxConfig, setTaxConfig] = useState<TaxConfig | null>(null);
  const [loading, setLoading] = useState(false);
  const [selectedTenantId, setSelectedTenantId] = useState<string | undefined>(undefined);
  const [form] = Form.useForm();

  const { user } = useAppSelector((state) => state.login);
  const isAdmin = user?.role === "admin";

  const { tenants, loadTenants, loading: tenantsLoading } = useTenants();

  const fetchTaxConfig = useCallback(async (tenantId?: string) => {
    setLoading(true);
    try {
      const response = await taxesApi.get(tenantId);
      setTaxConfig(response.taxConfig);
    } catch {
      setTaxConfig(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isAdmin) {
      void loadTenants(1, 100);
    } else {
      void fetchTaxConfig();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAdmin]);

  const handleTenantChange = (tenantId: string) => {
    setSelectedTenantId(tenantId);
    void fetchTaxConfig(tenantId);
  };

  const handleToggleTax = async (taxName: string, isActive: boolean) => {
    try {
      const response = await taxesApi.toggle({
        taxName,
        isActive,
        ...(isAdmin && selectedTenantId ? { tenantId: selectedTenantId } : {}),
      });
      setTaxConfig(response.taxConfig);
      message.success(`Tax "${taxName}" ${isActive ? "enabled" : "disabled"}`);
    } catch {
      message.error("Failed to toggle tax status");
    }
  };

  const handleDelete = () => {
    Modal.confirm({
      title: "Delete Tax Configuration",
      content:
        "Are you sure you want to delete the entire tax configuration? This action cannot be undone.",
      okText: "Delete",
      okType: "danger",
      cancelText: "Cancel",
      async onOk() {
        try {
          await taxesApi.delete({
            ...(isAdmin && selectedTenantId ? { tenantId: selectedTenantId } : {}),
          });
          setTaxConfig(null);
          message.success("Tax configuration deleted successfully!");
        } catch {
          message.error("Failed to delete tax configuration");
        }
      },
    });
  };

  const handleOpenModal = (editing: boolean) => {
    if (editing && taxConfig) {
      form.setFieldsValue({
        taxes: taxConfig.taxes.map((t) => ({
          name: t.name,
          rate: t.rate,
          isActive: t.isActive,
        })),
      });
    } else {
      form.setFieldsValue({
        taxes: [{ name: "", rate: 0, isActive: true }],
      });
    }
    setIsModalOpen(true);
  };

  const handleSave = async () => {
    try {
      const values = await form.validateFields();
      const payload = {
        taxes: values.taxes as TaxItem[],
        ...(isAdmin && selectedTenantId ? { tenantId: selectedTenantId } : {}),
      };

      if (taxConfig) {
        const response = await taxesApi.update(payload);
        setTaxConfig(response.taxConfig);
        message.success("Tax configuration updated successfully!");
      } else {
        const response = await taxesApi.create(payload);
        setTaxConfig(response.taxConfig);
        message.success("Tax configuration created successfully!");
      }

      form.resetFields();
      setIsModalOpen(false);
    } catch (error) {
      if (error && typeof error === "object" && "errorFields" in error) {
        return;
      }
      message.error(
        taxConfig ? "Failed to update tax configuration" : "Failed to create tax configuration"
      );
    }
  };

  const handleCancel = () => {
    form.resetFields();
    setIsModalOpen(false);
  };

  const columns: ColumnType<TaxItem>[] = [
    {
      title: "Tax Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Rate (%)",
      dataIndex: "rate",
      key: "rate",
      render: (rate: number) => `${rate}%`,
    },
    {
      title: "Status",
      dataIndex: "isActive",
      key: "isActive",
      render: (isActive: boolean, record: TaxItem) => (
        <Switch
          checked={isActive}
          onChange={(checked) => handleToggleTax(record.name, checked)}
          checkedChildren="Active"
          unCheckedChildren="Inactive"
        />
      ),
    },
    {
      title: "Status Label",
      dataIndex: "isActive",
      key: "statusLabel",
      render: (isActive: boolean) => (
        <Tag color={isActive ? "green" : "default"}>{isActive ? "Active" : "Inactive"}</Tag>
      ),
    },
  ];

  const showContent = !isAdmin || selectedTenantId;

  return (
    <DashboardLayout>
      <Card
        style={{ borderRadius: "12px" }}
        title={<span style={{ fontSize: "20px", fontWeight: "600" }}>Tax Configuration</span>}
        extra={
          <Space>
            {isAdmin && (
              <Select
                placeholder="Select restaurant"
                style={{ width: 200 }}
                onChange={handleTenantChange}
                value={selectedTenantId}
                showSearch
                filterOption={(input, option) =>
                  String(option?.label ?? "")
                    .toLowerCase()
                    .includes(input.toLowerCase())
                }
                loading={tenantsLoading}
                notFoundContent={tenantsLoading ? "Loading..." : "No restaurants found"}
              >
                {tenants.map((tenant) => (
                  <Option key={tenant.id} value={String(tenant.id)}>
                    {tenant.name}
                  </Option>
                ))}
              </Select>
            )}
            {showContent && taxConfig && (
              <>
                <Button
                  type="primary"
                  icon={<EditOutlined />}
                  onClick={() => handleOpenModal(true)}
                >
                  Update Config
                </Button>
                <Button danger icon={<DeleteOutlined />} onClick={handleDelete}>
                  Delete Config
                </Button>
              </>
            )}
            {showContent && !taxConfig && !loading && (
              <Button
                type="primary"
                icon={<PlusOutlined />}
                style={{ background: "#ff4d4f" }}
                onClick={() => handleOpenModal(false)}
              >
                Create Tax Config
              </Button>
            )}
          </Space>
        }
      >
        {!showContent && (
          <div style={{ textAlign: "center", padding: "40px", color: "#999" }}>
            Please select a restaurant to view tax configuration.
          </div>
        )}
        {showContent && !taxConfig && !loading && (
          <div style={{ textAlign: "center", padding: "40px", color: "#999" }}>
            No tax configuration found. Click "Create Tax Config" to get started.
          </div>
        )}
        {showContent && (taxConfig || loading) && (
          <Table
            columns={columns}
            dataSource={taxConfig?.taxes || []}
            rowKey="name"
            loading={loading}
            pagination={false}
          />
        )}
      </Card>

      <Modal
        open={isModalOpen}
        onCancel={handleCancel}
        footer={null}
        closeIcon={<CloseOutlined />}
        width={500}
      >
        <h2 style={{ fontSize: "18px", fontWeight: "600", marginBottom: "24px" }}>
          {taxConfig ? "Update Tax Configuration" : "Create Tax Configuration"}
        </h2>
        <Form form={form} layout="vertical">
          <Form.List name="taxes">
            {(fields, { add, remove }) => (
              <>
                {fields.map(({ key, name, ...restField }) => (
                  <Space
                    key={key}
                    style={{ display: "flex", marginBottom: 8, alignItems: "baseline" }}
                  >
                    <Form.Item
                      {...restField}
                      name={[name, "name"]}
                      rules={[{ required: true, message: "Enter tax name" }]}
                    >
                      <Input placeholder="Tax name (e.g. GST)" />
                    </Form.Item>
                    <Form.Item
                      {...restField}
                      name={[name, "rate"]}
                      rules={[{ required: true, message: "Enter rate" }]}
                    >
                      <InputNumber placeholder="Rate %" min={0} max={100} />
                    </Form.Item>
                    <Form.Item
                      {...restField}
                      name={[name, "isActive"]}
                      valuePropName="checked"
                      initialValue={true}
                    >
                      <Switch checkedChildren="Active" unCheckedChildren="Inactive" />
                    </Form.Item>
                    {fields.length > 1 && <MinusCircleOutlined onClick={() => remove(name)} />}
                  </Space>
                ))}
                <Form.Item>
                  <Button
                    type="dashed"
                    onClick={() => add({ name: "", rate: 0, isActive: true })}
                    block
                    icon={<PlusOutlined />}
                  >
                    Add Tax
                  </Button>
                </Form.Item>
              </>
            )}
          </Form.List>

          <div style={{ display: "flex", justifyContent: "flex-end", gap: "8px" }}>
            <Button onClick={handleCancel}>Cancel</Button>
            <Button
              type="primary"
              icon={taxConfig ? <EditOutlined /> : <PlusOutlined />}
              style={{ background: "#ff4d4f" }}
              onClick={handleSave}
            >
              {taxConfig ? "Update" : "Create"}
            </Button>
          </div>
        </Form>
      </Modal>
    </DashboardLayout>
  );
};
