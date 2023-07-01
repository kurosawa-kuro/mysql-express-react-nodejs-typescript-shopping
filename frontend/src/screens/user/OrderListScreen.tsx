// frontend\src\screens\admin\order\OrderListScreen.tsx

import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FaTimes } from "react-icons/fa";
import { Message } from "../../components/common/Message";
import { Loader } from "../../components/common/Loader";
import { readAllOrders } from "../../services/api";
import { OrderInfo } from "../../../../backend/interfaces";
import { toast } from "react-toastify";

export const OrderListScreen: React.FC = () => {
  const [orders, setOrders] = useState<OrderInfo[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrders = async () => {
      console.log("hit fetchOrders");
      try {
        const data = await readAllOrders();
        console.log("fetchOrders data", data);
        setOrders(data);
        setLoading(false);
      } catch (err: unknown) {
        if (err instanceof Error) {
          toast.error(err.message);
          setError(err.message);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  return (
    <>
      <h1 className="mb-2 mt-2 text-center  text-3xl font-bold text-custom-blue-dark">
        Orders
      </h1>
      {loading && <Loader />}
      {error && <Message variant="danger">{error}</Message>}
      <div className="overflow-x-auto">
        <table className="w-full divide-y divide-custom-blue-light">
          <thead className="bg-custom-blue-lightest">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-custom-blue-darker">
                ID
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-custom-blue-darker">
                USER
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-custom-blue-darker">
                DATE
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-custom-blue-darker">
                TOTAL
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-custom-blue-darker">
                PAID
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-custom-blue-darker">
                DELIVERED
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-custom-blue-darker"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-custom-blue-light bg-custom-blue-lightest">
            {orders &&
              orders.map((order: OrderInfo) => (
                <tr key={order.id}>
                  <td className="whitespace-nowrap px-6 py-4 text-custom-blue-dark">
                    {order.id}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-custom-blue-dark">
                    {order.user && order.user.name}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-custom-blue-dark">
                    {order.createdAt?.toISOString().substring(0, 10)}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-custom-blue-dark">
                    ${order.price.totalPrice.toFixed(2)}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-custom-blue-dark">
                    {order.status.isPaid ? (
                      order.status.paidAt?.toISOString().substring(0, 10)
                    ) : (
                      <FaTimes className="text-custom-red-dark" />
                    )}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-custom-blue-dark">
                    {order.status.isDelivered ? (
                      order.status.deliveredAt?.toISOString().substring(0, 10)
                    ) : (
                      <FaTimes className="text-custom-red-dark" />
                    )}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-right text-sm font-medium">
                    <Link
                      to={`/orders/${order.id}`}
                      className="text-custom-blue-dark hover:text-custom-blue-darker"
                    >
                      Details
                    </Link>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </>
  );
};
