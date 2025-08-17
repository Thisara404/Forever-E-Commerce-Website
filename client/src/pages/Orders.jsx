import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useReduxSelectors';
import ApiService from '../services/api';
import Title from '../components/Title';
import { toast } from 'react-toastify';

const Orders = () => {
  const navigate = useNavigate();
  const { token } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Add currency constant
  const currency = 'LKR';

  useEffect(() => {
    if (!token) {
      navigate('/login');
      return;
    }
    fetchOrders();
  }, [token, navigate]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await ApiService.getUserOrders();
      setOrders(response.data.orders);
    } catch (error) {
      toast.error('Failed to fetch orders');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: 'bg-yellow-500',
      confirmed: 'bg-blue-500',
      processing: 'bg-purple-500',
      shipped: 'bg-indigo-500',
      delivered: 'bg-green-500',
      cancelled: 'bg-red-500'
    };
    return colors[status] || 'bg-gray-500';
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className='border-t pt-16'>
      <div className='text-2xl'>
        <Title text1={'MY'} text2={'ORDERS'}/>
      </div>

      <div>
        {orders.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-gray-500 text-lg">No orders found</p>
            <button 
              onClick={() => navigate('/collection')}
              className="mt-4 bg-black text-white px-6 py-2 text-sm"
            >
              START SHOPPING
            </button>
          </div>
        ) : (
          orders.map((order) => (
            <div key={order._id} className='py-4 border-b text-gray-700 flex flex-col md:flex-row md:items-center md:justify-between gap-4'>
              <div className='flex items-start gap-6 text-sm'>
                <img 
                  className='w-16 sm:w-20' 
                  src={order.items[0]?.image || order.items[0]?.productId?.image?.[0]} 
                  alt={order.items[0]?.name} 
                />
                <div>
                  <p className='sm:text-base font-medium'>
                    Order #{order._id.slice(-6)}
                  </p>
                  <div className='flex items-center gap-3 mt-2 text-base text-gray-700'>
                    <p className='text-lg'>{currency} {order.totalAmount}</p>
                    <p>Items: {order.items.length}</p>
                  </div>
                  <p className='mt-2'>
                    Date: <span className='text-gray-400'>
                      {new Date(order.createdAt).toLocaleDateString()}
                    </span>
                  </p>
                  <p className='mt-1'>
                    Payment: <span className='text-gray-600 capitalize'>
                      {order.paymentMethod}
                    </span>
                  </p>
                </div>
              </div>
              
              <div className='md:w-1/2 flex justify-between'>
                <div className='flex items-center gap-2'>
                  <p className={`min-w-2 h-2 rounded-full ${getStatusColor(order.orderStatus)}`}></p>
                  <p className='text-sm md:text-base capitalize'>{order.orderStatus}</p>
                </div>
                <button 
                  onClick={() => navigate(`/orders/${order._id}`)}
                  className='border px-4 py-2 text-sm font-medium rounded-sm hover:bg-gray-50'
                >
                  Track Order
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Orders;
