import React, { useState, useEffect, useCallback } from 'react';
import { toast } from 'react-toastify';
import AdminApiService from '../../services/adminApi';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Input } from '../../components/ui/input';
import { Button } from '../../components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { Badge } from '../../components/ui/badge';

const OrderManagement = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalOrders: 0
  });
  const [filters, setFilters] = useState({
    status: '',
    search: '',
    page: 1,
    limit: 10
  });

  // Debounced fetch function
  const fetchOrders = useCallback(async () => {
    try {
      setLoading(true);
      console.log('🔍 Fetching orders with filters:', filters);
      
      // Build query parameters
      const queryParams = {
        page: filters.page,
        limit: filters.limit
      };

      // Only add search if it has content
      if (filters.search && filters.search.trim()) {
        queryParams.search = filters.search.trim();
      }

      // Only add status if selected
      if (filters.status) {
        queryParams.status = filters.status;
      }

      const response = await AdminApiService.getAllOrders(queryParams);
      
      if (response.success && response.data) {
        setOrders(response.data.orders || []);
        setPagination(response.data.pagination || {
          currentPage: 1,
          totalPages: 1,
          totalOrders: 0
        });
        console.log(`✅ Loaded ${response.data.orders?.length || 0} orders`);
      } else {
        setOrders([]);
        setPagination({ currentPage: 1, totalPages: 1, totalOrders: 0 });
      }
    } catch (error) {
      console.error('❌ Failed to fetch orders:', error);
      toast.error('Failed to fetch orders');
      setOrders([]);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  // Debounced effect for search and status changes
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      fetchOrders();
    }, 500); // 500ms debounce

    return () => clearTimeout(timeoutId);
  }, [fetchOrders]);

  const handleStatusUpdate = async (orderId, newStatus) => {
    try {
      await AdminApiService.updateOrderStatus(orderId, newStatus);
      toast.success('Order status updated successfully');
      fetchOrders();
    } catch (error) {
      toast.error('Failed to update order status');
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

  // Search handler
  const handleSearchChange = (e) => {
    const value = e.target.value;
    setFilters(prev => ({ 
      ...prev, 
      search: value, 
      page: 1
    }));
  };

  // Status filter handler
  const handleStatusChange = (value) => {
    setFilters(prev => ({ 
      ...prev, 
      status: value === 'all' ? '' : value, // Convert 'all' back to empty string for API
      page: 1
    }));
  };

  // Pagination handlers
  const handlePageChange = (newPage) => {
    setFilters(prev => ({ ...prev, page: newPage }));
  };

  const handlePrevPage = () => {
    if (pagination.currentPage > 1) {
      handlePageChange(pagination.currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (pagination.currentPage < pagination.totalPages) {
      handlePageChange(pagination.currentPage + 1);
    }
  };

  // Clear filters
  const handleClearFilters = () => {
    setFilters({
      status: '',
      search: '',
      page: 1,
      limit: 10
    });
  };

  if (loading && orders.length === 0) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
        <span className="ml-3 text-gray-600">Loading orders...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Order Management</h2>
        <p className="text-muted-foreground">
          Manage and track customer orders
        </p>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Input
              placeholder="Search by order ID or customer name..."
              value={filters.search}
              onChange={handleSearchChange}
            />
            {/* Select with proper value handling */}
            <Select value={filters.status || 'all'} onValueChange={handleStatusChange}>
              <SelectTrigger>
                <SelectValue placeholder="All Statuses" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="confirmed">Confirmed</SelectItem>
                <SelectItem value="processing">Processing</SelectItem>
                <SelectItem value="shipped">Shipped</SelectItem>
                <SelectItem value="delivered">Delivered</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
            <Button
              onClick={fetchOrders}
              disabled={loading}
              variant="outline"
            >
              {loading ? 'Loading...' : 'Refresh'}
            </Button>
            <Button
              onClick={handleClearFilters}
              variant="secondary"
            >
              Clear Filters
            </Button>
          </div>
          
          {/* Results info */}
          <div className="mt-3 flex justify-between items-center text-sm text-muted-foreground">
            <div>
              Total orders: <strong>{pagination.totalOrders}</strong> | 
              Showing: <strong>{orders.length}</strong> orders
              {(filters.search || filters.status) && (
                <span className="ml-2 text-primary">
                  (Filtered results)
                </span>
              )}
            </div>
            {pagination.totalPages > 1 && (
              <div>
                Page {pagination.currentPage} of {pagination.totalPages}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Orders Table */}
      <Card>
        <CardContent className="p-0">
          {orders.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              {filters.search || filters.status 
                ? 'No orders found matching your criteria. Try adjusting your filters.' 
                : 'No orders found.'
              }
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="border-b">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        Order ID
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        Customer
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        Items
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        Total
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        Date
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {orders.map((order) => (
                      <tr key={order._id} className="hover:bg-muted/50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          #{order._id.slice(-6)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium">
                            {order.shippingAddress?.firstName} {order.shippingAddress?.lastName}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {order.shippingAddress?.email}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          {order.items?.length || 0} items
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          LKR {order.totalAmount}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <Badge variant={getStatusVariant(order.orderStatus)}>
                            {order.orderStatus}
                          </Badge>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          {new Date(order.createdAt).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <Select 
                            value={order.orderStatus} 
                            onValueChange={(value) => handleStatusUpdate(order._id, value)}
                          >
                            <SelectTrigger className="w-32">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="pending">Pending</SelectItem>
                              <SelectItem value="confirmed">Confirmed</SelectItem>
                              <SelectItem value="processing">Processing</SelectItem>
                              <SelectItem value="shipped">Shipped</SelectItem>
                              <SelectItem value="delivered">Delivered</SelectItem>
                              <SelectItem value="cancelled">Cancelled</SelectItem>
                            </SelectContent>
                          </Select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {pagination.totalPages > 1 && (
                <div className="border-t px-6 py-3 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Button
                      onClick={handlePrevPage}
                      disabled={pagination.currentPage === 1 || loading}
                      variant="outline"
                      size="sm"
                    >
                      Previous
                    </Button>
                    
                    <span className="text-sm text-muted-foreground">
                      Page {pagination.currentPage} of {pagination.totalPages}
                    </span>
                    
                    <Button
                      onClick={handleNextPage}
                      disabled={pagination.currentPage === pagination.totalPages || loading}
                      variant="outline"
                      size="sm"
                    >
                      Next
                    </Button>
                  </div>
                  
                  <div className="text-sm text-muted-foreground">
                    Showing {((pagination.currentPage - 1) * filters.limit) + 1} to{' '}
                    {Math.min(pagination.currentPage * filters.limit, pagination.totalOrders)} of{' '}
                    {pagination.totalOrders} results
                  </div>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default OrderManagement;