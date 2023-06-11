// frontend\src\components\forms\FormContainer.tsx

import React, { ReactNode } from "react";

interface FormContainerProps {
  children: ReactNode;
}

const FormContainer: React.FC<FormContainerProps> = ({
  children,
}: FormContainerProps) => {
  return (
    <div className="mt-4 flex justify-center sm:mt-6 md:mt-8 lg:mt-10">
      <div className="w-full bg-custom-blue-lightest p-4 md:w-1/2 lg:w-4/5">
        {children}
      </div>
    </div>
  );
};

export default FormContainer;
