import { Button, Divider } from "antd";

interface TenantDropdownRenderProps {
  menu: React.ReactNode;
  hasMoreTenants: boolean;
  loadMoreTenants: () => void;
  tenantsLoading: boolean;
}

export const TenantDropdownRender = ({
  menu,
  hasMoreTenants,
  loadMoreTenants,
  tenantsLoading,
}: TenantDropdownRenderProps) => (
  <>
    {menu}
    {hasMoreTenants && (
      <>
        <Divider style={{ margin: "8px 0" }} />
        <div style={{ padding: "8px", textAlign: "center" }}>
          <Button
            type="link"
            onClick={loadMoreTenants}
            loading={tenantsLoading}
            style={{ width: "100%" }}
          >
            Load More Restaurants
          </Button>
        </div>
      </>
    )}
  </>
);
