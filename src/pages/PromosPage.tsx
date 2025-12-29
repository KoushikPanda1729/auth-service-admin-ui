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
  Switch,
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
import { useState } from "react";
import type { ColumnType } from "antd/es/table";
import type { MenuProps } from "antd";
import dayjs from "dayjs";

const { Option } = Select;

interface CouponData {
  key: string;
  id: string;
  name: string;
  status: "valid" | "expired";
  offPercentage: number;
  validTill: string;
  createdAt: string;
}

export const PromosPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState<CouponData | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [form] = Form.useForm();

  const handleEdit = (coupon: CouponData) => {
    setEditingCoupon(coupon);
    form.setFieldsValue({
      name: coupon.name,
      validTill: dayjs(coupon.validTill, "DD MMMM YYYY"),
      offPercentage: coupon.offPercentage,
      publish: coupon.status === "valid",
    });
    setIsModalOpen(true);
  };

  const handleDelete = (coupon: CouponData) => {
    Modal.confirm({
      title: "Delete Coupon",
      content: `Are you sure you want to delete "${coupon.name}"? This action cannot be undone.`,
      okText: "Delete",
      okType: "danger",
      cancelText: "Cancel",
      onOk() {
        console.log("Deleting coupon:", coupon.id);
        message.success("Coupon deleted successfully!");
      },
    });
  };

  const getActionMenu = (record: CouponData): MenuProps => ({
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

  const columns: ColumnType<CouponData>[] = [
    {
      title: "Coupon name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status: string) => {
        const statusConfig = {
          valid: { color: "green", text: "Valid" },
          expired: { color: "default", text: "Expired" },
        };
        const config = statusConfig[status as keyof typeof statusConfig];
        return <Tag color={config.color}>{config.text}</Tag>;
      },
    },
    {
      title: "Off percentage",
      dataIndex: "offPercentage",
      key: "offPercentage",
      render: (percentage: number) => `${percentage}%`,
    },
    {
      title: "Valid till",
      dataIndex: "validTill",
      key: "validTill",
    },
    {
      title: "Created at",
      dataIndex: "createdAt",
      key: "createdAt",
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

  const data: CouponData[] = [
    {
      key: "1",
      id: "1",
      name: "SUNFUN22",
      status: "valid",
      offPercentage: 10,
      validTill: "25 November 2022",
      createdAt: "25 July 2022",
    },
    {
      key: "2",
      id: "2",
      name: "SATFUN22",
      status: "expired",
      offPercentage: 5,
      validTill: "25 July 2022",
      createdAt: "25 July 2022",
    },
    {
      key: "3",
      id: "3",
      name: "BLACKFRI22",
      status: "valid",
      offPercentage: 5,
      validTill: "25 July 2022",
      createdAt: "25 July 2022",
    },
  ];

  const filteredData =
    statusFilter === "all" ? data : data.filter((coupon) => coupon.status === statusFilter);

  const handleSave = () => {
    form.validateFields().then((values) => {
      const formattedValues = {
        ...values,
        validTill: values.validTill.format("DD MMMM YYYY"),
      };

      if (editingCoupon) {
        console.log("Updating coupon:", editingCoupon.id, formattedValues);
        message.success("Coupon updated successfully!");
      } else {
        console.log("Creating coupon:", formattedValues);
        message.success("Coupon created successfully!");
      }
      form.resetFields();
      setEditingCoupon(null);
      setIsModalOpen(false);
    });
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
        bordered={false}
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
          pagination={{
            pageSize: 10,
            showSizeChanger: false,
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
        <Form form={form} layout="vertical" initialValues={{ publish: true }}>
          <Form.Item
            label="Coupon name"
            name="name"
            rules={[{ required: true, message: "Please enter coupon name" }]}
          >
            <Input placeholder="Enter coupon name" />
          </Form.Item>

          <Form.Item
            label="Valid till"
            name="validTill"
            rules={[{ required: true, message: "Please select valid till date" }]}
          >
            <DatePicker style={{ width: "100%" }} placeholder="Select date" format="DD MMMM YYYY" />
          </Form.Item>

          <Form.Item
            label="Off percentage"
            name="offPercentage"
            rules={[{ required: true, message: "Please enter off percentage" }]}
          >
            <InputNumber
              style={{ width: "100%" }}
              placeholder="Enter percentage"
              min={1}
              max={100}
              addonAfter="%"
            />
          </Form.Item>

          <Form.Item name="publish" valuePropName="checked" style={{ marginBottom: "24px" }}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <span>Publish</span>
              <Switch />
            </div>
          </Form.Item>

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
