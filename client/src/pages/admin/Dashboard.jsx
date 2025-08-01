import React, { useState, useEffect } from 'react';
import AdminApiService from '../../services/adminApi';

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

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      setLoading(true);
      const response = await AdminApiService.getDashboardStats();
      setStats(response.data);
    } catch (error) {
      console.error('Failed to fetch dashboard stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-3xl font-bold text-gray-800 mb-6">Dashboard Overview</h2>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Total Orders"
          value={stats.totalOrders}
          icon="📋"
          color="bg-blue-500"
        />
        <StatCard
          title="Total Users"
          value={stats.totalUsers}
          icon="👥"
          color="bg-green-500"
        />
        <StatCard
          title="Total Products"
          value={stats.totalProducts}
          icon="📦"
          color="bg-purple-500"
        />
        <StatCard
          title="Total Revenue"
          value={`LKR ${stats.totalRevenue.toLocaleString()}`}
          icon="💰"
          color="bg-yellow-500"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Orders */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-xl font-semibold mb-4">Recent Orders</h3>
          <div className="space-y-3">
            {stats.recentOrders.map((order) => (
              <div key={order._id} className="flex justify-between items-center p-3 bg-gray-50 rounded">
                <div>
                  <p className="font-medium">#{order._id.slice(-6)}</p>
                  <p className="text-sm text-gray-600">{order.userId.name}</p>
                </div>
                <div className="text-right">
                  <p className="font-medium">LKR {order.totalAmount}</p>
                  <span className={`text-xs px-2 py-1 rounded ${getStatusColor(order.orderStatus)}`}>
                    {order.orderStatus}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Products */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-xl font-semibold mb-4">Top Products</h3>
          <div className="space-y-3">
            {stats.topProducts.map((product, index) => (
              <div key={product._id} className="flex items-center space-x-3">
                <span className="w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center text-sm">
                  {index + 1}
                </span>
                <img 
                  src={product.image[0]} 
                  alt={product.name}
                  className="w-10 h-10 object-cover rounded"
                />
                <div className="flex-1">
                  <p className="font-medium">{product.name}</p>
                  <p className="text-sm text-gray-600">{product.soldCount} sold</p>
                </div>
              </div>
            ))}
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