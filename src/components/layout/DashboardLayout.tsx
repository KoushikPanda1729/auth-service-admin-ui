import { ReactNode } from "react";
import { Layout, Avatar, Badge, Tag, Breadcrumb } from "antd";
import { BellOutlined, DownOutlined, HomeOutlined } from "@ant-design/icons";
import { Sidebar } from "./Sidebar";
import { useLocation, Link } from "react-router-dom";
import { ROUTES } from "../../routes/paths";

const { Header: AntHeader, Sider, Content } = Layout;

interface DashboardLayoutProps {
  children: ReactNode;
}

export const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  const location = useLocation();

  const routeNameMap: Record<string, string> = {
    [ROUTES.DASHBOARD]: "Dashboard",
    [ROUTES.MENU]: "Products",
    [ROUTES.PRODUCTS]: "Products",
    [ROUTES.TOPPINGS]: "Toppings",
    [ROUTES.ORDERS]: "Orders",
    [ROUTES.SALES]: "Sales",
    [ROUTES.PROMOS]: "Promos",
    [ROUTES.TENANTS]: "Tenants",
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
            <Badge count={5}>
              <BellOutlined style={{ fontSize: "18px", cursor: "pointer" }} />
            </Badge>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                cursor: "pointer",
              }}
            >
              <Avatar src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" size={40} />
              <DownOutlined style={{ fontSize: "12px" }} />
            </div>
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
    </Layout>
  );
};
