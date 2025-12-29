import { useEffect, useState } from "react";
import { Card, Table, Button, Space, Modal, Tag, Input, Select, Avatar, Dropdown } from "antd";
import {
  SearchOutlined,
  PlusOutlined,
  MoreOutlined,
  EditOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";
import type { MenuProps } from "antd";
import { useUsers } from "../hooks/useUsers";
import type { User } from "../api/types";
import { CreateManagerModal } from "./CreateManagerModal";
import { EditUserModal } from "./EditUserModal";

const { Option } = Select;

export const UsersList = () => {
  const {
    users,
    loading,
    currentPage,
    pageSize,
    total,
    searchQuery,
    roleFilter,
    loadUsers,
    handleDeleteUser,
    handlePageChange,
    handleSearchChange,
    handleRoleFilterChange,
  } = useUsers();

  const [createModalVisible, setCreateModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>("all");

  useEffect(() => {
    loadUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    loadUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchQuery, roleFilter]);

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

  const getActionMenu = (record: User): MenuProps => ({
    items: [
      {
        key: "edit",
        icon: <EditOutlined />,
        label: "Edit",
        onClick: () => handleEdit(record.id),
      },
      {
        key: "delete",
        icon: <DeleteOutlined />,
        label: "Delete",
        danger: true,
        onClick: () => handleDelete(record.id, `${record.firstName} ${record.lastName}`),
      },
    ],
  });

  const getStatusTag = () => {
    // For now, showing all users as active (you can extend this later)
    return <Tag color="green">Active</Tag>;
  };

  const getRoleDisplay = (role: string) => {
    const roleMap: Record<string, string> = {
      admin: "Admin",
      manager: "Manager",
      customer: "Customer",
    };
    return roleMap[role] || role;
  };

  const columns: ColumnsType<User> = [
    {
      title: "User name",
      key: "userName",
      render: (_, record) => (
        <Space>
          <Avatar
            src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${record.firstName}`}
            size={40}
          />
          <span>
            {record.firstName} {record.lastName}
          </span>
        </Space>
      ),
    },
    {
      title: "Status",
      key: "status",
      render: () => getStatusTag(),
    },
    {
      title: "Role",
      dataIndex: "role",
      key: "role",
      render: (role: string) => getRoleDisplay(role),
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Created at",
      key: "createdAt",
      render: () => "25 July 2022", // Placeholder - replace with actual data when available
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
      title={<span style={{ fontSize: "20px", fontWeight: "600" }}>Users</span>}
      extra={
        <Space>
          <Input
            placeholder="Search..."
            prefix={<SearchOutlined />}
            style={{ width: 200 }}
            value={searchQuery}
            onChange={(e) => handleSearchChange(e.target.value)}
          />
          <Select value={statusFilter} onChange={setStatusFilter} style={{ width: 120 }}>
            <Option value="all">Status</Option>
            <Option value="active">Active</Option>
            <Option value="banned">Banned</Option>
            <Option value="valid">Valid</Option>
          </Select>
          <Select value={roleFilter} onChange={handleRoleFilterChange} style={{ width: 120 }}>
            <Option value="all">Role</Option>
            <Option value="admin">Admin</Option>
            <Option value="manager">Manager</Option>
            <Option value="customer">Customer</Option>
          </Select>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            style={{ background: "#ff4d4f" }}
            onClick={() => setCreateModalVisible(true)}
          >
            Create users
          </Button>
        </Space>
      }
    >
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
    </Card>
  );
};
