import React, { ReactNode } from "react";

type Variant = "danger" | "success" | "info";

interface Props {
  variant?: Variant;
  children: ReactNode;
}

export const Message: React.FC<Props> = ({ variant = "info", children }) => {
  let classes = "";

  switch (variant) {
    case "danger":
      classes =
        "bg-custom-red-lightest border-custom-red-light text-custom-red-dark";
      break;
    case "success":
      classes =
        "bg-custom-green-lightest border-custom-green-light text-custom-green-dark";
      break;
    case "info":
      classes =
        "bg-custom-blue-lightest border-custom-blue-light text-custom-blue-dark";
      break;
    default:
      classes =
        "bg-custom-blue-lightest border-custom-blue-light text-custom-blue-dark";
  }

  return (
    <div className={`mb-4 mt-4 rounded border-l-4 p-4 ${classes}`} role="alert">
      {children}
    </div>
  );
};
