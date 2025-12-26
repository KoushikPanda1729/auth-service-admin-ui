import { useNavigate } from "react-router-dom";
import { Button, Card } from "../components/ui";
import { ROUTES } from "../routes/paths";

export const NotFoundPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        <Card shadow="medium">
          <div className="text-center py-12">
            <h1 className="text-6xl font-bold text-gray-900 mb-4">404</h1>
            <h2 className="text-2xl font-semibold text-gray-700 mb-4">Page Not Found</h2>
            <p className="text-gray-600 mb-8">
              The page you are looking for does not exist or has been moved.
            </p>
            <Button variant="primary" onClick={() => navigate(ROUTES.HOME)} fullWidth>
              Go to Home
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};
