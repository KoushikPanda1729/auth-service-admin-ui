import { Menu } from "antd";
import { useNavigate, useLocation } from "react-router-dom";
import {
  HomeOutlined,
  ShoppingOutlined,
  ShoppingCartOutlined,
  BarChartOutlined,
  TagOutlined,
  SettingOutlined,
  QuestionCircleOutlined,
  UserOutlined,
  TeamOutlined,
} from "@ant-design/icons";
import { ROUTES } from "../../routes/paths";

export const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    {
      key: ROUTES.DASHBOARD,
      icon: <HomeOutlined />,
      label: "Home",
    },
    {
      key: ROUTES.MENU,
      icon: <ShoppingOutlined />,
      label: "Menu",
    },
    {
      key: ROUTES.ORDERS,
      icon: <ShoppingCartOutlined />,
      label: "Orders",
    },
    {
      key: ROUTES.SALES,
      icon: <BarChartOutlined />,
      label: "Sales",
    },
    {
      key: ROUTES.PROMOS,
      icon: <TagOutlined />,
      label: "Promos",
    },
    {
      key: ROUTES.TENANTS,
      icon: <TeamOutlined />,
      label: "Tenants",
    },
    {
      key: ROUTES.USERS,
      icon: <UserOutlined />,
      label: "Users",
    },
  ];

  const bottomMenuItems = [
    {
      key: ROUTES.SETTINGS,
      icon: <SettingOutlined />,
      label: "Settings",
    },
    {
      key: ROUTES.HELP,
      icon: <QuestionCircleOutlined />,
      label: "Help",
    },
  ];

  const handleMenuClick = (key: string) => {
    navigate(key);
  };

  return (
    <div className="flex flex-col h-full">
      <div className="p-6">
        <div className="flex items-center gap-2 mb-8">
          <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center">
            <span className="text-white font-bold text-sm">P</span>
          </div>
          <span className="text-xl font-bold text-gray-900">PIZZA</span>
        </div>
      </div>

      <div className="flex-1">
        <Menu
          mode="inline"
          selectedKeys={[location.pathname]}
          onClick={({ key }) => handleMenuClick(key)}
          items={menuItems}
          style={{ border: "none" }}
        />
      </div>

      <div className="mt-auto border-t border-gray-200">
        <Menu
          mode="inline"
          selectedKeys={[location.pathname]}
          onClick={({ key }) => handleMenuClick(key)}
          items={bottomMenuItems}
          style={{ border: "none" }}
        />
      </div>
    </div>
  );
};
