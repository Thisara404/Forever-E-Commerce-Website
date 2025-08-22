import React, { useState, useEffect } from 'react';
import AdminApiService from '../../services/adminApi';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';

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

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
        <span className="ml-3 text-gray-600">Loading analytics...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Analytics</h2>
          <p className="text-muted-foreground">
            View your business performance metrics
          </p>
        </div>
        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Select time range" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="7d">Last 7 days</SelectItem>
            <SelectItem value="30d">Last 30 days</SelectItem>
            <SelectItem value="90d">Last 90 days</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sales Chart */}
        <Card className="border-blue-200 bg-gradient-to-br from-blue-50 to-indigo-100">
          <CardHeader>
            <CardTitle className="text-indigo-800">Sales Over Time</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex items-center justify-center text-indigo-600">
              {/* Add chart library here (Chart.js, Recharts, etc.) */}
              <div className="text-center">
                <div className="text-2xl mb-2">📈</div>
                <p>Sales chart will go here</p>
                <p className="text-sm text-muted-foreground mt-2">
                  Integrate with Chart.js or Recharts for visualization
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Category Performance */}
        <Card className="border-green-200 bg-gradient-to-br from-green-50 to-emerald-100">
          <CardHeader>
            <CardTitle className="text-emerald-800">Category Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {analytics.categoryData && analytics.categoryData.length > 0 ? (
                analytics.categoryData.map((category, index) => (
                  <div key={index} className="flex justify-between items-center p-3 bg-emerald-50 rounded-lg border border-emerald-200">
                    <span className="font-medium text-emerald-700">{category._id}</span>
                    <span className="text-emerald-600 font-semibold">
                      LKR {category.revenue?.toLocaleString() || 0}
                    </span>
                  </div>
                ))
              ) : (
                <div className="text-center py-8">
                  <div className="text-2xl mb-2">📊</div>
                  <p className="text-muted-foreground">No category data available</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Analytics;