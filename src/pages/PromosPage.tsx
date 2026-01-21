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
  DatePicker,
  InputNumber,
  message,
  Dropdown,
} from "antd";
import {
  PlusOutlined,
  CloseOutlined,
  MoreOutlined,
  EditOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import { useState, useEffect } from "react";
import type { ColumnType } from "antd/es/table";
import type { MenuProps } from "antd";
import dayjs from "dayjs";
import { couponsApi } from "../modules/coupons/api";
import type { Coupon } from "../modules/coupons/api";
import { useAppSelector } from "../app/hooks";
import { useTenants } from "../modules/tenants/hooks/useTenants";

const { Option } = Select;

export const PromosPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState<Coupon | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });
  const [form] = Form.useForm();

  // Get current user from Redux
  const { user } = useAppSelector((state) => state.login);
  const isAdmin = user?.role === "admin";

  // Fetch tenants for admin users
  const { tenants, loadTenants, loading: tenantsLoading } = useTenants();

  const fetchCoupons = async (page = 1, limit = 10) => {
    setLoading(true);
    try {
      const response = await couponsApi.getAll({ page, limit });
      setCoupons(response.data);
      setPagination({
        current: response.page,
        pageSize: response.limit,
        total: response.total,
      });
    } catch (error) {
      message.error("Failed to fetch coupons");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void fetchCoupons();
    if (isAdmin) {
      void loadTenants(1, 100); // Load up to 100 tenants for dropdown
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAdmin]);

  const handleEdit = (coupon: Coupon) => {
    setEditingCoupon(coupon);
    form.setFieldsValue({
      title: coupon.title,
      code: coupon.code,
      validUpto: dayjs(coupon.validUpto),
      discount: coupon.discount,
      ...(isAdmin ? { tenantId: coupon.tenantId } : {}),
    });
    setIsModalOpen(true);
  };

  const handleDelete = (coupon: Coupon) => {
    Modal.confirm({
      title: "Delete Coupon",
      content: `Are you sure you want to delete "${coupon.title}"? This action cannot be undone.`,
      okText: "Delete",
      okType: "danger",
      cancelText: "Cancel",
      async onOk() {
        try {
          await couponsApi.delete(coupon._id);
          message.success("Coupon deleted successfully!");
          void fetchCoupons(pagination.current, pagination.pageSize);
        } catch (error) {
          message.error("Failed to delete coupon");
        }
      },
    });
  };

  const getActionMenu = (record: Coupon): MenuProps => ({
    items: [
      {
        key: "edit",
        icon: <EditOutlined />,
        label: "Edit",
        onClick: () => handleEdit(record),
      },
      {
        key: "delete",
        icon: <DeleteOutlined />,
        label: "Delete",
        danger: true,
        onClick: () => handleDelete(record),
      },
    ],
  });

  const isCouponExpired = (validUpto: string) => {
    return dayjs(validUpto).isBefore(dayjs());
  };

  const columns: ColumnType<Coupon>[] = [
    {
      title: "Coupon name",
      dataIndex: "title",
      key: "title",
    },
    {
      title: "Code",
      dataIndex: "code",
      key: "code",
      render: (code: string) => <Tag>{code.toUpperCase()}</Tag>,
    },
    {
      title: "Status",
      key: "status",
      render: (_, record) => {
        const isExpired = isCouponExpired(record.validUpto);
        return <Tag color={isExpired ? "default" : "green"}>{isExpired ? "Expired" : "Valid"}</Tag>;
      },
    },
    {
      title: "Discount",
      dataIndex: "discount",
      key: "discount",
      render: (discount: number) => `${discount}%`,
    },
    {
      title: "Valid till",
      dataIndex: "validUpto",
      key: "validUpto",
      render: (date: string) => dayjs(date).format("DD MMMM YYYY"),
    },
    {
      title: "Created at",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (date: string) => dayjs(date).format("DD MMMM YYYY"),
    },
    {
      title: "Actions",
      key: "actions",
      width: 80,
      render: (_, record) => (
        <Dropdown menu={getActionMenu(record)} trigger={["click"]}>
          <Button type="text" icon={<MoreOutlined />} />
        </Dropdown>
      ),
    },
  ];

  const filteredData =
    statusFilter === "all"
      ? coupons
      : coupons.filter((coupon) => {
          const isExpired = isCouponExpired(coupon.validUpto);
          return statusFilter === "expired" ? isExpired : !isExpired;
        });

  const handleSave = async () => {
    try {
      const values = await form.validateFields();
      console.log("Form values:", values); // Debug log

      const formattedValues = {
        title: values.title,
        code: values.code,
        discount: values.discount,
        validUpto: values.validUpto.format("YYYY-MM-DD"),
        ...(isAdmin && values.tenantId ? { tenantId: values.tenantId } : {}),
      };

      console.log("Sending to API:", formattedValues); // Debug log

      if (editingCoupon) {
        await couponsApi.update(editingCoupon._id, formattedValues);
        message.success("Coupon updated successfully!");
      } else {
        await couponsApi.create(formattedValues);
        message.success("Coupon created successfully!");
      }

      form.resetFields();
      setEditingCoupon(null);
      setIsModalOpen(false);
      void fetchCoupons(pagination.current, pagination.pageSize);
    } catch (error) {
      // Check if it's a form validation error
      if (error && typeof error === "object" && "errorFields" in error) {
        console.log("Form validation error:", error);
        return;
      }

      // API error
      console.error("API error:", error);
      const errorMessage = (error as { response?: { data?: { message?: string } } })?.response?.data
        ?.message;
      message.error(
        errorMessage || (editingCoupon ? "Failed to update coupon" : "Failed to create coupon")
      );
    }
  };

  const handleCancel = () => {
    form.resetFields();
    setEditingCoupon(null);
    setIsModalOpen(false);
  };

  const handleCreateNew = () => {
    setEditingCoupon(null);
    form.resetFields();
    setIsModalOpen(true);
  };

  return (
    <DashboardLayout>
      <Card
        style={{ borderRadius: "12px" }}
        title={<span style={{ fontSize: "20px", fontWeight: "600" }}>Coupons</span>}
        extra={
          <Space>
            <Select value={statusFilter} onChange={setStatusFilter} style={{ width: 120 }}>
              <Option value="all">Status</Option>
              <Option value="valid">Valid</Option>
              <Option value="expired">Expired</Option>
            </Select>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              style={{ background: "#ff4d4f" }}
              onClick={handleCreateNew}
            >
              Create coupon
            </Button>
          </Space>
        }
      >
        <Table
          columns={columns}
          dataSource={filteredData}
          rowKey="_id"
          loading={loading}
          pagination={{
            current: pagination.current,
            pageSize: pagination.pageSize,
            total: pagination.total,
            showSizeChanger: false,
            onChange: (page, pageSize) => {
              void fetchCoupons(page, pageSize);
            },
          }}
        />
      </Card>

      <Modal
        open={isModalOpen}
        onCancel={handleCancel}
        footer={null}
        closeIcon={<CloseOutlined />}
        width={400}
      >
        <h2 style={{ fontSize: "18px", fontWeight: "600", marginBottom: "24px" }}>
          {editingCoupon ? "Edit coupon" : "Create coupon"}
        </h2>
        <Form form={form} layout="vertical">
          <Form.Item
            label="Coupon title"
            name="title"
            rules={[{ required: true, message: "Please enter coupon title" }]}
          >
            <Input placeholder="Enter coupon title" />
          </Form.Item>

          <Form.Item
            label="Coupon code"
            name="code"
            rules={[{ required: true, message: "Please enter coupon code" }]}
          >
            <Input placeholder="Enter coupon code" />
          </Form.Item>

          <Form.Item
            label="Discount percentage"
            name="discount"
            rules={[{ required: true, message: "Please enter discount percentage" }]}
          >
            <InputNumber
              style={{ width: "100%" }}
              placeholder="Enter percentage"
              min={1}
              max={100}
              suffix="%"
            />
          </Form.Item>

          <Form.Item
            label="Valid till"
            name="validUpto"
            rules={[{ required: true, message: "Please select valid till date" }]}
          >
            <DatePicker style={{ width: "100%" }} placeholder="Select date" format="DD MMMM YYYY" />
          </Form.Item>

          {isAdmin && (
            <Form.Item
              label="Restaurant"
              name="tenantId"
              rules={[{ required: true, message: "Please select a restaurant" }]}
            >
              <Select
                placeholder="Select restaurant"
                showSearch
                filterOption={(input, option) =>
                  (option?.children as string).toLowerCase().includes(input.toLowerCase())
                }
                loading={tenantsLoading}
                disabled={tenantsLoading || tenants.length === 0}
                notFoundContent={tenantsLoading ? "Loading..." : "No restaurants found"}
              >
                {tenants.map((tenant) => (
                  <Option key={tenant.id} value={String(tenant.id)}>
                    {tenant.name}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          )}

          <div style={{ display: "flex", justifyContent: "flex-end", gap: "8px" }}>
            <Button onClick={handleCancel}>Cancel</Button>
            <Button
              type="primary"
              icon={editingCoupon ? <EditOutlined /> : <PlusOutlined />}
              style={{ background: "#ff4d4f" }}
              onClick={handleSave}
            >
              {editingCoupon ? "Update" : "Create"}
            </Button>
          </div>
        </Form>
      </Modal>
    </DashboardLayout>
  );
};
