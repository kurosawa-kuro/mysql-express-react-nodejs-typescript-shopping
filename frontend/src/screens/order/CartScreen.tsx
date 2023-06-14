// frontend\src\screens\order\CartScreen.tsx

import { ChangeEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaTrash } from "react-icons/fa";
import Message from "../../components/common/Message";
import { useCartStore } from "../../state/store";
import { CartItem } from "../../interfaces";

export const CartScreen: React.FC = () => {
  const navigate = useNavigate();

  const { cartItems, addToCart, removeFromCart } = useCartStore();

  const addToCartHandler = (product: CartItem, qty: number) => {
    addToCart({ ...product, qty });
  };

  const removeFromCartHandler = (id: number) => {
    removeFromCart(id);
  };

  const checkoutHandler = () => {
    // navigate("/login?redirect=/shipping");
    navigate("/shipping");
  };

  return (
    <div>
      <h2 className="mb-4 text-2xl font-bold">Shopping Cart</h2>
      <div className="flex flex-col md:flex-row">
        <div className="w-full md:w-2/3">
          {cartItems.length === 0 ? (
            <Message>
              Your cart is empty <Link to="/">Go Back</Link>
            </Message>
          ) : (
            <div className="space-y-4">
              {cartItems.map((item: CartItem) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between rounded border border-gray-200 p-2"
                >
                  <div className="flex items-center space-x-4">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="h-16 w-16 rounded"
                    />
                    <Link to={`/products/${item.id}`} className="text-lg">
                      {item.name}
                    </Link>
                  </div>
                  <div className="text-lg">${item.price}</div>
                  <select
                    className="form-select mt-1 block w-20"
                    value={item.qty}
                    onChange={(e: ChangeEvent<HTMLSelectElement>) =>
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
                  <div className="text-lg">
                    Subtotal: ${item.qty * item.price}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        <div className="w-full md:ml-6 md:w-1/3">
          <div className="rounded border border-gray-200 p-4 md:mt-0">
            <h2 className="text-2xl">
              Total ({cartItems.reduce((acc, item) => acc + item.qty, 0)}) items
            </h2>
            $
            {cartItems
              .reduce((acc, item) => acc + item.qty * item.price, 0)
              .toFixed(2)}
            <button
              className={`mt-4 w-full rounded bg-blue-500 px-4 py-2 text-white transition duration-200 hover:bg-blue-700 ${
                cartItems.length === 0 && "cursor-not-allowed"
              }`}
              type="button"
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
