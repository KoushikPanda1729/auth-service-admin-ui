import { Card } from "../components/ui";
import { useAuth } from "../hooks/useAuth";
import { DashboardLayout } from "../components/layout/DashboardLayout";

export const DashboardPage = () => {
  const { userId } = useAuth();

  return (
    <DashboardLayout>
      <Card shadow="medium">
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Welcome to Admin Dashboard</h2>
          <p className="text-gray-600 mb-2">You are successfully logged in!</p>
          <div className="mt-6 bg-gray-50 rounded-lg p-4 inline-block">
            <p className="text-sm text-gray-700">
              <span className="font-semibold">User ID:</span> {userId}
            </p>
          </div>
        </div>
      </Card>
    </DashboardLayout>
  );
};
