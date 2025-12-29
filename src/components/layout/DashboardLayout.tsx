import { ReactNode, useState } from "react";
import { Layout, Avatar, Badge, Tag, Breadcrumb, Dropdown, Drawer, List } from "antd";
import type { MenuProps } from "antd";
import {
  BellOutlined,
  DownOutlined,
  HomeOutlined,
  UserOutlined,
  LogoutOutlined,
  SettingOutlined,
} from "@ant-design/icons";
import { Sidebar } from "./Sidebar";
import { useLocation, Link, useNavigate } from "react-router-dom";
import { ROUTES } from "../../routes/paths";
import { useAuth } from "../../hooks/useAuth";

const { Header: AntHeader, Sider, Content } = Layout;

interface DashboardLayoutProps {
  children: ReactNode;
}

export const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [notificationDrawerOpen, setNotificationDrawerOpen] = useState(false);

  const routeNameMap: Record<string, string> = {
    [ROUTES.DASHBOARD]: "Dashboard",
    [ROUTES.MENU]: "Products",
    [ROUTES.PRODUCTS]: "Products",
    [ROUTES.CATEGORIES]: "Categories",
    [ROUTES.TOPPINGS]: "Toppings",
    [ROUTES.ORDERS]: "Orders",
    [ROUTES.SALES]: "Sales",
    [ROUTES.PROMOS]: "Coupons",
    [ROUTES.TENANTS]: "Restaurants",
    [ROUTES.USERS]: "Users",
    [ROUTES.SETTINGS]: "Settings",
    [ROUTES.HELP]: "Help",
  };

  const getBreadcrumbItems = () => {
    const pathSnippets = location.pathname.split("/").filter((i) => i);

    const breadcrumbItems = [
      {
        title: (
          <Link to={ROUTES.DASHBOARD}>
            <HomeOutlined />
          </Link>
        ),
      },
    ];

    if (location.pathname !== ROUTES.DASHBOARD && pathSnippets.length > 0) {
      const firstPath = `/${pathSnippets[0]}`;

      // Add the main section (e.g., Orders, Users, etc.)
      if (pathSnippets.length === 1) {
        breadcrumbItems.push({
          title: <span>{routeNameMap[firstPath] || pathSnippets[0]}</span>,
        });
      } else {
        // For nested routes, add parent as a link
        const parentPath = firstPath === "/menu" ? ROUTES.MENU : firstPath;
        breadcrumbItems.push({
          title: <Link to={parentPath}>{routeNameMap[firstPath] || pathSnippets[0]}</Link>,
        });

        // Add the detail page (e.g., Order #123, Create)
        if (pathSnippets[0] === "orders" && pathSnippets[1]) {
          breadcrumbItems.push({
            title: <span>Order #{pathSnippets[1]}</span>,
          });
        } else if (
          pathSnippets[0] === "products" &&
          pathSnippets[1] &&
          pathSnippets[1] !== "create"
        ) {
          breadcrumbItems.push({
            title: <span>Product #{pathSnippets[1]}</span>,
          });
        } else if (
          pathSnippets[0] === "toppings" &&
          pathSnippets[1] &&
          pathSnippets[1] !== "create"
        ) {
          breadcrumbItems.push({
            title: <span>Topping #{pathSnippets[1]}</span>,
          });
        } else if (
          (pathSnippets[0] === "products" || pathSnippets[0] === "toppings") &&
          pathSnippets[1] === "create"
        ) {
          breadcrumbItems.push({
            title: <span>Create</span>,
          });
        } else {
          breadcrumbItems.push({
            title: <span>{pathSnippets[1]}</span>,
          });
        }
      }
    }

    return breadcrumbItems;
  };

  const handleLogout = async () => {
    await logout();
    navigate(ROUTES.LOGIN);
  };

  const userMenuItems: MenuProps["items"] = [
    {
      key: "profile",
      icon: <UserOutlined />,
      label: (
        <div>
          <div style={{ fontWeight: 600 }}>
            {user?.firstName} {user?.lastName}
          </div>
          <div style={{ fontSize: "12px", color: "#8c8c8c" }}>{user?.email}</div>
          <div style={{ fontSize: "12px", color: "#8c8c8c", textTransform: "capitalize" }}>
            {user?.role}
          </div>
        </div>
      ),
    },
    {
      type: "divider",
    },
    {
      key: "settings",
      icon: <SettingOutlined />,
      label: "Settings",
      onClick: () => navigate(ROUTES.SETTINGS),
    },
    {
      key: "logout",
      icon: <LogoutOutlined />,
      label: "Logout",
      onClick: handleLogout,
      danger: true,
    },
  ];

  // Mock notification data
  const notifications = [
    {
      id: 1,
      title: "New Order Received",
      description: "Order #12345 has been placed",
      time: "5 minutes ago",
    },
    {
      id: 2,
      title: "Low Stock Alert",
      description: "Margherita Pizza is running low",
      time: "1 hour ago",
    },
    {
      id: 3,
      title: "New User Registration",
      description: "John Doe has registered as a customer",
      time: "2 hours ago",
    },
    {
      id: 4,
      title: "Payment Received",
      description: "Payment of $125.50 received for Order #12340",
      time: "3 hours ago",
    },
    {
      id: 5,
      title: "Menu Updated",
      description: "New items added to the menu",
      time: "5 hours ago",
    },
  ];

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider
        width={240}
        style={{
          background: "#fff",
          borderRight: "1px solid #f0f0f0",
        }}
      >
        <Sidebar />
      </Sider>
      <Layout>
        <AntHeader
          style={{
            background: "#fff",
            padding: "0 24px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            borderBottom: "1px solid #f0f0f0",
          }}
        >
          <div>
            <Tag color="orange" style={{ borderRadius: "12px" }}>
              Bandra, Mumbai
            </Tag>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            <Badge count={notifications.length}>
              <BellOutlined
                style={{ fontSize: "18px", cursor: "pointer" }}
                onClick={() => setNotificationDrawerOpen(true)}
              />
            </Badge>
            <Dropdown menu={{ items: userMenuItems }} trigger={["click"]} placement="bottomRight">
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  cursor: "pointer",
                }}
              >
                <Avatar
                  src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.firstName || "User"}`}
                  size={40}
                />
                <DownOutlined style={{ fontSize: "12px" }} />
              </div>
            </Dropdown>
          </div>
        </AntHeader>
        <Content
          style={{
            padding: "24px",
            background: "#f5f5f5",
            minHeight: "calc(100vh - 64px)",
          }}
        >
          <Breadcrumb items={getBreadcrumbItems()} style={{ marginBottom: "16px" }} />
          {children}
        </Content>
      </Layout>

      {/* Notification Drawer */}
      <Drawer
        title="Notifications"
        placement="right"
        onClose={() => setNotificationDrawerOpen(false)}
        open={notificationDrawerOpen}
        width={400}
      >
        <List
          dataSource={notifications}
          renderItem={(item) => (
            <List.Item
              style={{
                padding: "16px",
                borderBottom: "1px solid #f0f0f0",
                cursor: "pointer",
              }}
            >
              <List.Item.Meta
                title={<div style={{ fontWeight: 600, marginBottom: "4px" }}>{item.title}</div>}
                description={
                  <div>
                    <div style={{ marginBottom: "4px" }}>{item.description}</div>
                    <div style={{ fontSize: "12px", color: "#8c8c8c" }}>{item.time}</div>
                  </div>
                }
              />
            </List.Item>
          )}
        />
      </Drawer>
    </Layout>
  );
};
