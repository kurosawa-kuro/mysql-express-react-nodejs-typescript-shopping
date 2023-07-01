// frontend\src\components\layout\CheckoutSteps.tsx

import React from "react";
import { Link } from "react-router-dom";

interface CheckoutStepsProps {
  step1?: boolean;
  step2?: boolean;
  step3?: boolean;
  step4?: boolean;
}

export const CheckoutSteps: React.FC<CheckoutStepsProps> = ({
  step1,
  step2,
  step3,
  step4,
}) => {
  return (
    <div className="my-4 flex justify-center space-x-4">
      <div>
        {step1 ? (
          <Link to="/login" className="text-blue-500">
            Login In
          </Link>
        ) : (
          <span className="text-gray-500">Login In</span>
        )}
      </div>

      <div>
        {step2 ? (
          <Link to="/shipping" className="text-blue-500">
            Shipping
          </Link>
        ) : (
          <span className="text-gray-500">Shipping</span>
        )}
      </div>

      <div>
        {step3 ? (
          <Link to="/payment" className="text-blue-500">
            Payment
          </Link>
        ) : (
          <span className="text-gray-500">Payment</span>
        )}
      </div>

      <div>
        {step4 ? (
          <Link to="/place-order" className="text-blue-500">
            Place Order
          </Link>
        ) : (
          <span className="text-gray-500">Place Order</span>
        )}
      </div>
    </div>
  );
};
