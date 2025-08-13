// client/src/components/ServerStatus.jsx
import React, { useState, useEffect } from 'react';

const ServerStatus = () => {
  const [serverStatus, setServerStatus] = useState('checking');

  useEffect(() => {
    const checkServer = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/health');
        if (response.ok) {
          setServerStatus('online');
        } else {
          setServerStatus('offline');
        }
      } catch (error) {
        setServerStatus('offline');
      }
    };

    checkServer();
    const interval = setInterval(checkServer, 30000); // Check every 30 seconds

    return () => clearInterval(interval);
  }, []);

  if (serverStatus === 'online') return null;

  return (
    <div className="fixed top-0 left-0 right-0 bg-red-600 text-white text-center py-2 z-50">
      {serverStatus === 'checking' ? 'Checking server...' : 'Server is offline. Please start the backend server.'}
    </div>
  );
};

export default ServerStatus;