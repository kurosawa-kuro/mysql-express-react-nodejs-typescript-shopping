// frontend\src\screens\order\PaymentScreen.jsx

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import FormContainer from '../../components/forms/FormContainer';
import CheckoutSteps from '../../components/layout/CheckoutSteps';
import { useCartStore } from '../../state/store'; // import useCartStore

const PaymentScreen = () => {
  const navigate = useNavigate();

  const {
    shippingAddress,
    savePaymentMethod
  } = useCartStore(); // get state and actions from useCartStore

  useEffect(() => {
    if (!shippingAddress.address) {
      navigate('/shipping');
    }
  }, [navigate, shippingAddress]);

  const [paymentMethod, setPaymentMethod] = useState('PayPal');

  const submitHandler = (e) => {
    e.preventDefault();
    savePaymentMethod(paymentMethod); // use the action from useCartStore
    navigate('/place-order');
  };

  return (
    <FormContainer>
      <CheckoutSteps step1 step2 step3 />
      <h1 className="text-3xl mb-4">Payment Method</h1>
      <form onSubmit={submitHandler}>
        <div>
          <label className="block text-gray-700 text-sm font-bold mb-2">Select Method</label>
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

        <button className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mt-4' type='submit'>
          Continue
        </button>
      </form>
    </FormContainer >
  );
};

export default PaymentScreen;
