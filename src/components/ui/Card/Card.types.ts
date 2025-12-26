import { CardProps } from "antd";
import { ReactNode } from "react";

export type CardPadding = "small" | "medium" | "large";
export type CardShadow = "none" | "small" | "medium" | "large";

export interface CustomCardProps extends CardProps {
  children: ReactNode;
  padding?: CardPadding;
  shadow?: CardShadow;
}
