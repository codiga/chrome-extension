import React, { ButtonHTMLAttributes } from "react";
import clsx from "clsx";

type ButtonProps = {
  children: React.ReactNode;
  variant: "primary" | "secondary";
  shape: "pill" | "square";
  onClick?: () => void;
} & ButtonHTMLAttributes<HTMLButtonElement>;

export default function Button({
  children,
  variant,
  shape,
  onClick,
  ...props
}: ButtonProps) {
  return (
    <button
      onClick={onClick}
      className={clsx(
        "codiga-button",
        `codiga-button__${variant}`,
        `codiga-button__${shape}`,
      )}
      {...props}
    >
      {children}
    </button>
  );
}
