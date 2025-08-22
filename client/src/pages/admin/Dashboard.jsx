import React, { useState, useEffect } from 'react';
import AdminApiService from '../../services/adminApi';
import { toast } from 'react-toastify';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';

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

  const StatCard = ({ title, value, icon, color }) => (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center">
          <div className={`p-3 rounded-full ${color} text-white`}>
            <span className="text-2xl">{icon}</span>
          </div>
          <div className="ml-4">
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <p className="text-2xl font-bold">{value}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  if (loading) return <LoadingState />;

  if (error) {
    return (
      <Card className="border-destructive">
        <CardContent className="p-6">
          <div className="text-center">
            <h3 className="text-lg font-semibold text-destructive">Error Loading Dashboard</h3>
            <p className="text-muted-foreground mt-2">{error}</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
        <p className="text-muted-foreground">
          Welcome to your admin dashboard
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Revenue"
          value={`LKR ${stats.totalRevenue?.toLocaleString() || 0}`}
          icon="💰"
          color="bg-green-500"
        />
        <StatCard
          title="Total Orders"
          value={stats.totalOrders || 0}
          icon="📦"
          color="bg-blue-500"
        />
        <StatCard
          title="Total Users"
          value={stats.totalUsers || 0}
          icon="👥"
          color="bg-purple-500"
        />
        <StatCard
          title="Total Products"
          value={stats.totalProducts || 0}
          icon="🛍️"
          color="bg-orange-500"
        />
      </div>

      {/* Recent Orders and Top Products */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Recent Orders</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {stats.recentOrders && stats.recentOrders.length > 0 ? (
                stats.recentOrders.map((order) => (
                  <div key={order._id} className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
                    <div>
                      <p className="font-medium">#{order._id.slice(-6)}</p>
                      <p className="text-sm text-muted-foreground">{order.userId?.name || 'Unknown'}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">LKR {order.totalAmount || 0}</p>
                      <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(order.orderStatus)}`}>
                        {order.orderStatus || 'pending'}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-muted-foreground text-center py-4">No recent orders</p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Top Products</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {stats.topProducts && stats.topProducts.length > 0 ? (
                stats.topProducts.map((product, index) => (
                  <div key={product._id} className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <span className="font-bold text-lg">#{index + 1}</span>
                      <div>
                        <p className="font-medium">{product.name}</p>
                        <p className="text-sm text-muted-foreground">{product.category}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">LKR {product.price}</p>
                      <p className="text-sm text-muted-foreground">{product.sales || 0} sold</p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-muted-foreground text-center py-4">No product data</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
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

export default Dashboard;