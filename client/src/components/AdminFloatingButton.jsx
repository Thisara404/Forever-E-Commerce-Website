import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShopContext } from '../context/ShopContext';

const AdminFloatingButton = () => {
  const { user } = useContext(ShopContext);
  const [isHovered, setIsHovered] = useState(false);
  const navigate = useNavigate();

  // Only show for admin users
  if (!user || user.role !== 'admin') {
    return null;
  }

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <button
        onClick={() => navigate('/admin')}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white p-4 rounded-full shadow-lg transition-all duration-300 transform hover:scale-110"
      >
        <div className="flex items-center gap-2">
          <span className="text-xl">⚡</span>
          {isHovered && (
            <span className="text-sm font-semibold whitespace-nowrap">
              Admin Panel
            </span>
          )}
        </div>
      </button>
      
      {/* Tooltip */}
      {!isHovered && (
        <div className="absolute bottom-full right-0 mb-2 px-2 py-1 bg-gray-800 text-white text-xs rounded opacity-0 hover:opacity-100 transition-opacity pointer-events-none">
          Admin Panel
        </div>
      )}
    </div>
  );
};

export default AdminFloatingButton;