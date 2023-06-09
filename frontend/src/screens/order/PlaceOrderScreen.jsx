// frontend\src\screens\order\PlaceOrderScreen.jsx

import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import Loader from '../../components/common/Loader';
import Message from '../../components/common/Message';
import CheckoutSteps from '../../components/layout/CheckoutSteps';
import { createOrderApi } from '../../services/api';  // Import the createOrderApi
import { useCartStore } from '../../state/store'; // import useCartStore

const PlaceOrderScreen = () => {
  const navigate = useNavigate();

  // get state and actions from useCartStore
  const {
    cartItems,
    shippingAddress,
    paymentMethod,
    clearCartItems
  } = useCartStore();

  const itemsPrice = cartItems.reduce((acc, item) => acc + item.price * item.qty, 0);
  const shippingPrice = itemsPrice > 100 ? 0 : 10;
  const taxPrice = Number((0.15 * itemsPrice).toFixed(2));
  const totalPrice = (
    Number(itemsPrice) +
    Number(shippingPrice) +
    Number(taxPrice)
  ).toFixed(2);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!shippingAddress.address) {
      navigate('/shipping');
    } else if (!paymentMethod) {
      navigate('/payment');
    }
  }, [paymentMethod, shippingAddress.address, navigate]);

  const placeOrderHandler = async () => {
    try {
      setLoading(true);
      const res = await createOrderApi({
        orderItems: cartItems,
        shippingAddress: shippingAddress,
        paymentMethod: paymentMethod,
        itemsPrice: itemsPrice,
        shippingPrice: shippingPrice,
        taxPrice: taxPrice,
        totalPrice: totalPrice,
      });
      clearCartItems();
      setLoading(false);
      navigate(`/order/${res.id}`);
    } catch (err) {
      setLoading(false);
      setError(err.message);
      toast.error(err.message);
    }
  };

  return (
    <div className="container mx-auto px-4">
      <CheckoutSteps step1 step2 step3 step4 />
      <div className="flex flex-wrap -mx-2">
        <div className="w-full md:w-2/3 px-2 mb-4">
          <div className="bg-white p-4 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold mb-2">Shipping</h2>
            <p>
              <strong>Address:</strong>
              {shippingAddress.address}, {shippingAddress.city}{' '}
              {shippingAddress.postalCode}
            </p>

            <h2 className="text-2xl font-bold mb-2 mt-4">Payment Method</h2>
            <strong>Method: </strong>
            {paymentMethod}

            <h2 className="text-2xl font-bold mb-2 mt-4">Order Items</h2>
            {cartItems.length === 0 ? (
              <Message>Your cart is empty</Message>
            ) : (
              <div>
                {cartItems.map((item, index) => (
                  <div key={index} className="flex items-center mb-2">
                    <div className="w-1/4">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="rounded"
                      />
                    </div>
                    <div className="w-1/2">
                      <Link to={`/product/${item.id}`}>
                        {item.name}
                      </Link>
                    </div>
                    <div className="w-1/4">
                      {item.qty} x ${item.price} = ${item.qty * item.price}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
        <div className="w-full md:w-1/3 px-2 mb-4">
          <div className="bg-white p-4 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold mb-2">Order Summary</h2>
            <div className="my-4">
              <div className="flex items-center justify-between mb-4">
                <div>Items</div>
                <div>${cartItems.reduce((acc, item) => acc + item.price * item.qty, 0)}</div>
              </div>
              <div className="flex items-center justify-between mb-4">
                <div>Shipping</div>
                <div>${shippingPrice}</div>
              </div>
              <div className="flex items-center justify-between mb-4">
                <div>Tax</div>
                <div>${taxPrice}</div>
              </div>
              <div className="flex justify-between">
                <div>Total</div>
                <div>${totalPrice}</div>
              </div>
            </div>
            {error && <Message variant='danger'>{error}</Message>}
            <button
              className={`w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline ${cartItems === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
              type='button'
              disabled={cartItems === 0}
              onClick={placeOrderHandler}
            >
              Place Order
            </button>
            {loading && <Loader />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlaceOrderScreen;
