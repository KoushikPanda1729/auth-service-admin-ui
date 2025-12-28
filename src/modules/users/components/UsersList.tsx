import { useEffect, useState } from "react";
import { Table, Button, Space, Modal, Tag } from "antd";
import { EditOutlined, DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";
import { useUsers } from "../hooks/useUsers";
import type { User } from "../api/types";
import { CreateManagerModal } from "./CreateManagerModal";
import { EditUserModal } from "./EditUserModal";

export const UsersList = () => {
  const {
    users,
    loading,
    currentPage,
    pageSize,
    total,
    loadUsers,
    handleDeleteUser,
    handlePageChange,
  } = useUsers();

  const [createModalVisible, setCreateModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);

  useEffect(() => {
    loadUsers();
  }, []);

  const handleEdit = (userId: number) => {
    setSelectedUserId(userId);
    setEditModalVisible(true);
  };

  const handleDelete = (userId: number, userName: string) => {
    Modal.confirm({
      title: "Delete User",
      content: `Are you sure you want to delete ${userName}?`,
      okText: "Delete",
      okType: "danger",
      cancelText: "Cancel",
      onOk: async () => {
        await handleDeleteUser(userId);
      },
    });
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case "admin":
        return "red";
      case "manager":
        return "blue";
      case "customer":
        return "green";
      default:
        return "default";
    }
  };

  const columns: ColumnsType<User> = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      width: 80,
    },
    {
      title: "First Name",
      dataIndex: "firstName",
      key: "firstName",
    },
    {
      title: "Last Name",
      dataIndex: "lastName",
      key: "lastName",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Role",
      dataIndex: "role",
      key: "role",
      render: (role: string) => <Tag color={getRoleColor(role)}>{role.toUpperCase()}</Tag>,
    },
    {
      title: "Actions",
      key: "actions",
      width: 150,
      render: (_, record) => (
        <Space size="small">
          <Button type="link" icon={<EditOutlined />} onClick={() => handleEdit(record.id)}>
            Edit
          </Button>
          <Button
            type="link"
            danger
            icon={<DeleteOutlined />}
            onClick={() => handleDelete(record.id, `${record.firstName} ${record.lastName}`)}
          >
            Delete
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Users Management</h1>
        <Button type="primary" icon={<PlusOutlined />} onClick={() => setCreateModalVisible(true)}>
          Create Manager
        </Button>
      </div>

      <Table
        columns={columns}
        dataSource={users}
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

      <CreateManagerModal
        visible={createModalVisible}
        onClose={() => setCreateModalVisible(false)}
      />

      <EditUserModal
        visible={editModalVisible}
        userId={selectedUserId}
        onClose={() => {
          setEditModalVisible(false);
          setSelectedUserId(null);
        }}
      />
    </div>
  );
};
