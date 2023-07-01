// frontend\src\screens\order\OrderScreen.tsx

// External Imports
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { toast } from "react-toastify";

// Internal Imports
import {
  updateOrderToDelivered,
  readOrderById,
  updateOrderToPaid,
} from "../../services/api";
import { Loader } from "../../components/common/Loader";
import { Message } from "../../components/common/Message";
import { OrderInfo } from "../../../../backend/interfaces";
import { useAuthStore } from "../../state/store";

export const OrderScreen = () => {
  const { id: orderId } = useParams();
  const { userInfo } = useAuthStore();

  const [order, setOrder] = useState<OrderInfo | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const orderIdNumber = Number(orderId);

  const handleError = (err: unknown) => {
    if (err instanceof Error) {
      toast.error(err.message);
      setError(err.message);
    }
  };

  const fetchOrder = async () => {
    if (!isNaN(orderIdNumber)) {
      try {
        setLoading(true);
        const data: OrderInfo = await readOrderById(orderIdNumber);
        setOrder(data);
      } catch (err) {
        handleError(err);
      } finally {
        setLoading(false);
      }
    }
  };

  const onApproveTest = async () => {
    try {
      setLoading(true);
      await updateOrderToPaid(orderIdNumber, { payer: {} });
      toast.success("Order is paid");
      fetchOrder();
    } catch (err) {
      handleError(err);
    } finally {
      setLoading(false);
    }
  };

  const deliverHandler = async () => {
    try {
      setLoading(true);
      await updateOrderToDelivered(orderIdNumber);
      toast.success("Order is delivered");
      fetchOrder();
    } catch (err) {
      handleError(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrder();
  }, [orderIdNumber]);

  if (!order) {
    return null;
  }

  return (
    <>
      <h1 className="mb-2 mt-2 text-center  text-3xl font-bold text-custom-blue-dark">
        Order {order.id}
      </h1>
      {loading && <Loader />}
      {error && <Message variant="danger">{error}</Message>}
      <div className="-mx-4 flex flex-wrap">
        <div className="mb-4 w-full px-4 lg:mb-0 lg:w-2/3">
          <div className="rounded-lg bg-white p-6 shadow">
            {/* Shipping */}
            <div className="mb-4 border-b pb-6">
              <h2 className="mb-4 text-xl font-bold">Shipping</h2>
              <p className="mb-2">
                <span className="font-bold">Name:</span>{" "}
                {order.user && order.user.name ? order.user.name : ""}
              </p>
              <p className="mb-2">
                <span className="font-bold">Email:</span>{" "}
                <a
                  href={`mailto:${
                    order.user && order.user.email ? order.user.email : ""
                  }`}
                >
                  {order.user && order.user.email ? order.user.email : ""}
                </a>
              </p>
              <p>
                <span className="font-bold">Address:</span>
                {order.shipping.postalCode} {order.shipping.city}{" "}
                {order.shipping.address}
              </p>
              {order.status.isDelivered ? (
                <Message variant="success">
                  Delivered on{" "}
                  {new Date(order.status.deliveredAt || "").toDateString()}
                </Message>
              ) : (
                <Message variant="danger">Not Delivered</Message>
              )}
            </div>

            {/* Payment Method */}
            <div className="mb-4 border-b pb-6">
              <h2 className="mb-4 text-xl font-bold">Payment Method</h2>
              <p>
                <span className="font-bold">Method:</span> {order.paymentMethod}
              </p>
              {order.status.isPaid ? (
                <Message variant="success">
                  Paid on {new Date(order.status.paidAt || "").toDateString()}
                </Message>
              ) : (
                <Message variant="danger">Not Paid</Message>
              )}
            </div>

            {/* Order Items */}
            <div>
              <h2 className="mb-4 text-xl font-bold">Order Items</h2>
              {order.orderProducts && order.orderProducts.length === 0 ? (
                <Message>Order is empty</Message>
              ) : (
                order.orderProducts.map((item, index) => (
                  <div key={index} className="mb-4 flex items-center">
                    <div className="w-1/5">
                      <img
                        className="w-full rounded"
                        // src={item.product.image}
                        src={item.product.image}
                        alt={item.product.name}
                      />
                    </div>
                    <div className="w-3/5 px-4">
                      <Link to={`/products/${item.product.id}`}>
                        {item.product.name}
                      </Link>
                    </div>
                    <div className="w-1/5 text-right">
                      {item.qty} x ${item.product.price} = $
                      {item.qty * item.product.price}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
        <div className="w-full px-4 lg:w-1/3">
          <div className="rounded-lg bg-white p-6 shadow">
            <h2 className="mb-4 text-xl font-bold">Order Summary</h2>

            {/* Items */}
            <div className="mb-4 flex items-center justify-between">
              <span>Items</span>
              <span>${order.price.itemsPrice}</span>
            </div>

            {/* Shipping */}
            <div className="mb-4 flex items-center justify-between">
              <span>Shipping</span>
              <span>${order.price.shippingPrice}</span>
            </div>

            {/* Tax */}
            <div className="mb-4 flex items-center justify-between">
              <span>Tax</span>
              <span>${order.price.taxPrice}</span>
            </div>

            {/* Total */}
            <div className="mb-6 flex items-center justify-between">
              <span>Total</span>
              <span>${order.price.totalPrice}</span>
            </div>

            {/* Payment and Delivery */}
            {!order.status.isPaid && (
              <div className="mb-4">
                {loading && <Loader />}
                {!userInfo ? (
                  <Message>
                    Please <Link to="/login">Log in</Link> to pay
                  </Message>
                ) : (
                  <button
                    onClick={onApproveTest}
                    className="mt-4 w-full rounded bg-custom-green-light py-2 text-white hover:bg-custom-green-dark"
                    type="button"
                    disabled={order.orderProducts.length === 0}
                  >
                    Pay
                  </button>
                )}
              </div>
            )}

            {loading && <Loader />}
            {userInfo &&
              userInfo.isAdmin &&
              order.status.isPaid &&
              !order.status.isDelivered && (
                <button
                  type="button"
                  className="w-full rounded-lg bg-custom-green-light px-4 py-2 font-semibold text-white shadow-md hover:bg-custom-green-dark focus:outline-none"
                  onClick={deliverHandler}
                >
                  Mark As Delivered
                </button>
              )}
          </div>
        </div>
      </div>
    </>
  );
};
