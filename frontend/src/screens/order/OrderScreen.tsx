// frontend\src\screens\order\OrderScreen.tsx

import { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { toast } from "react-toastify";

import { useAuthStore } from "../../state/store";
import Message from "../../components/common/Message";
import Loader from "../../components/common/Loader";
import {
  getOrderDetailsApi,
  payOrderApi,
  deliverOrderApi,
} from "../../services/api";
import { Order } from "../../interfaces";

export const OrderScreen = () => {
  const { id: orderId } = useParams();
  const { userInfo } = useAuthStore();

  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const orderIdNumber = Number(orderId); // orderIdを数値に変換します。

  const fetchOrder = async () => {
    console.log("check");
    if (!isNaN(orderIdNumber)) {
      // orderIdが数値であることを確認します。
      try {
        setLoading(true);
        const data: Order = await getOrderDetailsApi(orderIdNumber);
        setOrder(data);
      } catch (err: unknown) {
        if (err instanceof Error) {
          toast.error(err.message);
          setError(err.message);
        } else {
          toast.error("An error occurred.");
          setError("An error occurred.");
        }
      } finally {
        setLoading(false);
      }
    } else {
      //   setError("Invalid order ID");
    }
  };

  const onApproveTest = async () => {
    try {
      setLoading(true);
      await payOrderApi(orderIdNumber, { payer: {} });
      toast.success("Order is paid");
      fetchOrder();
    } catch (err: unknown) {
      if (err instanceof Error) {
        toast.error(err.message);
      } else {
        toast.error("An error occurred.");
      }
    } finally {
      setLoading(false);
    }
  };

  const deliverHandler = async () => {
    if (!isNaN(orderIdNumber)) {
      try {
        setLoading(true);
        await deliverOrderApi(orderIdNumber);
        fetchOrder();
      } catch (err: unknown) {
        if (err instanceof Error) {
          toast.error(err.message);
        } else {
          toast.error("An error occurred.");
        }
      } finally {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    fetchOrder();
  }, [orderId]);

  if (!order) {
    return null;
  }

  if (loading) {
    return <Loader />;
  }

  if (error) {
    return <Message>{error}</Message>;
  }

  return (
    <div className="py-6">
      <h1 className="mb-6 text-3xl font-bold">Order {order.id}</h1>
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
                {order.address}, {order.city} {order.postalCode}
              </p>
              {order.isDelivered ? (
                <Message variant="success">
                  Delivered on {order.deliveredAt}
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
              {order.isPaid ? (
                <Message variant="success">Paid on {order.paidAt}</Message>
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
                        src={item.image}
                        alt={item.name}
                      />
                    </div>
                    <div className="w-3/5 px-4">
                      <Link to={`/products/${item.id}`}>{item.name}</Link>
                    </div>
                    <div className="w-1/5 text-right">
                      {item.qty} x ${item.price} = ${item.qty * item.price}
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
              <span>${order.itemsPrice}</span>
            </div>

            {/* Shipping */}
            <div className="mb-4 flex items-center justify-between">
              <span>Shipping</span>
              <span>${order.shippingPrice}</span>
            </div>

            {/* Tax */}
            <div className="mb-4 flex items-center justify-between">
              <span>Tax</span>
              <span>${order.taxPrice}</span>
            </div>

            {/* Total */}
            <div className="mb-6 flex items-center justify-between">
              <span>Total</span>
              <span>${order.totalPrice}</span>
            </div>

            {/* Payment and Delivery */}
            {!order.isPaid && (
              <div className="mb-4">
                {loading && <Loader />}
                {!userInfo ? (
                  <Message>
                    Please <Link to="/login">sign in</Link> to pay
                  </Message>
                ) : (
                  <button
                    onClick={onApproveTest}
                    className="w-full rounded-lg bg-blue-500 px-4 py-2 font-semibold text-white shadow-md hover:bg-blue-700 focus:outline-none"
                    type="button"
                    disabled={order.orderProducts.length === 0}
                  >
                    Test Pay
                  </button>
                )}
              </div>
            )}

            {loading && <Loader />}
            {userInfo &&
              userInfo.isAdmin &&
              order.isPaid &&
              !order.isDelivered && (
                <button
                  type="button"
                  className="w-full rounded-lg bg-green-500 px-4 py-2 font-semibold text-white shadow-md hover:bg-green-700 focus:outline-none"
                  onClick={deliverHandler}
                >
                  Mark As Delivered
                </button>
              )}
          </div>
        </div>
      </div>
    </div>
  );
};
