import { TenantsList } from "../modules/tenants/components/TenantsList";
import { DashboardLayout } from "../components/layout/DashboardLayout";

export const TenantsPage = () => {
  return (
    <DashboardLayout>
      <TenantsList />
    </DashboardLayout>
  );
};
