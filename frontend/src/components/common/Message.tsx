// frontend\src\components\common\Message.tsx

import React, { ReactNode } from "react";

type Variant = "danger" | "success" | "info";

interface Props {
  variant?: Variant;
  children: ReactNode;
}

const Message: React.FC<Props> = ({ variant = "info", children }) => {
  let classes = "";

  switch (variant) {
    case "danger":
      classes = "bg-red-100 border-red-500 text-red-700";
      break;
    case "success":
      classes = "bg-green-100 border-green-500 text-green-700";
      break;
    case "info":
      classes = "bg-blue-100 border-blue-500 text-blue-700";
      break;
    default:
      classes = "bg-blue-100 border-blue-500 text-blue-700";
  }

  return (
    <div className={`mb-4 mt-4 rounded border-l-4 p-4 ${classes}`} role="alert">
      {children}
    </div>
  );
};

export default Message;
