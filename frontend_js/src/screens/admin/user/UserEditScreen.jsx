// frontend\src\screens\admin\user\UserEditScreen.jsx

import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import Loader from '../../../components/common/Loader';
import { toast } from 'react-toastify';
import { getUserDetailsApi, updateUserApi } from '../../../services/api';  // Import the api functions

const UserEditScreen = () => {
  const { id: userId } = useParams();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      setLoading(true);
      try {
        const user = await getUserDetailsApi(userId);
        setName(user.name);
        setEmail(user.email);
        setIsAdmin(user.isAdmin);
      } catch (err) {
        toast.error(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [userId]);

  const submitHandler = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await updateUserApi({ userId, name, email, isAdmin });
      toast.success('User updated successfully');
      navigate('/admin/user-list');
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Link to='/admin/user-list' className='bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded inline-flex items-center my-3'>
        Go Back
      </Link>
      <div className='w-full max-w-xs mx-auto'>
        <h1 className='text-2xl font-bold mb-3'>Edit User</h1>
        {loading ? (
          <Loader />
        ) : (
          <form onSubmit={submitHandler} className='bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4'>
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
              <label className='block text-gray-700 text-sm font-bold mb-2' htmlFor='isadmin'>
                Is Admin
              </label>
              <input
                className='mr-2 leading-tight'
                type='checkbox'
                id='isadmin'
                checked={isAdmin}
                onChange={(e) => setIsAdmin(e.target.checked)}
              />
              <span className='text-sm'>
                Check if the user is an administrator
              </span>
            </div>

            <div className='flex items-center justify-between'>
              <button
                className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline'
                type='submit'
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

export default UserEditScreen;

