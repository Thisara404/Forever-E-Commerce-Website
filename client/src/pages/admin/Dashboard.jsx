import React, { useState, useEffect } from 'react';
import AdminApiService from '../../services/adminApi';
import { toast } from 'react-toastify';

const LoadingState = () => (
  <div className="flex justify-center items-center h-64">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
    <span className="ml-3 text-gray-600">Loading...</span>
  </div>
);

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalUsers: 0,
    totalProducts: 0,
    totalRevenue: 0,
    recentOrders: [],
    topProducts: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    console.log('🛠️ [DEBUG] Dashboard useEffect triggered');
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('🛠️ [DEBUG] Fetching dashboard stats from API...');
      
      // Check if we have a token first
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }
      
      const response = await AdminApiService.getDashboardStats();
      console.log('🛠️ [DEBUG] Dashboard API response:', response);
      
      if (response && response.success && response.data) {
        console.log('✅ Setting stats data:', response.data);
        setStats(response.data);
      } else {
        console.error('❌ Invalid response structure:', response);
        throw new Error('Invalid response structure');
      }
    } catch (error) {
      console.error('🛠️ [DEBUG] Dashboard fetch error:', error);
      setError(error.message);
      toast.error(`Failed to load dashboard: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Debug: Log current state
  console.log('🔍 Dashboard render state:', { loading, error, stats });

  if (loading) {
    return <LoadingState />;
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
        <div className="text-red-600 text-2xl mb-2">⚠️</div>
        <h3 className="text-lg font-semibold text-red-800 mb-2">Dashboard Error</h3>
        <p className="text-red-700 mb-4">{error}</p>
        <button 
          onClick={fetchDashboardStats}
          className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-3xl font-bold text-gray-800 mb-6">Dashboard Overview</h2>
      
      {/* Debug Info */}
      {/* <div className="bg-blue-50 p-4 rounded-lg mb-6">
        <h4 className="font-semibold text-blue-800">Debug Info:</h4>
        <pre className="text-xs text-blue-700 mt-2">
          {JSON.stringify(stats, null, 2)}
        </pre>
      </div> */}
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Total Orders"
          value={stats.totalOrders || 0}
          icon="📋"
          color="bg-blue-500"
        />
        <StatCard
          title="Total Users"
          value={stats.totalUsers || 0}
          icon="👥"
          color="bg-green-500"
        />
        <StatCard
          title="Total Products"
          value={stats.totalProducts || 0}
          icon="📦"
          color="bg-purple-500"
        />
        <StatCard
          title="Total Revenue"
          value={`LKR ${(stats.totalRevenue || 0).toLocaleString()}`}
          icon="💰"
          color="bg-yellow-500"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Orders */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-xl font-semibold mb-4">Recent Orders</h3>
          <div className="space-y-3">
            {stats.recentOrders && stats.recentOrders.length > 0 ? (
              stats.recentOrders.map((order) => (
                <div key={order._id} className="flex justify-between items-center p-3 bg-gray-50 rounded">
                  <div>
                    <p className="font-medium">#{order._id.slice(-6)}</p>
                    <p className="text-sm text-gray-600">{order.userId?.name || 'Unknown'}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">LKR {order.totalAmount || 0}</p>
                    <span className={`text-xs px-2 py-1 rounded ${getStatusColor(order.orderStatus)}`}>
                      {order.orderStatus || 'pending'}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-gray-500 text-center py-4">
                No recent orders found
              </div>
            )}
          </div>
        </div>

        {/* Top Products */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-xl font-semibold mb-4">Top Products</h3>
          <div className="space-y-3">
            {stats.topProducts && stats.topProducts.length > 0 ? (
              stats.topProducts.map((product, index) => (
                <div key={product._id} className="flex items-center space-x-3">
                  <span className="w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center text-sm">
                    {index + 1}
                  </span>
                  <img 
                    src={product.image?.[0] || '/placeholder.jpg'} 
                    alt={product.name}
                    className="w-10 h-10 object-cover rounded"
                    onError={(e) => {
                      e.target.src = '/placeholder.jpg';
                    }}
                  />
                  <div className="flex-1">
                    <p className="font-medium">{product.name || 'Unknown Product'}</p>
                    <p className="text-sm text-gray-600">{product.soldCount || 0} sold</p>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-gray-500 text-center py-4">
                No top products data available
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ title, value, icon, color }) => (
  <div className="bg-white rounded-lg shadow p-6">
    <div className="flex items-center">
      <div className={`p-3 rounded-full ${color} text-white`}>
        <span className="text-2xl">{icon}</span>
      </div>
      <div className="ml-4">
        <p className="text-sm font-medium text-gray-600">{title}</p>
        <p className="text-2xl font-bold text-gray-900">{value}</p>
      </div>
    </div>
  </div>
);

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

export default Dashboard;