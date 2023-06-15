// frontend\src\screens\user\ProfileScreen.tsx

import React, { useEffect, useState, FormEvent } from "react";
import { toast } from "react-toastify";
import Loader from "../../components/common/Loader";
import { updateUserProfileApi } from "../../services/api"; // Import the api functions
import { useAuthStore } from "../../state/store";
import Message from "../../components/common/Message";
export const ProfileScreen: React.FC = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { userInformation, setUserInformation } = useAuthStore();

  useEffect(() => {
    if (!userInformation) return;

    setName(userInformation.name);
    setEmail(userInformation.email);
  }, [userInformation]);

  const submitHandler = async (e: FormEvent) => {
    e.preventDefault();
    if (!userInformation) {
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
      const res = await updateUserProfileApi({
        id: userInformation.id,
        name,
        email,
        password,
        isAdmin: userInformation.isAdmin || false,
      });
      setUserInformation({ ...res });
      toast.success("Profile updated successfully");
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
  };

  return (
    <div className="container mx-auto px-4">
      <div className="mx-auto w-full px-2 md:w-1/3">
        <h2 className="mb-4 text-2xl font-bold">User Profile</h2>
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
    </div>
  );
};
