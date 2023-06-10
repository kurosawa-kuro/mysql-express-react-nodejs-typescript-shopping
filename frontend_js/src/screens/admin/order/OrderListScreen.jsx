// frontend\src\screens\admin\order\OrderListScreen.jsx

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaTimes } from 'react-icons/fa';
import Message from '../../../components/common/Message';
import Loader from '../../../components/common/Loader';
import { getOrdersApi } from '../../../services/api';

const OrderListScreen = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const data = await getOrdersApi();
        setOrders(data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  return (
    <>
      <h1 className='text-2xl font-semibold mb-4'>Orders</h1>
      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant='danger'>
          {error}
        </Message>
      ) : (
        <div className='overflow-x-auto'>
          <table className='w-full divide-y divide-gray-200'>
            <thead className='bg-gray-50'>
              <tr>
                <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>ID</th>
                <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>USER</th>
                <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>DATE</th>
                <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>TOTAL</th>
                <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>PAID</th>
                <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>DELIVERED</th>
                <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'></th>
              </tr>
            </thead>
            <tbody className='bg-white divide-y divide-gray-200'>
              {orders.map((order) => (
                <tr key={order.id}>
                  <td className='px-6 py-4 whitespace-nowrap'>{order.id}</td>
                  <td className='px-6 py-4 whitespace-nowrap'>{order.user && order.user.name}</td>
                  <td className='px-6 py-4 whitespace-nowrap'>{order.createdAt.substring(0, 10)}</td>
                  <td className='px-6 py-4 whitespace-nowrap'>${order.totalPrice}</td>
                  <td className='px-6 py-4 whitespace-nowrap'>
                    {order.isPaid ? (
                      order.paidAt.substring(0, 10)
                    ) : (
                      <FaTimes className='text-red-500' />
                    )}
                  </td>
                  <td className='px-6 py-4 whitespace-nowrap'>
                    {order.isDelivered ? (
                      order.deliveredAt.substring(0, 10)
                    ) : (
                      <FaTimes className='text-red-500' />
                    )}
                  </td>
                  <td className='px-6 py-4 whitespace-nowrap text-right text-sm font-medium'>
                    <Link to={`/order/${order.id}`} className='text-indigo-600 hover:text-indigo-900'>
                      Details
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
};

export default OrderListScreen