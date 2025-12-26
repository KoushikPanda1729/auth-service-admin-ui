import { ButtonProps } from "antd";

export type ButtonVariant = "primary" | "secondary" | "outline" | "ghost";

export interface CustomButtonProps extends Omit<ButtonProps, "type" | "variant"> {
  variant?: ButtonVariant;
  fullWidth?: boolean;
}
