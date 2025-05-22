import React from "react";
import { CardProps } from "@/app/types/CardProps";

const Card: React.FC<CardProps> = ({ children, className = "" }) => {
  return (
    <div className={`bg-gray-800 p-4 rounded-lg shadow-md ${className}`}>
      {children}
    </div>
  );
};

export default Card;

export const CardContent: React.FC<CardProps> = ({
  children,
  className = "",
}) => {
  return <div className={`p-4 ${className}`}>{children}</div>;
};
