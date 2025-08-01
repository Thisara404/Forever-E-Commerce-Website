import React, { useContext, useEffect } from 'react';
import { Outlet, Navigate, Link, useLocation } from 'react-router-dom';
import { ShopContext } from '../../context/ShopContext';
import { assets } from '../../assets/assets';

const AdminLayout = () => {
  const { user, loading } = useContext(ShopContext);
  const location = useLocation();

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (!user || user.role !== 'admin') {
    return <Navigate to="/login" replace />;
  }

  const sidebarItems = [
    { path: '/admin', label: 'Dashboard', icon: '📊' },
    { path: '/admin/products', label: 'Products', icon: '📦' },
    { path: '/admin/orders', label: 'Orders', icon: '📋' },
    { path: '/admin/users', label: 'Users', icon: '👥' },
    { path: '/admin/analytics', label: 'Analytics', icon: '📈' },
  ];

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-lg">
        <div className="p-4 border-b">
          <Link to="/" className="flex items-center">
            <img src={assets.logo} alt="Logo" className="h-8" />
            <span className="ml-2 text-lg font-semibold">Admin Panel</span>
          </Link>
        </div>
        
        <nav className="mt-4">
          {sidebarItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center px-4 py-3 text-gray-700 hover:bg-gray-100 transition-colors ${
                location.pathname === item.path ? 'bg-gray-100 border-r-4 border-blue-500' : ''
              }`}
            >
              <span className="text-xl mr-3">{item.icon}</span>
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="absolute bottom-4 left-4">
          <Link
            to="/"
            className="flex items-center text-gray-600 hover:text-gray-800"
          >
            <span className="mr-2">🏠</span>
            Back to Store
          </Link>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <header className="bg-white shadow-sm border-b p-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-semibold text-gray-800">
              Admin Dashboard
            </h1>
            <div className="flex items-center space-x-4">
              <span className="text-gray-600">Welcome, {user.name}</span>
              <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                {user.name.charAt(0).toUpperCase()}
              </div>
            </div>
          </div>
        </header>

        <main className="p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;