import { useState } from "react";
import { Link } from "react-router-dom";
import { Checkbox, Typography } from "antd";
import { MailOutlined, LockOutlined } from "@ant-design/icons";
import { useLogin } from "../hooks/useLogin";
import { validateLoginForm } from "../utils/validation";
import type { ValidationErrors } from "../utils/validation";
import FormContainer from "../../../components/common/FormContainer";
import { Input, Button } from "../../../components/ui";

const { Text } = Typography;

const LoginForm = () => {
  const { loading, handleLogin } = useLogin();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [errors, setErrors] = useState<ValidationErrors>({});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const validationErrors = validateLoginForm(email, password);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setErrors({});
    await handleLogin({ email, password, rememberMe });
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    if (errors.email) {
      setErrors((prev) => ({ ...prev, email: undefined }));
    }
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
    if (errors.password) {
      setErrors((prev) => ({ ...prev, password: undefined }));
    }
  };

  return (
    <FormContainer
      title="Welcome Back"
      subtitle="Sign in to your account"
      footer={
        <Text>
          Don&apos;t have an account?{" "}
          <Link to="/register" className="text-blue-600 hover:text-blue-700 font-medium">
            Sign up
          </Link>
        </Text>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          placeholder="Enter your email"
          prefix={<MailOutlined className="text-gray-400" />}
          value={email}
          onChange={handleEmailChange}
          error={errors.email}
        />

        <Input.Password
          placeholder="Enter your password"
          prefix={<LockOutlined className="text-gray-400" />}
          value={password}
          onChange={handlePasswordChange}
          error={errors.password}
        />

        <div className="flex items-center justify-between">
          <Checkbox checked={rememberMe} onChange={(e) => setRememberMe(e.target.checked)}>
            Remember me
          </Checkbox>
          <Link to="/forgot-password" className="text-blue-600 hover:text-blue-700">
            Forgot password?
          </Link>
        </div>

        <Button variant="primary" htmlType="submit" loading={loading} fullWidth>
          {loading ? "Signing In..." : "Sign In"}
        </Button>
      </form>
    </FormContainer>
  );
};

export default LoginForm;
