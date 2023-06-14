import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FaTrash, FaEdit, FaCheck, FaTimes } from "react-icons/fa";
import Loader from "../../../components/common/Loader";
import { toast } from "react-toastify";
import { deleteUserApi, getUsersApi } from "../../../services/api";
import { useAuthStore } from "../../../state/store";
import { FullUser, UserAuthStore } from "../../../interfaces/index";

export const UserListScreen: React.FC = () => {
  const [users, setUsers] = useState<FullUser[]>([]);
  const [loading, setLoading] = useState(false);
  const { userInfo } = useAuthStore() as UserAuthStore;

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        const data = await getUsersApi();
        setUsers(data);
      } catch (err) {
        // toast.error(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const deleteHandler = async (id: number) => {
    if (window.confirm("Are you sure")) {
      try {
        await deleteUserApi(id);
        setUsers(users.filter((user) => user.id !== id));
        toast.success("User deleted successfully");
      } catch (err) {
        // toast.error(err.message);
      }
    }
  };

  return (
    <>
      <h1 className="mb-4 text-3xl font-bold">Users</h1>
      {loading ? (
        <Loader />
      ) : (
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                ID
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                NAME
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                EMAIL
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                ADMIN
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            {users.map((user) => (
              <tr key={user.id}>
                <td className="whitespace-nowrap px-6 py-4">{user.id}</td>
                <td className="whitespace-nowrap px-6 py-4">{user.name}</td>
                <td className="whitespace-nowrap px-6 py-4">
                  <a
                    href={`mailto:${user.email}`}
                    className="text-indigo-600 hover:text-indigo-900"
                  >
                    {user.email}
                  </a>
                </td>
                <td className="whitespace-nowrap px-6 py-4">
                  {user.isAdmin ? (
                    <FaCheck className="text-green-500" />
                  ) : (
                    <FaTimes className="text-red-500" />
                  )}
                </td>
                <td>
                  {userInfo && userInfo.isAdmin && (
                    <>
                      <Link
                        to={`/admin/users/${user.id}/edit`}
                        className="mr-2 inline-flex items-center rounded bg-gray-200 px-4 py-2 font-bold text-gray-800 hover:bg-gray-300"
                      >
                        <FaEdit size={18} className="mr-1" />
                        Edit
                      </Link>
                      <button
                        className="inline-flex items-center rounded bg-red-600 px-2 py-1 text-white hover:bg-red-700"
                        onClick={() => deleteHandler(user.id)}
                      >
                        <FaTrash size={18} className="mr-1" />
                        Delete
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </>
  );
};
