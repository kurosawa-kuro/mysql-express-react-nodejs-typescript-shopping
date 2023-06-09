// frontend\src\screens\order\ShippingScreen.jsx

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import FormContainer from '../../components/forms/FormContainer';
import CheckoutSteps from '../../components/layout/CheckoutSteps';
import { useCartStore } from '../../state/store'; // import useCartStore

const ShippingScreen = () => {
  const { shippingAddress, saveShippingAddress } = useCartStore(); // get state and action from useCartStore

  const [address, setAddress] = useState(shippingAddress.address || '');
  const [city, setCity] = useState(shippingAddress.city || '');
  const [postalCode, setPostalCode] = useState(
    shippingAddress.postalCode || ''
  );

  const navigate = useNavigate();

  const submitHandler = (e) => {
    e.preventDefault();
    saveShippingAddress({ address, city, postalCode });
    navigate('/payment');
  };

  return (
    <FormContainer>
      <CheckoutSteps step1 step2 />
      <h1 className="text-3xl mb-4">Shipping</h1>
      <form onSubmit={submitHandler}>
        <div className='mb-4' id='address'>
          <label className="block text-gray-700 text-sm font-bold mb-2">Address</label>
          <input
            className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
            type='text'
            placeholder='Enter address'
            value={address}
            required
            onChange={(e) => setAddress(e.target.value)}
          />
        </div>

        <div className='mb-4' id='city'>
          <label className="block text-gray-700 text-sm font-bold mb-2">City</label>
          <input
            className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
            type='text'
            placeholder='Enter city'
            value={city}
            required
            onChange={(e) => setCity(e.target.value)}
          />
        </div>

        <div className='mb-4' id='postalCode'>
          <label className="block text-gray-700 text-sm font-bold mb-2">Postal Code</label>
          <input
            className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
            type='text'
            placeholder='Enter postal code'
            value={postalCode}
            required
            onChange={(e) => setPostalCode(e.target.value)}
          />
        </div>

        <button className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline' type='submit'>
          Continue
        </button>
      </form>
    </FormContainer >
  );
};

export default ShippingScreen;
