// frontend\src\screens\order\PlaceOrderScreen.tsx

// External Imports
import { useState, useEffect, FC } from "react";
import { Link, useNavigate } from "react-router-dom";

// Internal Imports
import { Loader } from "../../components/common/Loader";
import { Message } from "../../components/common/Message";
import { CheckoutSteps } from "../../components/layout/CheckoutSteps";
import { createOrder } from "../../services/api";
import { useCartStore, CartStore } from "../../state/store";
import { useAuthStore } from "../../state/store";
import { OrderData } from "../../../../backend/interfaces";

export const PlaceOrderScreen: FC = () => {
  const navigate = useNavigate();
  const { cartItems, shipping, paymentMethod, deleteCartItems } =
    useCartStore() as CartStore;
  const { userInfo } = useAuthStore();
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const itemsPrice = cartItems.reduce(
    (acc: number, item: { product: { price: number }; qty: number }) => {
      return acc + item.product.price * item.qty;
    },
    0
  );
  const shippingPrice = itemsPrice > 100 ? 0 : 10;
  const taxPrice = Number((0.15 * itemsPrice).toFixed(2));
  const totalPrice: number = itemsPrice + shippingPrice + taxPrice;

  useEffect(() => {
    if (!shipping.address) {
      navigate("/shipping");
    } else if (!paymentMethod) {
      navigate("/payment");
    }
  }, [paymentMethod, shipping.address, navigate]);

  const placeOrderHandler = async () => {
    setLoading(true);
    try {
      if (userInfo && userInfo.id) {
        const order: OrderData = {
          userId: userInfo.id,
          cart: cartItems,
          shipping: {
            address: shipping.address,
            postalCode: shipping.city,
            city: shipping.postalCode,
          },
          paymentMethod: paymentMethod,
          price: {
            itemsPrice,
            taxPrice,
            shippingPrice,
            totalPrice,
          },
        };
        const res = await createOrder(order);
        deleteCartItems();
        navigate(`/orders/${res.id}`);
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <CheckoutSteps step1 step2 step3 step4 />

      <h1 className="mb-2 mt-2 text-center  text-3xl font-bold text-custom-blue-dark">
        Place Order
      </h1>
      {loading && <Loader />}
      {error && <Message variant="danger">{error}</Message>}
      <div className="-mx-2 flex flex-wrap">
        <div className="mb-4 w-full px-2 md:w-2/3">
          <div className="rounded-lg bg-white p-4 shadow-md">
            <h2 className="mb-2 text-2xl font-bold">Shipping</h2>
            <p>
              <strong>Address:</strong>
              {shipping.address}, {shipping.city} {shipping.postalCode}
            </p>

            <h2 className="mb-2 mt-4 text-2xl font-bold">Payment Method</h2>
            <strong>Method: </strong>
            {paymentMethod}

            <h2 className="mb-2 mt-4 text-2xl font-bold">Order Items</h2>
            {cartItems.length === 0 ? (
              <Message>Your cart is empty</Message>
            ) : (
              <div>
                {cartItems.map((item: any, index: number) => (
                  <div key={index}>
                    <div className="mb-2 flex items-center">
                      <div className="w-20 flex-none">
                        <img
                          src={item.product.image}
                          alt={item.product.name}
                          className="rounded-lg"
                        />
                      </div>
                      <div className="ml-4 flex-1">
                        <Link to={`/products/${item.product.id}`}>
                          {item.product.name}
                        </Link>
                      </div>
                      <div className="ml-auto">
                        {item.qty} x ${item.product.price} = $
                        {item.qty * item.product.price}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="mb-4 w-full px-2 md:w-1/3">
          <div className="rounded-lg bg-white p-4 shadow-md">
            <h2 className="mb-2 text-2xl font-bold">Order Summary</h2>
            <div>
              <div className="flex justify-between">
                <div>Items</div>
                <div>${itemsPrice}</div>
              </div>
              <div className="flex justify-between">
                <div>Shipping</div>
                <div>${shippingPrice}</div>
              </div>
              <div className="flex justify-between">
                <div>Tax</div>
                <div>${taxPrice}</div>
              </div>
              <div className="flex justify-between">
                <div>Total</div>
                <div>${totalPrice}</div>
              </div>
              <button
                type="button"
                className="mt-4 w-full rounded bg-custom-green-light py-2 text-white hover:bg-custom-green-dark"
                onClick={placeOrderHandler}
                disabled={cartItems.length === 0}
              >
                Place Order
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
