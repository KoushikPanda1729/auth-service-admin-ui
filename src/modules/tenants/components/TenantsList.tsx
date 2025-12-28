import { useEffect, useState } from "react";
import { Table, Button, Space, Modal } from "antd";
import { EditOutlined, DeleteOutlined, PlusOutlined, EyeOutlined } from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";
import { useTenants } from "../hooks/useTenants";
import type { Tenant } from "../api/types";
import { CreateTenantModal } from "./CreateTenantModal";
import { EditTenantModal } from "./EditTenantModal";
import { ViewTenantModal } from "./ViewTenantModal";
import { useAuth } from "../../../hooks/useAuth";

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

  const isAdmin = user?.role === "admin";
  const isManager = user?.role === "manager";
  const canEdit = isAdmin || isManager;
  const canCreateDelete = isAdmin;

  useEffect(() => {
    loadTenants();
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
      title: "Delete Tenant",
      content: `Are you sure you want to delete ${tenantName}?`,
      okText: "Delete",
      okType: "danger",
      cancelText: "Cancel",
      onOk: async () => {
        await handleDeleteTenant(tenantId);
      },
    });
  };

  const columns: ColumnsType<Tenant> = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      width: 80,
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Address",
      dataIndex: "address",
      key: "address",
    },
    {
      title: "Created At",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (date: string) => new Date(date).toLocaleDateString(),
    },
    {
      title: "Updated At",
      dataIndex: "updatedAt",
      key: "updatedAt",
      render: (date: string) => new Date(date).toLocaleDateString(),
    },
    {
      title: "Actions",
      key: "actions",
      width: 200,
      render: (_, record) => (
        <Space size="small">
          <Button type="link" icon={<EyeOutlined />} onClick={() => handleView(record.id)}>
            View
          </Button>
          {canEdit && (
            <Button type="link" icon={<EditOutlined />} onClick={() => handleEdit(record.id)}>
              Edit
            </Button>
          )}
          {canCreateDelete && (
            <Button
              type="link"
              danger
              icon={<DeleteOutlined />}
              onClick={() => handleDelete(record.id, record.name)}
            >
              Delete
            </Button>
          )}
        </Space>
      ),
    },
  ];

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Tenants Management</h1>
        {canCreateDelete && (
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => setCreateModalVisible(true)}
          >
            Create Tenant
          </Button>
        )}
      </div>

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
    </div>
  );
};
