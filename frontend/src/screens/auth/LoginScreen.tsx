// frontend\src\screens\auth\LoginScreen.tsx

// External Imports
import { FormEvent, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

// Internal Imports
import { FormContainer } from "../../components/layout/FormContainer";
import { Loader } from "../../components/common/Loader";
import { loginUser } from "../../services/api";
import { useAuthStore } from "../../state/store";
import { UserAuth, UserInfo } from "../../../../backend/interfaces";

export const LoginScreen = () => {
  const [credentials, setCredentials] = useState<UserInfo>({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const setUserInfo = useAuthStore((state: UserAuth) => state.setUserInfo);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const submitHandler = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const user: UserInfo = await loginUser(credentials);
      setUserInfo(user);
      toast.success("Successfully logged in");
      navigate("/");
    } catch (err: unknown) {
      if (err instanceof Error) {
        toast.error(err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const fields = ["email", "password"] as const;

  return (
    <FormContainer>
      <h1 className="mb-2 mt-2 text-center  text-3xl font-bold text-custom-blue-dark">
        Log in
      </h1>
      {loading && <Loader />}
      <form onSubmit={submitHandler}>
        {fields.map((field, index) => (
          <div className="mb-4" key={index}>
            <label
              className="block text-sm font-medium text-custom-blue-dark"
              htmlFor={field}
            >
              {field}
            </label>
            <input
              id={field}
              data-testid={field}
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
