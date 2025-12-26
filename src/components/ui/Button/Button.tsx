import { Button as AntButton } from "antd";
import { CustomButtonProps } from "./Button.types";

const Button = ({
  variant = "primary",
  fullWidth = false,
  className = "",
  ...props
}: CustomButtonProps) => {
  const getVariantClass = () => {
    switch (variant) {
      case "secondary":
        return "bg-gray-600 hover:bg-gray-700";
      case "outline":
        return "border-2 border-primary-600 text-primary-600 bg-transparent hover:bg-primary-50";
      case "ghost":
        return "bg-transparent hover:bg-gray-100";
      default:
        return "";
    }
  };

  const variantType = variant === "primary" ? "primary" : "default";
  const widthClass = fullWidth ? "w-full" : "";
  const combinedClassName = `${getVariantClass()} ${widthClass} ${className}`.trim();

  return <AntButton type={variantType} className={combinedClassName} {...props} />;
};

export default Button;
