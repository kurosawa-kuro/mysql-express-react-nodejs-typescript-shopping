// frontend\src\screens\order\ShippingScreen.tsx

// External Imports
import { useState, FormEvent } from "react";
import { useNavigate } from "react-router-dom";

// Internal Imports
import FormContainer from "../../components/forms/FormContainer";
import { CheckoutSteps } from "../../components/layout/CheckoutSteps";
import { useCartStore } from "../../state/store";

interface ShippingAddress {
  address: string;
  city: string;
  postalCode: string;
}

export const ShippingScreen: React.FC = () => {
  const navigate = useNavigate();
  const { shippingAddress, saveShippingAddress } = useCartStore();
  const {
    address: savedAddress,
    city: savedCity,
    postalCode: savedPostalCode,
  } = shippingAddress;

  const [address, setAddress] = useState<string>(savedAddress || "");
  const [city, setCity] = useState<string>(savedCity || "");
  const [postalCode, setPostalCode] = useState<string>(savedPostalCode || "");

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
