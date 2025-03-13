import React from "react";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "ghost";
};

const Button: React.FC<ButtonProps> = ({
  variant,
  className,
  children,
  ...props
}) => {
  return (
    <button
      className={`px-4 py-2 rounded ${
        variant === "ghost" ? "bg-transparent text-white hover:bg-gray-800" : ""
      } ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
