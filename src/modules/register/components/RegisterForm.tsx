import { useState } from "react";
import { Link } from "react-router-dom";
import { Typography } from "antd";
import { MailOutlined, LockOutlined, UserOutlined } from "@ant-design/icons";
import { useRegister } from "../hooks/useRegister";
import { validateRegisterForm } from "../utils/validation";
import type { ValidationErrors } from "../utils/validation";
import FormContainer from "../../../components/common/FormContainer";
import { Input, Button } from "../../../components/ui";

const { Text } = Typography;

const RegisterForm = () => {
  const { loading, handleRegister } = useRegister();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState<ValidationErrors>({});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const validationErrors = validateRegisterForm(
      firstName,
      lastName,
      email,
      password,
      confirmPassword
    );
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setErrors({});
    await handleRegister({ firstName, lastName, email, password, confirmPassword });
  };

  const handleFirstNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFirstName(e.target.value);
    if (errors.firstName) {
      setErrors((prev) => ({ ...prev, firstName: undefined }));
    }
  };

  const handleLastNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLastName(e.target.value);
    if (errors.lastName) {
      setErrors((prev) => ({ ...prev, lastName: undefined }));
    }
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

  const handleConfirmPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setConfirmPassword(e.target.value);
    if (errors.confirmPassword) {
      setErrors((prev) => ({ ...prev, confirmPassword: undefined }));
    }
  };

  return (
    <FormContainer
      title="Create Account"
      subtitle="Sign up to get started"
      footer={
        <Text>
          Already have an account?{" "}
          <Link to="/login" className="text-blue-600 hover:text-blue-700 font-medium">
            Sign in
          </Link>
        </Text>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          placeholder="Enter your first name"
          prefix={<UserOutlined className="text-gray-400" />}
          value={firstName}
          onChange={handleFirstNameChange}
          error={errors.firstName}
        />

        <Input
          placeholder="Enter your last name"
          prefix={<UserOutlined className="text-gray-400" />}
          value={lastName}
          onChange={handleLastNameChange}
          error={errors.lastName}
        />

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

        <Input.Password
          placeholder="Confirm your password"
          prefix={<LockOutlined className="text-gray-400" />}
          value={confirmPassword}
          onChange={handleConfirmPasswordChange}
          error={errors.confirmPassword}
        />

        <Button variant="primary" htmlType="submit" loading={loading} fullWidth>
          {loading ? "Creating Account..." : "Sign Up"}
        </Button>
      </form>
    </FormContainer>
  );
};

export default RegisterForm;
