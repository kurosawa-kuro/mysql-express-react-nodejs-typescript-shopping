// frontend\src\screens\order\CartScreen.jsx

import { Link, useNavigate } from 'react-router-dom';
import { FaTrash } from 'react-icons/fa';
import Message from '../../components/common/Message';
import { useCartStore } from '../../state/store';

const CartScreen = () => {
  const navigate = useNavigate();

  const {
    cartItems,
    addToCart,
    removeFromCart
  } = useCartStore();

  const addToCartHandler = async (product, qty) => {
    addToCart({ ...product, qty });
  };

  const removeFromCartHandler = (id) => {
    removeFromCart(id);
  };

  const checkoutHandler = () => {
    navigate('/login?redirect=/shipping');
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Shopping Cart</h2>
      <div className="flex flex-col md:flex-row">
        <div className="w-full md:w-2/3">
          {cartItems.length === 0 ? (
            <Message>
              Your cart is empty <Link to='/'>Go Back</Link>
            </Message>
          ) : (
            <div className="space-y-4">
              {cartItems.map((item) => (
                <div key={item.id} className="flex items-center justify-between p-2 border border-gray-200 rounded">
                  <div className="flex items-center space-x-4">
                    <img src={item.image} alt={item.name} className="w-16 h-16 rounded" />
                    <Link to={`/product/${item.id}`} className="text-lg">{item.name}</Link>
                  </div>
                  <div className="text-lg">${item.price}</div>
                  <select
                    className="form-select block w-20 mt-1"
                    value={item.qty}
                    onChange={(e) =>
                      addToCartHandler(item, Number(e.target.value))
                    }
                  >
                    {[...Array(item.countInStock).keys()].map((x) => (
                      <option key={x + 1} value={x + 1}>
                        {x + 1}
                      </option>
                    ))}
                  </select>
                  <button
                    className="text-red-500 hover:text-red-700"
                    onClick={() => removeFromCartHandler(item.id)}
                  >
                    <FaTrash />
                  </button>
                  <div className="text-lg">Subtotal: ${item.qty * item.price}</div>
                </div>
              ))}
            </div>
          )}
        </div>
        <div className="w-full md:w-1/3 md:ml-6">
          <div className="p-4 border border-gray-200 rounded md:mt-0">
            <h2 className="text-2xl">
              Total ({cartItems.reduce((acc, item) => acc + item.qty, 0)})
              items
            </h2>
            $
            {cartItems
              .reduce((acc, item) => acc + item.qty * item.price, 0)
              .toFixed(2)}
            <button
              className={`mt-4 w-full py-2 px-4 text-white bg-blue-500 rounded hover:bg-blue-700 transition duration-200 ${cartItems.length === 0 && 'cursor-not-allowed'}`}
              type='button'
              disabled={cartItems.length === 0}
              onClick={checkoutHandler}
            >
              Proceed To Checkout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartScreen;
