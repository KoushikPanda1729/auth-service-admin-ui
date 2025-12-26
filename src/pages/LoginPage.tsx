import LoginForm from "../modules/login/components/LoginForm";
import { Card } from "../components/ui";
import { AuthLayout } from "../components/layout/AuthLayout";

export const LoginPage = () => {
  return (
    <AuthLayout>
      <Card shadow="medium">
        <LoginForm />
      </Card>
    </AuthLayout>
  );
};
