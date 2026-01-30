import { DashboardLayout } from "../components/layout/DashboardLayout";
import {
  Card,
  Table,
  Button,
  Select,
  Space,
  Modal,
  Form,
  InputNumber,
  Switch,
  message,
  Descriptions,
  Tag,
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
import { deliveryApi } from "../modules/delivery/api";
import type { DeliveryConfig, OrderValueTier } from "../modules/delivery/api";
import { useAppSelector } from "../app/hooks";
import { useTenants } from "../modules/tenants/hooks/useTenants";

const { Option } = Select;

export const DeliveryConfigPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deliveryConfig, setDeliveryConfig] = useState<DeliveryConfig | null>(null);
  const [loading, setLoading] = useState(false);
  const [selectedTenantId, setSelectedTenantId] = useState<string | undefined>(undefined);
  const [form] = Form.useForm();

  const { user } = useAppSelector((state) => state.login);
  const isAdmin = user?.role === "admin";

  const { tenants, loadTenants, loading: tenantsLoading } = useTenants();

  const fetchDeliveryConfig = useCallback(async (tenantId?: string) => {
    setLoading(true);
    try {
      const response = await deliveryApi.get(tenantId);
      setDeliveryConfig(response.config);
    } catch {
      setDeliveryConfig(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isAdmin) {
      void loadTenants(1, 100);
    } else {
      void fetchDeliveryConfig();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAdmin]);

  const handleTenantChange = (tenantId: string) => {
    setSelectedTenantId(tenantId);
    void fetchDeliveryConfig(tenantId);
  };

  const handleToggleActive = async (isActive: boolean) => {
    try {
      const response = await deliveryApi.toggle({
        isActive,
        ...(isAdmin && selectedTenantId ? { tenantId: selectedTenantId } : {}),
      });
      setDeliveryConfig(response.config);
      message.success(`Delivery ${isActive ? "enabled" : "disabled"}`);
    } catch {
      message.error("Failed to toggle delivery status");
    }
  };

  const handleDelete = () => {
    Modal.confirm({
      title: "Delete Delivery Configuration",
      content:
        "Are you sure you want to delete the delivery configuration? This action cannot be undone.",
      okText: "Delete",
      okType: "danger",
      cancelText: "Cancel",
      async onOk() {
        try {
          await deliveryApi.delete({
            ...(isAdmin && selectedTenantId ? { tenantId: selectedTenantId } : {}),
          });
          setDeliveryConfig(null);
          message.success("Delivery configuration deleted successfully!");
        } catch {
          message.error("Failed to delete delivery configuration");
        }
      },
    });
  };

  const handleOpenModal = (editing: boolean) => {
    if (editing && deliveryConfig) {
      form.setFieldsValue({
        isActive: deliveryConfig.isActive,
        freeDeliveryThreshold: deliveryConfig.freeDeliveryThreshold,
        orderValueTiers: deliveryConfig.orderValueTiers.map((t) => ({
          minOrderValue: t.minOrderValue,
          deliveryCharge: t.deliveryCharge,
        })),
      });
    } else {
      form.setFieldsValue({
        isActive: true,
        freeDeliveryThreshold: 0,
        orderValueTiers: [{ minOrderValue: 0, deliveryCharge: 0 }],
      });
    }
    setIsModalOpen(true);
  };

  const handleSave = async () => {
    try {
      const values = await form.validateFields();
      const payload = {
        isActive: values.isActive as boolean,
        orderValueTiers: values.orderValueTiers as OrderValueTier[],
        freeDeliveryThreshold: values.freeDeliveryThreshold as number,
        ...(isAdmin && selectedTenantId ? { tenantId: selectedTenantId } : {}),
      };

      if (deliveryConfig) {
        const response = await deliveryApi.update(payload);
        setDeliveryConfig(response.config);
        message.success("Delivery configuration updated successfully!");
      } else {
        const response = await deliveryApi.create(payload);
        setDeliveryConfig(response.config);
        message.success("Delivery configuration created successfully!");
      }

      form.resetFields();
      setIsModalOpen(false);
    } catch (error) {
      if (error && typeof error === "object" && "errorFields" in error) {
        return;
      }
      message.error(
        deliveryConfig
          ? "Failed to update delivery configuration"
          : "Failed to create delivery configuration"
      );
    }
  };

  const handleCancel = () => {
    form.resetFields();
    setIsModalOpen(false);
  };

  const tierColumns: ColumnType<OrderValueTier>[] = [
    {
      title: "Min Order Value",
      dataIndex: "minOrderValue",
      key: "minOrderValue",
      render: (value: number) => `$${value}`,
    },
    {
      title: "Delivery Charge",
      dataIndex: "deliveryCharge",
      key: "deliveryCharge",
      render: (value: number) => `$${value}`,
    },
  ];

  const showContent = !isAdmin || selectedTenantId;

  return (
    <DashboardLayout>
      <Card
        style={{ borderRadius: "12px" }}
        title={<span style={{ fontSize: "20px", fontWeight: "600" }}>Delivery Configuration</span>}
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
            {showContent && deliveryConfig && (
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
            {showContent && !deliveryConfig && !loading && (
              <Button
                type="primary"
                icon={<PlusOutlined />}
                style={{ background: "#ff4d4f" }}
                onClick={() => handleOpenModal(false)}
              >
                Create Delivery Config
              </Button>
            )}
          </Space>
        }
      >
        {!showContent && (
          <div style={{ textAlign: "center", padding: "40px", color: "#999" }}>
            Please select a restaurant to view delivery configuration.
          </div>
        )}
        {showContent && !deliveryConfig && !loading && (
          <div style={{ textAlign: "center", padding: "40px", color: "#999" }}>
            No delivery configuration found. Click "Create Delivery Config" to get started.
          </div>
        )}
        {showContent && (deliveryConfig || loading) && (
          <>
            {deliveryConfig && (
              <Descriptions bordered column={1} style={{ marginBottom: 24 }}>
                <Descriptions.Item label="Delivery Status">
                  <Space>
                    <Switch
                      checked={deliveryConfig.isActive}
                      onChange={handleToggleActive}
                      checkedChildren="Active"
                      unCheckedChildren="Inactive"
                    />
                    <Tag color={deliveryConfig.isActive ? "green" : "default"}>
                      {deliveryConfig.isActive ? "Active" : "Inactive"}
                    </Tag>
                  </Space>
                </Descriptions.Item>
                <Descriptions.Item label="Free Delivery Threshold">
                  ${deliveryConfig.freeDeliveryThreshold}
                </Descriptions.Item>
              </Descriptions>
            )}
            <h3 style={{ marginBottom: 16, fontWeight: 600 }}>Order Value Tiers</h3>
            <Table
              columns={tierColumns}
              dataSource={deliveryConfig?.orderValueTiers || []}
              rowKey={(_, index) => String(index)}
              loading={loading}
              pagination={false}
            />
          </>
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
          {deliveryConfig ? "Update Delivery Configuration" : "Create Delivery Configuration"}
        </h2>
        <Form form={form} layout="vertical">
          <Form.Item label="Active" name="isActive" valuePropName="checked" initialValue={true}>
            <Switch checkedChildren="Active" unCheckedChildren="Inactive" />
          </Form.Item>

          <Form.Item
            label="Free Delivery Threshold"
            name="freeDeliveryThreshold"
            rules={[{ required: true, message: "Enter free delivery threshold" }]}
          >
            <InputNumber
              style={{ width: "100%" }}
              placeholder="Enter threshold amount"
              min={0}
              prefix="$"
            />
          </Form.Item>

          <h3 style={{ marginBottom: 8 }}>Order Value Tiers</h3>
          <Form.List name="orderValueTiers">
            {(fields, { add, remove }) => (
              <>
                {fields.map(({ key, name, ...restField }) => (
                  <Space
                    key={key}
                    style={{ display: "flex", marginBottom: 8, alignItems: "baseline" }}
                  >
                    <Form.Item
                      {...restField}
                      name={[name, "minOrderValue"]}
                      rules={[{ required: true, message: "Enter min order value" }]}
                    >
                      <InputNumber placeholder="Min Order Value" min={0} prefix="$" />
                    </Form.Item>
                    <Form.Item
                      {...restField}
                      name={[name, "deliveryCharge"]}
                      rules={[{ required: true, message: "Enter delivery charge" }]}
                    >
                      <InputNumber placeholder="Delivery Charge" min={0} prefix="$" />
                    </Form.Item>
                    {fields.length > 1 && <MinusCircleOutlined onClick={() => remove(name)} />}
                  </Space>
                ))}
                <Form.Item>
                  <Button
                    type="dashed"
                    onClick={() => add({ minOrderValue: 0, deliveryCharge: 0 })}
                    block
                    icon={<PlusOutlined />}
                  >
                    Add Tier
                  </Button>
                </Form.Item>
              </>
            )}
          </Form.List>

          <div style={{ display: "flex", justifyContent: "flex-end", gap: "8px" }}>
            <Button onClick={handleCancel}>Cancel</Button>
            <Button
              type="primary"
              icon={deliveryConfig ? <EditOutlined /> : <PlusOutlined />}
              style={{ background: "#ff4d4f" }}
              onClick={handleSave}
            >
              {deliveryConfig ? "Update" : "Create"}
            </Button>
          </div>
        </Form>
      </Modal>
    </DashboardLayout>
  );
};
