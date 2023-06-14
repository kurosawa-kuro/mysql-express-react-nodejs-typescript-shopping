// frontend\src\screens\user\ProfileScreen.tsx

import React, { useEffect, useState, ChangeEvent, FormEvent } from "react";
import { Link } from "react-router-dom";
import { FaTimes } from "react-icons/fa";
import { toast } from "react-toastify";
import Message from "../../components/common/Message";
import Loader from "../../components/common/Loader";
import { updateUserProfileApi, getMyOrdersApi } from "../../services/api"; // Import the api functions
import { useAuthStore } from "../../state/store";
import { UserInfo, Order, ErrorMessage } from "../../interfaces";

export const ProfileScreen = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(false);
  const [error, setError] = useState<ErrorMessage | null>(null);

  const { userInfo, setUserInfo } = useAuthStore();

  useEffect(() => {
    if (!userInfo) return;

    setName(userInfo.name);
    setEmail(userInfo.email);

    const fetchOrders = async () => {
      setLoadingOrders(true);
      try {
        const data = await getMyOrdersApi();
        setOrders(data);
      } catch (err: any) {
        setError({ message: err.message });
      } finally {
        setLoadingOrders(false);
      }
    };

    fetchOrders();
  }, [userInfo]);

  const submitHandler = async (e: FormEvent) => {
    e.preventDefault();
    if (!userInfo) {
      toast.error("User info is not available");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    setLoading(true);
    try {
      const res = await updateUserProfileApi({
        id: userInfo.id,
        name,
        email,
        password,
        isAdmin: userInfo.isAdmin || false,
      });
      setUserInfo({ ...res });
      toast.success("Profile updated successfully");
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4">
      <div className="-mx-2 flex flex-wrap">
        <div className="w-full px-2 md:w-1/3">
          <h2 className="mb-4 text-2xl font-bold">User Profile</h2>
          <form
            onSubmit={submitHandler}
            className="mb-4 rounded bg-white px-8 pb-8 pt-6 shadow-md"
          >
            <div className="mb-4">
              <label
                className="mb-2 block text-sm font-bold text-gray-700"
                htmlFor="name"
              >
                Name
              </label>
              <input
                className="focus:shadow-outline w-full appearance-none rounded border px-3 py-2 leading-tight text-gray-700 shadow focus:outline-none"
                id="name"
                type="text"
                placeholder="Enter name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div className="mb-4">
              <label
                className="mb-2 block text-sm font-bold text-gray-700"
                htmlFor="email"
              >
                Email Address
              </label>
              <input
                className="focus:shadow-outline w-full appearance-none rounded border px-3 py-2 leading-tight text-gray-700 shadow focus:outline-none"
                id="email"
                type="email"
                placeholder="Enter email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="mb-4">
              <label
                className="mb-2 block text-sm font-bold text-gray-700"
                htmlFor="password"
              >
                Password
              </label>
              <input
                className="focus:shadow-outline w-full appearance-none rounded border px-3 py-2 leading-tight text-gray-700 shadow focus:outline-none"
                id="password"
                type="password"
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <div className="mb-4">
              <label
                className="mb-2 block text-sm font-bold text-gray-700"
                htmlFor="confirmPassword"
              >
                Confirm Password
              </label>
              <input
                className="focus:shadow-outline w-full appearance-none rounded border px-3 py-2 leading-tight text-gray-700 shadow focus:outline-none"
                id="confirmPassword"
                type="password"
                placeholder="Confirm password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>

            <div className="flex items-center justify-between">
              <button
                className="focus:shadow-outline rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700 focus:outline-none"
                type="submit"
              >
                Update
              </button>
              {loading && <Loader />}
            </div>
          </form>
        </div>
        <div className="w-full px-2 md:w-2/3">
          <h2 className="mb-4 text-2xl font-bold">My Orders</h2>
          {loadingOrders ? (
            <Loader />
          ) : error ? (
            <Message variant="danger">
              {/* {error?.data?.message || error.error} */}
            </Message>
          ) : (
            <div className="mb-4 overflow-x-auto rounded bg-white px-8 pb-8 pt-6 shadow-md">
              <table className="min-w-full leading-normal">
                <thead className="">
                  <tr>
                    <th>ID</th>
                    <th>DATE</th>
                    <th>TOTAL</th>
                    <th>PAID</th>
                    <th>DELIVERED</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order) => (
                    <tr
                      key={order.id}
                      style={{ height: "45px", padding: "5px 0" }}
                    >
                      <td>{order.id}</td>
                      <td>
                        {order.createdAt
                          ? order.createdAt.substring(0, 10)
                          : ""}
                      </td>
                      <td>{order.totalPrice}</td>
                      <td>
                        {order.isPaid ? (
                          order.paidAt ? (
                            order.paidAt.substring(0, 10)
                          ) : (
                            ""
                          )
                        ) : (
                          <FaTimes style={{ color: "red" }} />
                        )}
                      </td>
                      <td
                        style={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        {order.isDelivered ? (
                          order.deliveredAt ? (
                            order.deliveredAt.substring(0, 10)
                          ) : (
                            ""
                          )
                        ) : (
                          <FaTimes style={{ color: "red" }} />
                        )}
                      </td>
                      <td>
                        <Link
                          to={`/order/${order.id}`}
                          className="rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700"
                        >
                          Details
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
