import React, { useState, useEffect } from 'react';
import AdminApiService from '../../services/adminApi';

const Analytics = () => {
  const [analytics, setAnalytics] = useState({
    salesData: [],
    categoryData: []
  });
  const [timeRange, setTimeRange] = useState('30d');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, [timeRange]);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const response = await AdminApiService.getAnalytics(timeRange);
      setAnalytics(response.data);
    } catch (error) {
      console.error('Failed to fetch analytics');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-gray-800">Analytics</h2>
        <select
          value={timeRange}
          onChange={(e) => setTimeRange(e.target.value)}
          className="border border-gray-300 rounded-lg px-3 py-2"
        >
          <option value="7d">Last 7 days</option>
          <option value="30d">Last 30 days</option>
          <option value="90d">Last 90 days</option>
        </select>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sales Chart */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-xl font-semibold mb-4">Sales Over Time</h3>
          <div className="h-64 flex items-center justify-center text-gray-500">
            {/* Add chart library here (Chart.js, Recharts, etc.) */}
            Sales chart will go here
          </div>
        </div>

        {/* Category Performance */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-xl font-semibold mb-4">Category Performance</h3>
          <div className="space-y-3">
            {analytics.categoryData.map((category, index) => (
              <div key={index} className="flex justify-between items-center">
                <span className="font-medium">{category._id}</span>
                <span className="text-green-600">LKR {category.revenue.toLocaleString()}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;