// frontend\src\screens\order\CartScreen.tsx

// External Imports
import { ChangeEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaTrash } from "react-icons/fa";

// Internal Imports
import { Message } from "../../components/common/Message";
import { useCartStore } from "../../state/store";
import { Cart } from "../../../../backend/interfaces";

export const CartScreen: React.FC = () => {
  const { cartItems, createCartItem, deleteCartItem } = useCartStore();
  const navigate = useNavigate();

  const handleQtyChange = (product: Cart, qty: number) => {
    createCartItem({ ...product, qty });
  };

  const handleRemoveItem = (id: number) => {
    deleteCartItem(id);
  };

  const handleCheckout = () => {
    navigate("/shipping");
  };

  const totalItems = cartItems.reduce(
    (acc: any, item: { qty: any }) => acc + item.qty,
    0
  );
  const totalPrice = cartItems
    .reduce(
      (acc: number, item: { qty: number; product: { price: number } }) =>
        acc + item.qty * item.product.price,
      0
    )
    .toFixed(2);

  return (
    <>
      <Link className="my-3 text-blue-500" to="/">
        Go Back
      </Link>
      <h1 className="mb-2 mt-2 text-center  text-3xl font-bold text-custom-blue-dark">
        Shopping Cart
      </h1>
      <div className="flex flex-col md:flex-row">
        <div className="w-full md:w-2/3">
          {cartItems.length === 0 ? (
            <Message>
              Your cart is empty <Link to="/">Go Back</Link>
            </Message>
          ) : (
            <div className="space-y-4">
              {cartItems.map((item: Cart) => (
                <div
                  key={item.product.id}
                  className="flex items-center justify-between rounded border border-gray-200 p-2"
                >
                  <div className="flex items-center space-x-4">
                    <img
                      src={item.product.image}
                      alt={item.product.name}
                      className="h-16 w-16 rounded"
                    />
                    <Link
                      to={`/products/${item.product.id}`}
                      className="text-lg"
                    >
                      {item.product.name}
                    </Link>
                  </div>
                  <div className="text-lg">${item.product.price}</div>
                  <select
                    className="form-select mt-1 block w-20"
                    value={item.qty}
                    onChange={(e: ChangeEvent<HTMLSelectElement>) =>
                      handleQtyChange(item, Number(e.target.value))
                    }
                  >
                    {[...Array(item.product.countInStock).keys()].map((x) => (
                      <option key={x + 1} value={x + 1}>
                        {x + 1}
                      </option>
                    ))}
                  </select>
                  <button
                    className="text-red-500 hover:text-red-700"
                    onClick={() => handleRemoveItem(item.product.id)}
                  >
                    <FaTrash />
                  </button>
                  <div className="text-lg">
                    Subtotal: ${item.qty * item.product.price}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        <div className="w-full md:ml-6 md:w-1/3">
          <div className="rounded border border-gray-200 p-4 md:mt-0">
            <h2 className="text-2xl">Total ({totalItems}) items</h2>$
            {totalPrice}
            <button
              className={`mt-4 w-full rounded bg-blue-500 px-4 py-2 text-white transition duration-200 hover:bg-blue-700 ${
                cartItems.length === 0 && "cursor-not-allowed"
              }`}
              type="button"
              disabled={cartItems.length === 0}
              onClick={handleCheckout}
            >
              Proceed To Checkout
            </button>
          </div>
        </div>
      </div>
    </>
  );
};
