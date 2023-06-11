// LoginScreen.tsx

import { FormEvent, useState } from "react";
import { Link } from "react-router-dom";

import FormContainer from "../../components/forms/FormContainer";

const LoginScreen = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const submitHandler = async (e: FormEvent) => {
    e.preventDefault();
  };

  return (
    <FormContainer>
      <h1 className="mb-6 text-3xl font-bold text-custom-blue-dark">Log in</h1>
      <form onSubmit={submitHandler}>
        <div className="mb-4">
          <label className="block text-sm font-medium text-custom-blue-dark">
            Email Address
          </label>
          <input
            type="email"
            placeholder="Enter email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
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
            onChange={(e) => setPassword(e.target.value)}
            className="mt-1 block h-10 w-full rounded-md border-custom-blue-dark px-2 shadow-sm focus:border-custom-blue-darker"
          />
        </div>
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
