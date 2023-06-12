import { useState, useEffect, FC } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Loader from "../../components/common/Loader";
import Message from "../../components/common/Message";
import { CheckoutSteps } from "../../components/layout/CheckoutSteps";
import { createOrderApi } from "../../services/api";
import { useCartStore, CartStore } from "../../state/store";
import { Order } from "../../interfaces";

export const PlaceOrderScreen: FC = () => {
  const navigate = useNavigate();
  const { cartItems, shippingAddress, paymentMethod, clearCartItems } =
    useCartStore() as CartStore;

  const itemsPrice = cartItems.reduce(
    (acc, item) => acc + item.price * item.qty,
    0
  );
  const shippingPrice = itemsPrice > 100 ? 0 : 10;
  const taxPrice = Number((0.15 * itemsPrice).toFixed(2));
  const totalPrice = (
    Number(itemsPrice) +
    Number(shippingPrice) +
    Number(taxPrice)
  ).toFixed(2);

  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!shippingAddress.address) {
      navigate("/shipping");
    } else if (!paymentMethod) {
      navigate("/payment");
    }
  }, [paymentMethod, shippingAddress.address, navigate]);

  const placeOrderHandler = async () => {
    try {
      setLoading(true);
      const order: Order = {
        orderItems: cartItems,
        shippingAddress: {
          address: shippingAddress.address,
          postalCode: shippingAddress.city,
          city: shippingAddress.postalCode,
        },
        paymentMethod: paymentMethod,
        itemsPrice: itemsPrice,
        shippingPrice: shippingPrice,
        taxPrice: taxPrice,
        totalPrice: Number(totalPrice),
      };
      const res = await createOrderApi(order);
      clearCartItems();
      setLoading(false);
      navigate(`/order/${res.id}`); // Assuming res is of type Order and Order has a property _id
    } catch (err) {
      setLoading(false);
      setError("An error occurred. Please try again.");
      toast.error("An error occurred. Please try again.");
    }
  };

  return (
    <div className="container mx-auto px-4">
      <CheckoutSteps step1 step2 step3 step4 />
      <div className="-mx-2 flex flex-wrap">
        <div className="mb-4 w-full px-2 md:w-2/3">
          <div className="rounded-lg bg-white p-4 shadow-md">
            <h2 className="mb-2 text-2xl font-bold">Shipping</h2>
            <p>
              <strong>Address:</strong>
              {shippingAddress.address}, {shippingAddress.city}{" "}
              {shippingAddress.postalCode}
            </p>

            <h2 className="mb-2 mt-4 text-2xl font-bold">Payment Method</h2>
            <strong>Method: </strong>
            {paymentMethod}

            <h2 className="mb-2 mt-4 text-2xl font-bold">Order Items</h2>
            {cartItems.length === 0 ? (
              <Message>Your cart is empty</Message>
            ) : (
              <div>
                {cartItems.map((item, index) => (
                  <div key={index}>
                    <div className="flex items-center">
                      <div className="w-20 flex-none">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="rounded-lg"
                        />
                      </div>
                      <div className="ml-4 flex-1">
                        {/* <Link to={`/product/${item.product}`}>{item.name}</Link> */}
                      </div>
                      <div className="ml-auto">
                        {item.qty} x ${item.price} = ${item.qty * item.price}
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
              <div>
                {loading && <Loader />}
                {error && <Message variant="danger">{error}</Message>}
              </div>
              <button
                type="button"
                className="mt-4 w-full rounded bg-black py-2 text-white"
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
