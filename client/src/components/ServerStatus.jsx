// client/src/components/ServerStatus.jsx
import React from 'react';
import { useServerHealth } from '../hooks/useServerHealth';
import { Alert, AlertDescription } from './ui/alert';
import { Badge } from './ui/badge';

const ServerStatus = () => {
  const { isHealthy, isLoading, lastChecked } = useServerHealth();

  // Don't show anything during initial load
  if (isLoading) {
    return null;
  }

  // Only show status if there's an issue
  if (!isHealthy) {
    return (
      <Alert variant="destructive" className="mb-4">
        <AlertDescription className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Badge variant="destructive" className="animate-pulse">
              Connection Issue
            </Badge>
            <span className="text-sm">Having trouble connecting to server. Some features may be limited.</span>
          </div>
          {lastChecked && (
            <span className="text-xs opacity-75">
              {new Date(lastChecked).toLocaleTimeString()}
            </span>
          )}
        </AlertDescription>
      </Alert>
    );
  }

  // Don't show anything if healthy (clean UI)
  return null;
};

export default ServerStatus;