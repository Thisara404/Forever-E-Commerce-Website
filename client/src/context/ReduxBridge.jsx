import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { initializeAuth, fetchUserProfile } from '../store/slices/authSlice';
import { fetchProducts } from '../store/slices/productSlice';
import { fetchCart } from '../store/slices/cartSlice';

const ReduxBridge = ({ children }) => {
  const dispatch = useDispatch();

  useEffect(() => {
    const initializeApp = async () => {
      console.log('🔄 Initializing app with Redux...');
      
      // Initialize auth state from localStorage
      dispatch(initializeAuth());
      
      // Try to fetch user profile if token exists
      try {
        await dispatch(fetchUserProfile()).unwrap();
        // Fetch cart after successful auth
        await dispatch(fetchCart());
      } catch (error) {
        console.log('No valid session found');
      }
      
      // Always fetch products
      await dispatch(fetchProducts());
      
      console.log('✅ App initialization complete');
    };

    initializeApp();
  }, [dispatch]);

  return <>{children}</>;
};

export default ReduxBridge;