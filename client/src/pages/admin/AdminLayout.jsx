import React, { useContext, useEffect, useState } from 'react';
import { Outlet, Navigate, Link, useLocation } from 'react-router-dom';
import { ShopContext } from '../../context/ShopContext';
import { assets } from '../../assets/assets';
import { ErrorBoundary } from 'react-error-boundary';

const AdminLayout = () => {
  const { user, loading, token } = useContext(ShopContext);
  const location = useLocation();
  const [error, setError] = useState(null);

  console.log('🔍 AdminLayout state:', { 
    loading, 
    hasUser: !!user, 
    userRole: user?.role,
    hasToken: !!token 
  });

  // Show loading while authentication is being checked
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading admin panel...</p>
        </div>
      </div>
    );
  }

  // Check if user is not logged in at all
  if (!token) {
    console.log('❌ No token found, redirecting to login');
    return <Navigate to="/login" replace />;
  }

  // Check if user data hasn't loaded yet but token exists
  if (!user) {
    console.log('⏳ Token exists but user not loaded yet, showing loading...');
    return (
      <div className="flex justify-center items-center h-screen bg-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Authenticating...</p>
        </div>
      </div>
    );
  }

  // Check if user is not admin
  if (user.role !== 'admin') {
    console.log('❌ User is not admin:', user.role);
    return (
      <div className="flex justify-center items-center h-screen bg-gray-100">
        <div className="text-center bg-white p-8 rounded-lg shadow-lg">
          <div className="text-red-600 text-6xl mb-4">🚫</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Access Denied</h2>
          <p className="text-gray-600 mb-4">You don't have admin privileges to access this area.</p>
          <Link 
            to="/" 
            className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
          >
            Go to Store
          </Link>
        </div>
      </div>
    );
  }

  console.log('✅ Admin access granted for:', user.name);

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
              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-semibold">
                {user.name.charAt(0).toUpperCase()}
              </div>
            </div>
          </div>
        </header>

        <main className="p-6">
          {error ? (
            <div className="bg-red-50 border border-red-200 p-4 rounded-lg">
              <h3 className="text-red-800 font-semibold">Error Loading Content</h3>
              <p className="text-red-600">{error}</p>
              <button 
                onClick={() => setError(null)}
                className="mt-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
              >
                Try Again
              </button>
            </div>
          ) : (
            <ErrorBoundary 
              FallbackComponent={({error}) => (
                <div className="text-red-600">Error: {error.message}</div>
              )}
            >
              <Outlet />
            </ErrorBoundary>
          )}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;