import RegisterForm from "../modules/register/components/RegisterForm";
import { Card } from "../components/ui";
import { AuthLayout } from "../components/layout/AuthLayout";

export const RegisterPage = () => {
  return (
    <AuthLayout>
      <Card shadow="medium">
        <RegisterForm />
      </Card>
    </AuthLayout>
  );
};
