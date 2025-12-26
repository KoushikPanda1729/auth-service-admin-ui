import { InputProps } from "antd";
import { PasswordProps } from "antd/es/input";

export interface CustomInputProps extends InputProps {
  label?: string;
  error?: string;
}

export interface CustomPasswordProps extends PasswordProps {
  label?: string;
  error?: string;
}
