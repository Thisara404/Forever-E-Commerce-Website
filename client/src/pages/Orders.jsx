import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useReduxSelectors';
import ApiService from '../services/api';
import Title from '../components/Title';
import { toast } from 'react-toastify';
import { Card, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Separator } from '../components/ui/separator';

const Orders = () => {
  const navigate = useNavigate();
  const { token } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  
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

  const getStatusVariant = (status) => {
    const variants = {
      pending: 'secondary',
      confirmed: 'default',
      processing: 'outline',
      shipped: 'secondary',
      delivered: 'default',
      cancelled: 'destructive'
    };
    return variants[status] || 'outline';
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
        <span className="ml-3 text-muted-foreground">Loading your orders...</span>
      </div>
    );
  }

  return (
    <div className='border-t pt-16 space-y-8'>
      <div className="text-center">
        <div className='text-3xl font-bold tracking-tight mb-2'>
          <Title text1={'MY'} text2={'ORDERS'}/>
        </div>
        <p className="text-muted-foreground">
          Track and manage your orders
        </p>
      </div>

      <div className="space-y-4">
        {orders.length === 0 ? (
          <Card>
            <CardContent className="text-center py-16">
              <div className="text-6xl mb-4">📦</div>
              <h3 className="text-xl font-semibold mb-2">No orders found</h3>
              <p className="text-muted-foreground mb-6">
                You haven't placed any orders yet
              </p>
              <Button 
                onClick={() => navigate('/collection')}
                size="lg"
              >
                Start Shopping
              </Button>
            </CardContent>
          </Card>
        ) : (
          orders.map((order) => (
            <Card key={order._id} className="overflow-hidden">
              <CardContent className="p-6">
                <div className='grid grid-cols-1 lg:grid-cols-[auto_1fr_auto] gap-6 items-start'>
                  {/* Product Image and Order Info */}
                  <div className='flex items-start gap-4'>
                    <img 
                      className='w-20 h-20 object-cover rounded-lg border' 
                      src={order.items[0]?.image || order.items[0]?.productId?.image?.[0]} 
                      alt={order.items[0]?.name} 
                    />
                    <div className="space-y-2">
                      <h3 className='font-semibold text-lg'>
                        Order #{order._id.slice(-6)}
                      </h3>
                      <div className='flex items-center gap-4 text-sm'>
                        <span className='font-medium text-lg'>
                          {currency} {order.totalAmount}
                        </span>
                        <span className='text-muted-foreground'>
                          {order.items.length} item{order.items.length > 1 ? 's' : ''}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Order Details */}
                  <div className='space-y-3'>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className='text-muted-foreground'>Order Date</p>
                        <p className='font-medium'>
                          {new Date(order.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <div>
                        <p className='text-muted-foreground'>Payment Method</p>
                        <p className='font-medium capitalize'>
                          {order.paymentMethod}
                        </p>
                      </div>
                    </div>
                    
                    <Separator />
                    
                    <div className='flex items-center justify-between'>
                      <div className='flex items-center gap-3'>
                        <span className='text-sm text-muted-foreground'>Status:</span>
                        <Badge variant={getStatusVariant(order.orderStatus)}>
                          {order.orderStatus}
                        </Badge>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className='flex flex-col gap-2'>
                    <Button 
                      onClick={() => navigate(`/orders/${order._id}`)}
                      variant="outline"
                      size="sm"
                      className="w-full lg:w-auto"
                    >
                      Track Order
                    </Button>
                    <Button 
                      onClick={() => navigate(`/product/${order.items[0]?.productId?._id || order.items[0]?._id}`)}
                      variant="ghost"
                      size="sm"
                      className="w-full lg:w-auto"
                    >
                      View Product
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default Orders;
