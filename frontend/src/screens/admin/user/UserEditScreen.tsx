// frontend\src\screens\admin\user\UserEditScreen.tsx

import React, { useEffect, useState, FormEvent } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { FullUser } from "../../../interfaces/index";
import Loader from "../../../components/common/Loader";
import { toast } from "react-toastify";
import { getUserDetailsApi, updateUserApi } from "../../../services/api"; // Import the api functions

export const UserEditScreen: React.FC = () => {
  const { id } = useParams();
  const userId = Number(id);
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      setLoading(true);
      try {
        const user: FullUser = await getUserDetailsApi(userId);
        setName(user.name);
        setEmail(user.email);
        setIsAdmin(user.isAdmin);
      } catch (err: any) {
        toast.error(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [userId]);

  const submitHandler = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await updateUserApi({ id: userId, name, email, isAdmin });
      toast.success("User updated successfully");
      navigate("/admin/user-list");
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Link
        to="/admin/user-list"
        className="my-3 inline-flex items-center rounded bg-gray-200 px-4 py-2 font-bold text-gray-800 hover:bg-gray-300"
      >
        Go Back
      </Link>
      <div className="mx-auto w-full max-w-xs">
        <h1 className="mb-3 text-2xl font-bold">Edit User</h1>
        {loading ? (
          <Loader />
        ) : (
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
                htmlFor="isadmin"
              >
                Is Admin
              </label>
              <input
                className="mr-2 leading-tight"
                type="checkbox"
                id="isadmin"
                checked={isAdmin}
                onChange={(e) => setIsAdmin(e.target.checked)}
              />
              <span className="text-sm">
                Check if the user is an administrator
              </span>
            </div>

            <div className="flex items-center justify-between">
              <button
                className="focus:shadow-outline rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700 focus:outline-none"
                type="submit"
              >
                Update
              </button>
            </div>
          </form>
        )}
      </div>
    </>
  );
};