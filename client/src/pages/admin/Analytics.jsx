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
          className="border border-gray-300 rounded-lg px-3 py-2 bg-gray-50"
        >
          <option value="7d">Last 7 days</option>
          <option value="30d">Last 30 days</option>
          <option value="90d">Last 90 days</option>
        </select>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sales Chart */}
        <div className="bg-gradient-to-br from-blue-50 to-indigo-100 p-6 rounded-lg shadow-lg border border-blue-200">
          <h3 className="text-xl font-semibold mb-4 text-indigo-800">Sales Over Time</h3>
          <div className="h-64 flex items-center justify-center text-indigo-600">
            {/* Add chart library here (Chart.js, Recharts, etc.) */}
            Sales chart will go here
          </div>
        </div>

        {/* Category Performance */}
        <div className="bg-gradient-to-br from-green-50 to-emerald-100 p-6 rounded-lg shadow-lg border border-green-200">
          <h3 className="text-xl font-semibold mb-4 text-emerald-800">Category Performance</h3>
          <div className="space-y-3">
            {analytics.categoryData.map((category, index) => (
              <div key={index} className="flex justify-between items-center p-3 bg-emerald-50 rounded-lg border border-emerald-200">
                <span className="font-medium text-emerald-700">{category._id}</span>
                <span className="text-emerald-600 font-semibold">LKR {category.revenue.toLocaleString()}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;