// frontend\src\screens\order\PaymentScreen.jsx

// External Imports
import { useState, useEffect, FormEvent } from "react";
import { useNavigate } from "react-router-dom";

// Internal Imports
import { useCartStore } from "../../state/store";
import { FormContainer } from "../../components/forms/FormContainer";
import { CheckoutSteps } from "../../components/layout/CheckoutSteps";

export const PaymentScreen: React.FC = () => {
  const navigate = useNavigate();
  const { shippingAddress, savePaymentMethod } = useCartStore();

  // Redirect if shipping address is not set
  useEffect(() => {
    if (!shippingAddress.address) {
      navigate("/shipping");
    }
  }, [navigate, shippingAddress]);

  const [paymentMethod, setPaymentMethod] = useState("PayPal");

  const submitHandler = (e: FormEvent) => {
    e.preventDefault();
    savePaymentMethod(paymentMethod);
    navigate("/place-order");
  };

  return (
    <FormContainer>
      <CheckoutSteps step1 step2 step3 />
      <h1 className="mb-4 text-3xl">Payment Method</h1>
      <form onSubmit={submitHandler}>
        <div>
          <label className="mb-2 block text-sm font-bold text-gray-700">
            Select Method
          </label>
          <div className="mt-2">
            <label className="inline-flex items-center">
              <input
                type="radio"
                className="form-radio text-blue-500"
                name="paymentMethod"
                value="PayPal"
                checked
                onChange={(e) => setPaymentMethod(e.target.value)}
              />
              <span className="ml-2">PayPal or Credit Card</span>
            </label>
          </div>
        </div>

        <button
          className="focus:shadow-outline mt-4 rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700 focus:outline-none"
          type="submit"
        >
          Continue
        </button>
      </form>
    </FormContainer>
  );
};
