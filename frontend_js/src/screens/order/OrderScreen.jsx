// frontend\src\screens\order\OrderScreen.jsx

import { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';

import { useAuthStore } from '../../state/store';
import Message from '../../components/common/Message';
import Loader from '../../components/common/Loader';
import { getOrderDetailsApi, payOrderApi, deliverOrderApi } from '../../services/api';

const OrderScreen = () => {
  const { id: orderId } = useParams();
  const { userInfo } = useAuthStore();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchOrder = async () => {
    try {
      setLoading(true);
      const data = await getOrderDetailsApi(orderId);
      setOrder(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const onApproveTest = async () => {
    try {
      setLoading(true);
      await payOrderApi({ orderId, details: { payer: {} } });
      toast.success('Order is paid');
      fetchOrder();
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  const deliverHandler = async () => {
    try {
      setLoading(true);
      await deliverOrderApi(orderId);
      fetchOrder();
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrder();
  }, [orderId]);

  if (loading) {
    return <Loader />;
  }

  if (error) {
    return <Message>{error}</Message>;
  }

  if (!order) {
    return null;
  }

  return (
    <div className="py-6">
      <h1 className="text-3xl font-bold mb-6">Order {order.id}</h1>
      <div className="flex flex-wrap -mx-4">
        <div className="w-full lg:w-2/3 px-4 mb-4 lg:mb-0">
          <div className="bg-white rounded-lg shadow p-6">
            {/* Shipping */}
            <div className="border-b pb-6 mb-4">
              <h2 className="text-xl font-bold mb-4">Shipping</h2>
              <p className="mb-2">
                <span className="font-bold">Name:</span> {order.user.name}
              </p>
              <p className="mb-2">
                <span className="font-bold">Email:</span>{' '}
                <a href={`mailto:${order.user.email}`}>{order.user.email}</a>
              </p>
              <p>
                <span className="font-bold">Address:</span>
                {order.address}, {order.city} {order.postalCode}
              </p>
              {order.isDelivered ? (
                <Message variant='success'>
                  Delivered on {order.deliveredAt}
                </Message>
              ) : (
                <Message variant='danger'>Not Delivered</Message>
              )}
            </div>

            {/* Payment Method */}
            <div className="border-b pb-6 mb-4">
              <h2 className="text-xl font-bold mb-4">Payment Method</h2>
              <p>
                <span className="font-bold">Method:</span> {order.paymentMethod}
              </p>
              {order.isPaid ? (
                <Message variant='success'>Paid on {order.paidAt}</Message>
              ) : (
                <Message variant='danger'>Not Paid</Message>
              )}
            </div>

            {/* Order Items */}
            <div>
              <h2 className="text-xl font-bold mb-4">Order Items</h2>
              {order.orderProducts.length === 0 ? (
                <Message>Order is empty</Message>
              ) : (
                order.orderProducts.map((item, index) => (
                  <div key={index} className="flex items-center mb-4">
                    <div className="w-1/5">
                      <img
                        className="w-full rounded"
                        src={item.product.image}
                        alt={item.product.name}
                      />
                    </div>
                    <div className="w-3/5 px-4">
                      <Link to={`/product/${item.product.id}`}>
                        {item.product.name}
                      </Link>
                    </div>
                    <div className="w-1/5 text-right">
                      {item.qty} x ${item.product.price} = ${item.qty * item.product.price}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
        <div className="w-full lg:w-1/3 px-4">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-bold mb-4">Order Summary</h2>

            {/* Items */}
            <div className="flex items-center justify-between mb-4">
              <span>Items</span>
              <span>${order.itemsPrice}</span>
            </div>

            {/* Shipping */}
            <div className="flex items-center justify-between mb-4">
              <span>Shipping</span>
              <span>${order.shippingPrice}</span>
            </div>

            {/* Tax */}
            <div className="flex items-center justify-between mb-4">
              <span>Tax</span>
              <span>${order.taxPrice}</span>
            </div>

            {/* Total */}
            <div className="flex items-center justify-between mb-6">
              <span>Total</span>
              <span>${order.totalPrice}</span>
            </div>

            {/* Payment and Delivery */}
            {!order.isPaid && (
              <div className="mb-4">
                {loading && <Loader />}
                {!userInfo ? (
                  <Message>
                    Please <Link to='/login'>sign in</Link> to pay
                  </Message>
                ) : (
                  <button
                    onClick={onApproveTest}
                    className='w-full py-2 px-4 bg-blue-500 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-md focus:outline-none'
                    type='button'
                    disabled={order.orderProducts.length === 0}
                  >
                    Test Pay
                  </button>
                )}
              </div>
            )}

            {loading && <Loader />}
            {userInfo &&
              userInfo.isAdmin &&
              order.isPaid &&
              !order.isDelivered && (
                <button
                  type='button'
                  className='w-full py-2 px-4 bg-green-500 hover:bg-green-700 text-white font-semibold rounded-lg shadow-md focus:outline-none'
                  onClick={deliverHandler}
                >
                  Mark As Delivered
                </button>
              )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderScreen;
