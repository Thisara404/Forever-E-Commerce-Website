// client/src/hooks/useServerHealth.js
import { useState, useEffect } from 'react';

export const useServerHealth = () => {
  const [isHealthy, setIsHealthy] = useState(true); // Default to healthy
  const [isLoading, setIsLoading] = useState(true);
  const [lastChecked, setLastChecked] = useState(null);

  useEffect(() => {
    const checkServerHealth = async () => {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout

        const response = await fetch('http://localhost:5000/api/health', {
          signal: controller.signal,
          method: 'GET',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
          },
          mode: 'cors' // Explicitly set CORS mode
        });
        
        clearTimeout(timeoutId);

        if (response.ok) {
          const data = await response.json();
          setIsHealthy(true);
          setLastChecked(new Date());
          console.log('✅ Server health check passed:', data);
        } else {
          throw new Error(`Server responded with status: ${response.status}`);
        }
      } catch (error) {
        if (error.name === 'AbortError') {
          console.warn('⏰ Health check timeout');
        } else if (error.message.includes('CORS')) {
          console.warn('🔒 CORS error - server may be starting up');
        } else {
          console.warn('⚠️ Health check failed:', error.message);
        }
        setIsHealthy(false);
        setLastChecked(new Date());
      } finally {
        setIsLoading(false);
      }
    };

    // Initial check with delay to let server start
    const initialTimeout = setTimeout(() => {
      checkServerHealth();
    }, 1000);

    // Check every 30 seconds (reduced frequency to avoid rate limiting)
    const interval = setInterval(checkServerHealth, 30000);

    return () => {
      clearTimeout(initialTimeout);
      clearInterval(interval);
    };
  }, []);

  return { isHealthy, isLoading, lastChecked };
};