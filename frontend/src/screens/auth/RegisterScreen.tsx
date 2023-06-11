// frontend\src\screens\auth\RegisterScreen.tsx

import { useState, ChangeEvent, FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import FormContainer from "../../components/forms/FormContainer";
import Loader from "../../components/common/Loader";
import { registerUserApi } from "../../services/api";
import { useAuthStore } from "../../state/store";
import { OptionalUser, UserInfo } from "../../interfaces";

const RegisterScreen = () => {
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const navigate = useNavigate();

  const setCredentials = useAuthStore((state) => state.setUserInfo);

  const submitHandler = async (e: FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    setLoading(true);
    try {
      const user: OptionalUser = {
        name: name,
        email: email,
        password: password,
        isAdmin: false,
      };
      const registeredUser: UserInfo = await registerUserApi(user);
      setCredentials(registeredUser);
      toast.success("Registration successful");
      navigate("/");
    } catch (error) {
      console.log(error);
      toast.error("Registration failed");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <FormContainer>
      <h1 className="mb-6 text-3xl font-bold text-custom-blue-dark">
        Register
      </h1>
      <form onSubmit={submitHandler}>
        <div className="mb-4">
          <label className="block text-sm font-medium text-custom-blue-dark">
            Name
          </label>
          <input
            type="text"
            placeholder="Enter name"
            value={name}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              setName(e.target.value)
            }
            className="mt-1 block h-10 w-full rounded-md border-custom-blue-dark px-2 shadow-sm focus:border-custom-blue-darker"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-custom-blue-dark">
            Email Address
          </label>
          <input
            type="email"
            placeholder="Enter email"
            value={email}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              setEmail(e.target.value)
            }
            className="mt-1 block h-10 w-full rounded-md border-custom-blue-dark px-2 shadow-sm focus:border-custom-blue-darker"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-custom-blue-dark">
            Password
          </label>
          <input
            type="password"
            placeholder="Enter password"
            value={password}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              setPassword(e.target.value)
            }
            className="mt-1 block h-10 w-full rounded-md border-custom-blue-dark px-2 shadow-sm focus:border-custom-blue-darker"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-custom-blue-dark">
            Confirm Password
          </label>
          <input
            type="password"
            placeholder="Confirm password"
            value={confirmPassword}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              setConfirmPassword(e.target.value)
            }
            className="mt-1 block h-10 w-full rounded-md border-custom-blue-dark px-2 shadow-sm focus:border-custom-blue-darker"
          />
        </div>
        <button
          type="submit"
          className="w-full rounded-md border border-transparent bg-custom-blue-dark px-4 py-2 text-base font-medium text-white hover:bg-custom-blue-darkest focus:outline-none focus:ring-2 focus:ring-custom-blue-darker focus:ring-offset-2 md:w-1/2 lg:w-1/3"
        >
          Register
        </button>
      </form>
      <div className="py-3">
        <div>
          Already have an account?{" "}
          <Link
            to={"/login"}
            className="text-custom-blue-dark underline hover:text-custom-blue-darker"
          >
            Login
          </Link>
        </div>
      </div>
    </FormContainer>
  );
};

export default RegisterScreen;
