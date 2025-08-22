import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useReduxSelectors';
import { Button } from './ui/button';

const AdminFloatingButton = () => {
  const { user } = useAuth();
  const [isHovered, setIsHovered] = useState(false);
  const navigate = useNavigate();

  // Only show for admin users
  if (!user || user.role !== 'admin') {
    return null;
  }

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <Button
        onClick={() => navigate('/admin')}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 shadow-lg transition-all duration-300 transform hover:scale-110 rounded-full p-4 h-auto"
        size="lg"
      >
        <div className="flex items-center gap-2">
          <span className="text-xl">⚡</span>
          {isHovered && (
            <span className="text-sm font-semibold whitespace-nowrap">
              Admin Panel
            </span>
          )}
        </div>
      </Button>
      
      {/* Tooltip */}
      {!isHovered && (
        <div className="absolute bottom-full right-0 mb-2 px-2 py-1 bg-popover text-popover-foreground text-xs rounded border shadow-sm opacity-0 hover:opacity-100 transition-opacity pointer-events-none">
          Admin Panel
        </div>
      )}
    </div>
  );
};

export default AdminFloatingButton;