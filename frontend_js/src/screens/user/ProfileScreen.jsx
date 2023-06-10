// frontend\src\screens\user\ProfileScreen.jsx

import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FaTimes } from 'react-icons/fa';
import { toast } from 'react-toastify';
import Message from '../../components/common/Message';
import Loader from '../../components/common/Loader';
import { updateUserProfileApi, getMyOrdersApi } from '../../services/api';  // Import the api functions
import { useAuthStore } from '../../state/store';

const ProfileScreen = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(false);
  const [error, setError] = useState(null);

  const { userInfo, setCredentials } = useAuthStore();

  useEffect(() => {
    if (userInfo) {
      setName(userInfo.name);
      setEmail(userInfo.email);
    }

    const fetchOrders = async () => {
      setLoadingOrders(true);
      try {
        const data = await getMyOrdersApi();
        setOrders(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoadingOrders(false);
      }
    };

    fetchOrders();
  }, [userInfo]);

  const submitHandler = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
    } else {
      setLoading(true);
      try {
        const res = await updateUserProfileApi({
          id: userInfo.id,
          name,
          email,
          password,
        });
        setCredentials({ ...res });
        toast.success('Profile updated successfully');
      } catch (err) {
        toast.error(err.message);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="container mx-auto px-4">
      <div className="flex flex-wrap -mx-2">
        <div className="w-full md:w-1/3 px-2">
          <h2 className="text-2xl font-bold mb-4">User Profile</h2>
          <form onSubmit={submitHandler} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
            <div className='mb-4'>
              <label className='block text-gray-700 text-sm font-bold mb-2' htmlFor='name'>
                Name
              </label>
              <input
                className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
                id='name'
                type='text'
                placeholder='Enter name'
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div className='mb-4'>
              <label className='block text-gray-700 text-sm font-bold mb-2' htmlFor='email'>
                Email Address
              </label>
              <input
                className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
                id='email'
                type='email'
                placeholder='Enter email'
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className='mb-4'>
              <label className='block text-gray-700 text-sm font-bold mb-2' htmlFor='password'>
                Password
              </label>
              <input
                className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
                id='password'
                type='password'
                placeholder='Enter password'
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <div className='mb-4'>
              <label className='block text-gray-700 text-sm font-bold mb-2' htmlFor='confirmPassword'>
                Confirm Password
              </label>
              <input
                className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
                id='confirmPassword'
                type='password'
                placeholder='Confirm password'
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>

            <div className="flex items-center justify-between">
              <button
                className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline'
                type='submit'
              >
                Update
              </button>
              {loading && <Loader />}
            </div>
          </form>
        </div>
        <div className="w-full md:w-2/3 px-2">
          <h2 className="text-2xl font-bold mb-4">My Orders</h2>
          {loadingOrders ? (
            <Loader />
          ) : error ? (
            <Message variant='danger'>
              {error?.data?.message || error.error}
            </Message>
          ) : (
            <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4 overflow-x-auto">
              <table className="min-w-full leading-normal">
                <thead className=''>
                  <tr>
                    <th>ID</th>
                    <th>DATE</th>
                    <th>TOTAL</th>
                    <th>PAID</th>
                    <th>DELIVERED</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order) => (
                    <tr key={order.id} style={{ height: '45px', padding: '5px 0' }}>
                      <td>{order.id}</td>
                      <td>{order.createdAt.substring(0, 10)}</td>
                      <td>{order.totalPrice}</td>
                      <td>
                        {order.isPaid ? (
                          order.paidAt.substring(0, 10)
                        ) : (
                          <FaTimes style={{ color: 'red' }} />
                        )}
                      </td>
                      <td style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                        {order.isDelivered ? (
                          order.deliveredAt.substring(0, 10)
                        ) : (
                          <FaTimes style={{ color: 'red' }} />
                        )}
                      </td>
                      <td>
                        <Link to={`/order/${order.id}`} className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded'>
                          Details
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfileScreen;
