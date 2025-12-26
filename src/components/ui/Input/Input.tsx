import { Input as AntInput, Typography } from "antd";
import { CustomInputProps, CustomPasswordProps } from "./Input.types";

const { Text } = Typography;

const Input = ({ label, error, className = "", ...props }: CustomInputProps) => {
  return (
    <div className="w-full">
      {label && <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>}
      <AntInput size="large" className={className} status={error ? "error" : ""} {...props} />
      {error && (
        <Text type="danger" className="text-sm mt-1 block">
          {error}
        </Text>
      )}
    </div>
  );
};

const Password = ({ label, error, className = "", ...props }: CustomPasswordProps) => {
  return (
    <div className="w-full">
      {label && <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>}
      <AntInput.Password
        size="large"
        className={className}
        status={error ? "error" : ""}
        {...props}
      />
      {error && (
        <Text type="danger" className="text-sm mt-1 block">
          {error}
        </Text>
      )}
    </div>
  );
};

Input.Password = Password;

export default Input;
