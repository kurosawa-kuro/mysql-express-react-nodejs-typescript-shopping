// frontend\src\screens\user\ProfileScreen.tsx

import React, { useEffect, useState, FormEvent } from "react";
import { toast } from "react-toastify";
import { Loader } from "../../components/common/Loader";
import { updateUserProfile } from "../../services/api"; // Import the api functions
import { useAuthStore } from "../../state/store";
import { Message } from "../../components/common/Message";

export const ProfileScreen: React.FC = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { userInfo, setUserInfo } = useAuthStore();

  useEffect(() => {
    if (userInfo && userInfo.name && userInfo.email) {
      setName(userInfo.name);
      setEmail(userInfo.email);
    }
  }, [userInfo]);

  const submitHandler = async (e: FormEvent) => {
    e.preventDefault();
    if (!userInfo) {
      toast.error("User info is not available");
      setError("User info is not available");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      setError("Passwords do not match");
      return;
    }

    setLoading(true);
    try {
      const res = await updateUserProfile({
        id: userInfo.id,
        name,
        email,
        password,
        isAdmin: userInfo.isAdmin || false,
      });
      setUserInfo({ ...res });
      toast.success("Profile updated successfully");
    } catch (err: unknown) {
      if (err instanceof Error) {
        toast.error(err.message);
        setError(err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="mx-auto w-full px-2 md:w-1/3">
        <h1 className="mb-2 mt-2 text-center  text-3xl font-bold text-custom-blue-dark">
          User Profile
        </h1>
        {loading && <Loader />}
        {error && <Message variant="danger">{error}</Message>}
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
          </div>
        </form>
      </div>
    </>
  );
};
