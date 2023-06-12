// frontend\src\screens\order\ShippingScreen.tsx

import { useState, FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import FormContainer from "../../components/forms/FormContainer";
import { CheckoutSteps } from "../../components/layout/CheckoutSteps";
import { useCartStore } from "../../state/store"; // import useCartStore

interface ShippingAddress {
  address: string;
  city: string;
  postalCode: string;
}

export const ShippingScreen: React.FC = () => {
  const { shippingAddress, saveShippingAddress } = useCartStore(); // get state and action from useCartStore

  const [address, setAddress] = useState<string>(shippingAddress.address || "");
  const [city, setCity] = useState<string>(shippingAddress.city || "");
  const [postalCode, setPostalCode] = useState<string>(
    shippingAddress.postalCode || ""
  );

  const navigate = useNavigate();

  const submitHandler = (e: FormEvent) => {
    e.preventDefault();
    saveShippingAddress({ address, city, postalCode } as ShippingAddress);
    navigate("/payment");
  };

  return (
    <FormContainer>
      <CheckoutSteps step1 step2 />
      <h1 className="mb-4 text-3xl">Shipping</h1>
      <form onSubmit={submitHandler}>
        <div className="mb-4" id="address">
          <label className="mb-2 block text-sm font-bold text-gray-700">
            Address
          </label>
          <input
            className="focus:shadow-outline w-full appearance-none rounded border px-3 py-2 leading-tight text-gray-700 shadow focus:outline-none"
            type="text"
            placeholder="Enter address"
            value={address}
            required
            onChange={(e) => setAddress(e.target.value)}
          />
        </div>

        <div className="mb-4" id="city">
          <label className="mb-2 block text-sm font-bold text-gray-700">
            City
          </label>
          <input
            className="focus:shadow-outline w-full appearance-none rounded border px-3 py-2 leading-tight text-gray-700 shadow focus:outline-none"
            type="text"
            placeholder="Enter city"
            value={city}
            required
            onChange={(e) => setCity(e.target.value)}
          />
        </div>

        <div className="mb-4" id="postalCode">
          <label className="mb-2 block text-sm font-bold text-gray-700">
            Postal Code
          </label>
          <input
            className="focus:shadow-outline w-full appearance-none rounded border px-3 py-2 leading-tight text-gray-700 shadow focus:outline-none"
            type="text"
            placeholder="Enter postal code"
            value={postalCode}
            required
            onChange={(e) => setPostalCode(e.target.value)}
          />
        </div>

        <button
          className="focus:shadow-outline rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700 focus:outline-none"
          type="submit"
        >
          Continue
        </button>
      </form>
    </FormContainer>
  );
};
