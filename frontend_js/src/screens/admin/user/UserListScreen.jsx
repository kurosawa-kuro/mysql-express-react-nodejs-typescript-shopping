// frontend\src\screens\admin\user\UserListScreen.jsx

import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FaTrash, FaEdit, FaCheck, FaTimes } from 'react-icons/fa';
import Loader from '../../../components/common/Loader';
import { toast } from 'react-toastify';
import { useAuthStore } from '../../../state/store';
import { deleteUserApi, getUsersApi } from '../../../services/api';

const UserListScreen = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const { userInfo } = useAuthStore();

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        const data = await getUsersApi();
        setUsers(data);
      } catch (err) {
        toast.error(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const deleteHandler = async (id) => {
    if (window.confirm('Are you sure')) {
      try {
        await deleteUserApi(id);
        setUsers(users.filter((user) => user.id !== id));
        toast.success('User deleted successfully');
      } catch (err) {
        toast.error(err.message);
      }
    }
  };

  return (
    <>
      <h1 className='text-3xl font-bold mb-4'>Users</h1>
      {loading ? (
        <Loader />
      ) : (
        <table className='min-w-full divide-y divide-gray-200'>
          <thead className='bg-gray-50'>
            <tr>
              <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>ID</th>
              <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>NAME</th>
              <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>EMAIL</th>
              <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>ADMIN</th>
              <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'></th>
            </tr>
          </thead>
          <tbody className='bg-white divide-y divide-gray-200'>
            {users.map((user) => (
              <tr key={user.id}>
                <td className='px-6 py-4 whitespace-nowrap'>{user.id}</td>
                <td className='px-6 py-4 whitespace-nowrap'>{user.name}</td>
                <td className='px-6 py-4 whitespace-nowrap'>
                  <a href={`mailto:${user.email}`} className='text-indigo-600 hover:text-indigo-900'>{user.email}</a>
                </td>
                <td className='px-6 py-4 whitespace-nowrap'>
                  {user.isAdmin ? (
                    <FaCheck className='text-green-500' />
                  ) : (
                    <FaTimes className='text-red-500' />
                  )}
                </td>
                <td>
                  {userInfo.isAdmin && (
                    <>
                      <Link
                        to={`/admin/user/${user.id}/edit`}
                        className='bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded inline-flex items-center mr-2'
                      >
                        <FaEdit size={18} className="mr-1" />
                        Edit
                      </Link>
                      <button
                        className='inline-flex items-center text-white bg-red-600 hover:bg-red-700 rounded px-2 py-1'
                        onClick={() => deleteHandler(user.id)}
                      >
                        <FaTrash size={18} className="mr-1" />
                        Delete
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </>
  );
};

export default UserListScreen;

