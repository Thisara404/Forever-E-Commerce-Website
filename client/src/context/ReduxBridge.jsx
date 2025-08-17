import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { initializeAuth, setInitialized } from '../store/slices/authSlice';
import { fetchProducts } from '../store/slices/productSlice';

const ReduxBridge = ({ children }) => {
  const dispatch = useDispatch();
  const [appInitialized, setAppInitialized] = useState(false);

  useEffect(() => {
    const initializeApp = async () => {
      console.log('🔄 Starting app initialization...');
      
      try {
        // Set a timeout to prevent infinite loading
        const authTimeout = setTimeout(() => {
          console.warn('⚠️ Auth initialization timeout, proceeding anyway...');
          dispatch(setInitialized());
          setAppInitialized(true);
        }, 3000); // 3 second timeout
        
        // Initialize auth
        await dispatch(initializeAuth()).unwrap();
        clearTimeout(authTimeout);
        
        console.log('✅ Auth initialization complete');
        
      } catch (error) {
        console.log('ℹ️ Auth initialization failed, continuing without auth:', error);
        dispatch(setInitialized());
      }
      
      // Always fetch products
      try {
        await dispatch(fetchProducts()).unwrap();
        console.log('✅ Products loaded');
      } catch (error) {
        console.warn('⚠️ Products fetch failed:', error);
      }
      
      setAppInitialized(true);
      console.log('✅ App initialization complete');
    };

    initializeApp();
  }, [dispatch]);

  // Don't render children until basic initialization is done
  if (!appInitialized) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
        <span className="ml-3 text-gray-600">Loading application...</span>
      </div>
    );
  }

  return <>{children}</>;
};

export default ReduxBridge;