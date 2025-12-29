import { useEffect, useState } from "react";
import { Card, Table, Button, Space, Modal, Input, Select, Avatar, Dropdown, Tag } from "antd";
import {
  SearchOutlined,
  PlusOutlined,
  MoreOutlined,
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
} from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";
import type { MenuProps } from "antd";
import { useTenants } from "../hooks/useTenants";
import type { Tenant } from "../api/types";
import { CreateTenantModal } from "./CreateTenantModal";
import { EditTenantModal } from "./EditTenantModal";
import { ViewTenantModal } from "./ViewTenantModal";
import { useAuth } from "../../../hooks/useAuth";

const { Option } = Select;

export const TenantsList = () => {
  const { user } = useAuth();
  const {
    tenants,
    loading,
    currentPage,
    pageSize,
    total,
    loadTenants,
    handleDeleteTenant,
    handlePageChange,
  } = useTenants();

  const [createModalVisible, setCreateModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [viewModalVisible, setViewModalVisible] = useState(false);
  const [selectedTenantId, setSelectedTenantId] = useState<number | null>(null);
  const [searchText, setSearchText] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const isAdmin = user?.role === "admin";
  const isManager = user?.role === "manager";
  const canEdit = isAdmin || isManager;
  const canCreateDelete = isAdmin;

  useEffect(() => {
    loadTenants();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleView = (tenantId: number) => {
    setSelectedTenantId(tenantId);
    setViewModalVisible(true);
  };

  const handleEdit = (tenantId: number) => {
    setSelectedTenantId(tenantId);
    setEditModalVisible(true);
  };

  const handleDelete = (tenantId: number, tenantName: string) => {
    Modal.confirm({
      title: "Delete Restaurant",
      content: `Are you sure you want to delete ${tenantName}? This action cannot be undone.`,
      okText: "Delete",
      okType: "danger",
      cancelText: "Cancel",
      onOk: async () => {
        await handleDeleteTenant(tenantId);
      },
    });
  };

  const getActionMenu = (record: Tenant): MenuProps => ({
    items: [
      {
        key: "view",
        icon: <EyeOutlined />,
        label: "View",
        onClick: () => handleView(record.id),
      },
      ...(canEdit
        ? [
            {
              key: "edit",
              icon: <EditOutlined />,
              label: "Edit",
              onClick: () => handleEdit(record.id),
            },
          ]
        : []),
      ...(canCreateDelete
        ? [
            {
              key: "delete",
              icon: <DeleteOutlined />,
              label: "Delete",
              danger: true,
              onClick: () => handleDelete(record.id, record.name),
            },
          ]
        : []),
    ],
  });

  const columns: ColumnsType<Tenant> = [
    {
      title: "Restaurant name",
      key: "tenantName",
      render: (_, record) => (
        <Space>
          <Avatar style={{ backgroundColor: "#ff4d4f" }} size={40}>
            {record.name.charAt(0).toUpperCase()}
          </Avatar>
          <span>{record.name}</span>
        </Space>
      ),
    },
    {
      title: "Address",
      dataIndex: "address",
      key: "address",
    },
    {
      title: "Status",
      key: "status",
      render: () => <Tag color="green">Active</Tag>,
    },
    {
      title: "Created at",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (date: string) => new Date(date).toLocaleDateString(),
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

  return (
    <Card
      variant="borderless"
      style={{ borderRadius: "12px" }}
      title={<span style={{ fontSize: "20px", fontWeight: "600" }}>Restaurants</span>}
      extra={
        <Space>
          <Input
            placeholder="Search..."
            prefix={<SearchOutlined />}
            style={{ width: 200 }}
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
          />
          <Select value={statusFilter} onChange={setStatusFilter} style={{ width: 120 }}>
            <Option value="all">Status</Option>
            <Option value="active">Active</Option>
            <Option value="inactive">Inactive</Option>
          </Select>
          {canCreateDelete && (
            <Button
              type="primary"
              icon={<PlusOutlined />}
              style={{ background: "#ff4d4f" }}
              onClick={() => setCreateModalVisible(true)}
            >
              Create Restaurant
            </Button>
          )}
        </Space>
      }
    >
      <Table
        columns={columns}
        dataSource={tenants}
        rowKey="id"
        loading={loading}
        pagination={{
          current: currentPage,
          pageSize: pageSize,
          total: total,
          onChange: handlePageChange,
          showSizeChanger: false,
        }}
      />

      {canCreateDelete && (
        <CreateTenantModal
          visible={createModalVisible}
          onClose={() => setCreateModalVisible(false)}
        />
      )}

      {canEdit && (
        <EditTenantModal
          visible={editModalVisible}
          tenantId={selectedTenantId}
          onClose={() => {
            setEditModalVisible(false);
            setSelectedTenantId(null);
          }}
        />
      )}

      <ViewTenantModal
        visible={viewModalVisible}
        tenantId={selectedTenantId}
        onClose={() => {
          setViewModalVisible(false);
          setSelectedTenantId(null);
        }}
      />
    </Card>
  );
};
