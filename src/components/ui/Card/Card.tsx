import { Card as AntCard } from "antd";
import { CustomCardProps } from "./Card.types";

const Card = ({
  children,
  padding = "medium",
  shadow = "medium",
  className = "",
  ...props
}: CustomCardProps) => {
  const getPaddingClass = () => {
    switch (padding) {
      case "small":
        return "p-4";
      case "large":
        return "p-8";
      default:
        return "p-6";
    }
  };

  const getShadowClass = () => {
    switch (shadow) {
      case "none":
        return "shadow-none";
      case "small":
        return "shadow-sm";
      case "large":
        return "shadow-lg";
      default:
        return "shadow-md";
    }
  };

  const combinedClassName =
    `${getPaddingClass()} ${getShadowClass()} rounded-lg bg-white ${className}`.trim();

  return (
    <AntCard className={combinedClassName} {...props}>
      {children}
    </AntCard>
  );
};

export default Card;
