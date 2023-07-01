// frontend\src\components\forms\FormContainer.tsx

import React, { ReactNode } from "react";

interface FormContainerProps {
  children: ReactNode;
}

export const Container: React.FC<FormContainerProps> = ({
  children,
}: FormContainerProps) => {
  return <div className="container mx-auto px-4">{children}</div>;
};
