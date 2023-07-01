// frontend\src\screens\admin\user\UserListScreen.tsx

import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FaTrash, FaEdit, FaCheck, FaTimes } from "react-icons/fa";
import { Loader } from "../../../components/common/Loader";
import { toast } from "react-toastify";
import { deleteUser, readAllUsers } from "../../../services/api";
import { useAuthStore } from "../../../state/store";
import { UserAuth } from "../../../../../backend/interfaces";
import { User } from "@prisma/client";
import { Message } from "../../../components/common/Message";

export const UserListScreen: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { userInfo } = useAuthStore() as UserAuth;

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        const data = await readAllUsers();
        setUsers(data);
      } catch (err: unknown) {
        if (err instanceof Error) {
          toast.error(err.message);
          setError(err.message);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const deleteHandler = async (id: number) => {
    if (window.confirm("Are you sure")) {
      try {
        await deleteUser(id);
        setUsers(users.filter((user) => user.id !== id));
        toast.success("User deleted successfully");
      } catch (err: unknown) {
        if (err instanceof Error) {
          toast.error(err.message);
        }
      }
    }
  };

  return (
    <>
      <h1 className="mb-2 mt-2 text-center  text-3xl font-bold text-custom-blue-dark">
        Users
      </h1>
      {loading && <Loader />}
      {error && <Message variant="danger">{error}</Message>}
      <table className="min-w-full divide-y divide-custom-blue-dark">
        <thead className="bg-custom-blue-lightest">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-custom-blue-dark">
              ID
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-custom-blue-dark">
              NAME
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-custom-blue-dark">
              EMAIL
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-custom-blue-dark">
              ADMIN
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-custom-blue-dark"></th>
          </tr>
        </thead>
        <tbody className="divide-y divide-custom-blue-light ">
          {users.map((user) => (
            <tr key={user.id}>
              <td className="whitespace-nowrap px-6 py-4 text-custom-blue-darkest">
                {user.id}
              </td>
              <td className="whitespace-nowrap px-6 py-4 text-custom-blue-darkest">
                {user.name}
              </td>
              <td className="whitespace-nowrap px-6 py-4">
                <a
                  href={`mailto:${user.email}`}
                  className="text-custom-blue-dark hover:text-custom-blue-darker"
                >
                  {user.email}
                </a>
              </td>
              <td className="whitespace-nowrap px-6 py-4">
                {user.isAdmin ? (
                  <FaCheck className="text-custom-green-light" />
                ) : (
                  <FaTimes className="text-custom-red-light " />
                )}
              </td>
              <td>
                {userInfo && userInfo.isAdmin && (
                  <>
                    <Link
                      to={`/admin/users/${user.id}/edit`}
                      className="mr-2 inline-flex items-center rounded bg-custom-blue-darker px-2 py-1 text-white hover:bg-custom-blue-darkest"
                    >
                      <FaEdit size={18} className="mr-1" />
                      Edit
                    </Link>
                    <button
                      className="inline-flex items-center rounded bg-custom-red-light px-2 py-1 text-white hover:bg-custom-red-dark"
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
    </>
  );
};
