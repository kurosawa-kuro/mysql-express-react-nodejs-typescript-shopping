// frontend\src\screens\admin\order\OrderListScreen.tsx

import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FaTimes } from "react-icons/fa";
import { OrderInfo, UserAuth } from "../../../../../backend/interfaces";
import { readMyOrders, readAllOrders } from "../../../services/api";
import { useAuthStore } from "../../../state/store";
import { Loader } from "../../../components/common/Loader";
import { Message } from "../../../components/common/Message";

export const OrderListScreen: React.FC = () => {
  const { userInfo } = useAuthStore() as UserAuth;
  const [orders, setOrders] = useState<OrderInfo[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const data = userInfo?.isAdmin
          ? await readAllOrders()
          : await readMyOrders();
        setOrders(data);
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : "An error occurred.");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [userInfo?.isAdmin]);

  return (
    <>
      <h1 className="mb-4 text-2xl font-semibold">Orders</h1>
      {loading && <Loader />}
      {error && <Message variant="danger">{error}</Message>}
      <div className="overflow-x-auto">
        <table className="w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                ID
              </th>

              {userInfo?.isAdmin && (
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  USER
                </th>
              )}

              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                DATE
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                TOTAL
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                PAID
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                DELIVERED
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            {orders &&
              orders.map((order: OrderInfo) => (
                <tr key={order.id}>
                  <td className="whitespace-nowrap px-6 py-4">{order.id}</td>
                  {userInfo?.isAdmin && (
                    <td className="whitespace-nowrap px-6 py-4">
                      {order.user && order.user.name}
                    </td>
                  )}
                  <td className="whitespace-nowrap px-6 py-4">
                    {new Date(order.createdAt || "")
                      .toISOString()
                      .substring(0, 10)}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4">
                    ${order.price.totalPrice}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4">
                    {order.status.isPaid ? (
                      new Date(order.status.paidAt || "")
                        .toISOString()
                        .substring(0, 10)
                    ) : (
                      <FaTimes className="text-red-500" />
                    )}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4">
                    {order.status.isDelivered ? (
                      new Date(order.status.deliveredAt || "")
                        .toISOString()
                        .substring(0, 10)
                    ) : (
                      <FaTimes className="text-red-500" />
                    )}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-right text-sm font-medium">
                    <Link
                      to={`/orders/${order.id}`}
                      className="text-indigo-600 hover:text-indigo-900"
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
