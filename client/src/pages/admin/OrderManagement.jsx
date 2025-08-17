import React, { useState, useEffect, useCallback } from 'react';
import { toast } from 'react-toastify';
import AdminApiService from '../../services/adminApi';

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
      // Refresh orders after update
      fetchOrders();
    } catch (error) {
      toast.error('Failed to update order status');
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      confirmed: 'bg-blue-100 text-blue-800',
      processing: 'bg-purple-100 text-purple-800',
      shipped: 'bg-indigo-100 text-indigo-800',
      delivered: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  // Search handler
  const handleSearchChange = (e) => {
    const value = e.target.value;
    setFilters(prev => ({ 
      ...prev, 
      search: value, 
      page: 1 // Reset to first page when searching
    }));
  };

  // Status filter handler
  const handleStatusChange = (e) => {
    const value = e.target.value;
    setFilters(prev => ({ 
      ...prev, 
      status: value, 
      page: 1 // Reset to first page when filtering
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
    <div>
      <h2 className="text-3xl font-bold text-gray-800 mb-6">Order Management</h2>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <input
            type="text"
            placeholder="Search by order ID or customer name..."
            value={filters.search}
            onChange={handleSearchChange}
            className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500"
          />
          <select
            value={filters.status}
            onChange={handleStatusChange}
            className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:border-blue-500"
          >
            <option value="">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="confirmed">Confirmed</option>
            <option value="processing">Processing</option>
            <option value="shipped">Shipped</option>
            <option value="delivered">Delivered</option>
            <option value="cancelled">Cancelled</option>
          </select>
          <button
            onClick={fetchOrders}
            disabled={loading}
            className={`px-4 py-2 rounded-lg text-white transition-colors ${
              loading 
                ? 'bg-gray-400 cursor-not-allowed' 
                : 'bg-blue-500 hover:bg-blue-600'
            }`}
          >
            {loading ? 'Loading...' : 'Refresh'}
          </button>
          <button
            onClick={handleClearFilters}
            className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors"
          >
            Clear Filters
          </button>
        </div>
        
        {/* Results info */}
        <div className="mt-3 flex justify-between items-center text-sm text-gray-600">
          <div>
            Total orders: <strong>{pagination.totalOrders}</strong> | 
            Showing: <strong>{orders.length}</strong> orders
            {(filters.search || filters.status) && (
              <span className="ml-2 text-blue-600">
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
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        {orders.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            {filters.search || filters.status 
              ? 'No orders found matching your criteria. Try adjusting your filters.' 
              : 'No orders found.'
            }
          </div>
        ) : (
          <>
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Order ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Customer
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Items
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {orders.map((order) => (
                  <tr key={order._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      #{order._id.slice(-6)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {order.shippingAddress?.firstName} {order.shippingAddress?.lastName}
                      </div>
                      <div className="text-sm text-gray-500">
                        {order.shippingAddress?.email}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {order.items?.length || 0} items
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      LKR {order.totalAmount}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(order.orderStatus)}`}>
                        {order.orderStatus}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <select
                        value={order.orderStatus}
                        onChange={(e) => handleStatusUpdate(order._id, e.target.value)}
                        className="border border-gray-300 rounded px-2 py-1 text-xs focus:outline-none focus:border-blue-500"
                      >
                        <option value="pending">Pending</option>
                        <option value="confirmed">Confirmed</option>
                        <option value="processing">Processing</option>
                        <option value="shipped">Shipped</option>
                        <option value="delivered">Delivered</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Pagination */}
            {pagination.totalPages > 1 && (
              <div className="bg-gray-50 px-6 py-3 flex items-center justify-between border-t border-gray-200">
                <div className="flex items-center">
                  <button
                    onClick={handlePrevPage}
                    disabled={pagination.currentPage === 1 || loading}
                    className={`px-3 py-1 rounded text-sm ${
                      pagination.currentPage === 1 || loading
                        ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                        : 'bg-white border text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    Previous
                  </button>
                  
                  <span className="mx-4 text-sm text-gray-700">
                    Page {pagination.currentPage} of {pagination.totalPages}
                  </span>
                  
                  <button
                    onClick={handleNextPage}
                    disabled={pagination.currentPage === pagination.totalPages || loading}
                    className={`px-3 py-1 rounded text-sm ${
                      pagination.currentPage === pagination.totalPages || loading
                        ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                        : 'bg-white border text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    Next
                  </button>
                </div>
                
                <div className="text-sm text-gray-500">
                  Showing {((pagination.currentPage - 1) * filters.limit) + 1} to{' '}
                  {Math.min(pagination.currentPage * filters.limit, pagination.totalOrders)} of{' '}
                  {pagination.totalOrders} results
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default OrderManagement;