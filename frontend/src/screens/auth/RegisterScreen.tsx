// frontend\src\screens\auth\RegisterScreen.tsx

import { FormEvent, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import FormContainer from "../../components/forms/FormContainer";
import Loader from "../../components/common/Loader";
import { registerUserApi } from "../../services/api";
import { useAuthStore } from "../../state/store";
import { UserInfo, RegisterUserCredentials } from "../../interfaces";

export const RegisterScreen = () => {
  const [credentials, setCredentials] = useState<RegisterUserCredentials>({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState<boolean>(false);
  const navigate = useNavigate();

  const setUserInfo = useAuthStore((state) => state.setUserInfo);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const submitHandler = async (e: FormEvent) => {
    e.preventDefault();
    if (credentials.password !== credentials.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    setLoading(true);
    try {
      const user: UserInfo = await registerUserApi({
        name: credentials.name,
        email: credentials.email,
        password: credentials.password,
      });
      setUserInfo(user);
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

  const fields = ["name", "email", "password", "confirmPassword"] as const;

  return (
    <FormContainer>
      <h1 className="mb-6 text-3xl font-bold text-custom-blue-dark">
        Register
      </h1>
      <form onSubmit={submitHandler}>
        {fields.map((field, index) => (
          <div className="mb-4" key={index}>
            <label className="block text-sm font-medium text-custom-blue-dark">
              {field === "confirmPassword"
                ? "Confirm Password"
                : field.charAt(0).toUpperCase() + field.slice(1)}
            </label>
            <input
              name={field}
              type={field}
              placeholder={`Enter ${field}`}
              value={credentials[field]}
              onChange={handleChange}
              className="mt-1 block h-10 w-full rounded-md border-custom-blue-dark px-2 shadow-sm focus:border-custom-blue-darker"
            />
          </div>
        ))}
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
