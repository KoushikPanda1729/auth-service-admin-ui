import { UsersList } from "../modules/users/components/UsersList";
import { DashboardLayout } from "../components/layout/DashboardLayout";

export const UsersPage = () => {
  return (
    <DashboardLayout>
      <UsersList />
    </DashboardLayout>
  );
};
