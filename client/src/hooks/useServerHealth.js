// client/src/hooks/useServerHealth.js
import { useState, useEffect } from 'react';

export const useServerHealth = () => {
  const [serverRestarted, setServerRestarted] = useState(false);
  const [lastServerTime, setLastServerTime] = useState(null);

  useEffect(() => {
    const checkServerHealth = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/health');
        const data = await response.json();
        
        if (lastServerTime && data.uptime < 60) { // Server uptime less than 1 minute
          console.log('🔄 Server restart detected!');
          setServerRestarted(true);
          
          // Auto-refresh after server restart
          setTimeout(() => {
            window.location.reload();
          }, 2000);
        }
        
        setLastServerTime(data.uptime);
      } catch (error) {
        console.error('Health check failed:', error);
      }
    };

    const interval = setInterval(checkServerHealth, 5000); // Check every 5 seconds
    checkServerHealth(); // Initial check

    return () => clearInterval(interval);
  }, [lastServerTime]);

  return { serverRestarted };
};