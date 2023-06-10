// frontend\src\screens\auth\RegisterScreen.jsx

import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import Loader from '../../components/common/Loader';
import FormContainer from '../../components/forms/FormContainer';
import { registerUserApi } from '../../services/api';
import { useAuthStore } from '../../state/store';

const RegisterScreen = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { search } = useLocation();
  const searchParams = new URLSearchParams(search);
  const redirect = searchParams.get('redirect') || '/';
  const { userInfo, setCredentials } = useAuthStore();

  useEffect(() => {
    if (userInfo) {
      navigate(redirect);
    }
  }, [navigate, redirect, userInfo]);

  const submitHandler = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
    } else {
      setLoading(true);
      try {
        const res = await registerUserApi({ name, email, password });
        setCredentials({ ...res });
        navigate(redirect);
      } catch (err) {
        toast.error(err.message);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <FormContainer>
      <h1 className="text-3xl font-bold mb-6">Register</h1>
      <form onSubmit={submitHandler}>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Name</label>
          <input
            type='text'
            placeholder='Enter name'
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-1 block w-full shadow-sm sm:text-sm rounded-md h-10"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Email Address</label>
          <input
            type="email"
            placeholder="Enter email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1 block w-full shadow-sm sm:text-sm rounded-md h-10"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Password</label>
          <input
            type="password"
            placeholder="Enter password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-1 block w-full shadow-sm sm:text-sm rounded-md h-10"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Confirm Password</label>
          <input
            type="password"
            placeholder="Confirm password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="mt-1 block w-full shadow-sm sm:text-sm rounded-md h-10"
          />
        </div>
        <button disabled={loading} type="submit" className="w-full py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
          Register
        </button>
        {loading && <Loader />}
      </form>
      <div className="py-3">
        <div>
          Already have an account?{' '}
          <Link to={redirect ? `/login?redirect=${redirect}` : '/login'} className="text-indigo-600 hover:text-indigo-500">
            Login
          </Link>
        </div>
      </div>
    </FormContainer >
  );
};

export default RegisterScreen;
