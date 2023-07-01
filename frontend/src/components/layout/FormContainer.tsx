// frontend\src\components\forms\FormContainer.tsx

import React, { ReactNode } from "react";

interface FormContainerProps {
  children: ReactNode;
}

export const FormContainer: React.FC<FormContainerProps> = ({
  children,
}: FormContainerProps) => {
  return (
    <div className="mx-auto px-4">
      <div className="mt-4 flex justify-center">
        <div className="w-full bg-custom-blue-lightest p-4 md:w-1/2">
          {children}
        </div>
      </div>
    </div>
  );
};
