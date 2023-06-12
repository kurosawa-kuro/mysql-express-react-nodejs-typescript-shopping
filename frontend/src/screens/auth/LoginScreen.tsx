// src/screens/auth/LoginScreen.tsx

// External Imports
import { FormEvent, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

// Internal Imports
import FormContainer from "../../components/forms/FormContainer";
import Loader from "../../components/common/Loader";
import { loginUserApi } from "../../services/api";
import { useAuthStore } from "../../state/store";
import { LoginUserCredentials, UserInfo } from "../../interfaces";

const LoginScreen = () => {
  const [credentials, setCredentials] = useState<LoginUserCredentials>({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const setUserInfo = useAuthStore((state) => state.setUserInfo);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const submitHandler = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const user: UserInfo = await loginUserApi(credentials);
      setUserInfo(user);
      toast.success("Successfully logged in");
      navigate("/");
    } catch (error) {
      toast.error("Failed to log in");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <Loader />;
  }

  const fields = ["email", "password"] as const;

  return (
    <FormContainer>
      <h1 className="mb-6 text-3xl font-bold text-custom-blue-dark">Log in</h1>
      <form onSubmit={submitHandler}>
        {fields.map((field, index) => (
          <div className="mb-4" key={index}>
            <label className="block text-sm font-medium text-custom-blue-dark">
              {field}
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
          data-testid="login"
          type="submit"
          className="w-full rounded-md border border-transparent bg-custom-blue-dark px-4 py-2 text-base font-medium text-white hover:bg-custom-blue-darkest focus:outline-none focus:ring-2 focus:ring-custom-blue-darker focus:ring-offset-2 md:w-1/2 lg:w-1/3"
        >
          Log in
        </button>
      </form>
      <div className="py-3">
        <div>
          New Customer?{" "}
          <Link
            to={"/register"}
            className="text-custom-blue-dark underline hover:text-custom-blue-darker"
          >
            Register
          </Link>
        </div>
      </div>
    </FormContainer>
  );
};

export default LoginScreen;