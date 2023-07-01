// frontend\src\screens\order\PaymentScreen.tsx

// External Imports
import { useState, useEffect, FormEvent } from "react";
import { useNavigate } from "react-router-dom";

// Internal Imports
import { useCartStore } from "../../state/store";
import { FormContainer } from "../../components/layout/FormContainer";
import { CheckoutSteps } from "../../components/layout/CheckoutSteps";

export const PaymentScreen: React.FC = () => {
  const navigate = useNavigate();
  const { shipping, createPaymentMethod } = useCartStore();

  useEffect(() => {
    if (!shipping.address) {
      navigate("/shipping");
    }
  }, [navigate, shipping]);

  const [paymentMethod, setPaymentMethod] = useState("PayPal");

  const submitHandler = (e: FormEvent) => {
    e.preventDefault();
    createPaymentMethod(paymentMethod);
    navigate("/place-order");
  };

  return (
    <>
      <CheckoutSteps step1 step2 step3 />
      <FormContainer>
        <h1 className="mb-2 mt-2 text-center  text-3xl font-bold text-custom-blue-dark">
          Payment Method
        </h1>
        <form onSubmit={submitHandler}>
          <div>
            <label className="mb-2 block text-sm font-bold text-gray-700">
              Select Method
            </label>
            <div className="mt-2">
              <label className="mr-2 inline-flex items-center">
                <input
                  type="radio"
                  className="form-radio text-blue-500"
                  name="paymentMethod"
                  value="PayPal"
                  checked={paymentMethod === "PayPal"}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                />
                <span className="ml-2">PayPal or Credit Card</span>
              </label>
              <label className="inline-flex items-center">
                <input
                  type="radio"
                  className="form-radio text-blue-500"
                  name="paymentMethod"
                  value="Bank"
                  checked={paymentMethod === "Bank"}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                />
                <span className="ml-2">Bank</span>
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
    </>
  );
};
