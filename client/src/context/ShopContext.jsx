import React, { createContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import ApiService from '../services/api';

export const ShopContext = createContext();

const ShopContextProvider = (props) => {
  const currency = 'LKR';
  const delivery_fee = 10;
  const [search, setSearch] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const [cartItems, setCartItems] = useState({});
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null); // Initialize as null
  const navigate = useNavigate();

  // Enhanced token management
  const getStoredToken = () => {
    try {
      // Check multiple storage methods
      const localToken = localStorage.getItem('token');
      const sessionToken = sessionStorage.getItem('token');
      
      // Verify token format
      const validToken = localToken || sessionToken;
      if (validToken && validToken.length > 10 && validToken.includes('.')) {
        console.log('✅ Valid token found in storage');
        return validToken;
      }
      
      console.log('❌ No valid token found');
      return null;
    } catch (error) {
      console.error('Error reading token from storage:', error);
      return null;
    }
  };

  const saveToken = (newToken) => {
    try {
      if (newToken) {
        localStorage.setItem('token', newToken);
        sessionStorage.setItem('token', newToken); // Backup storage
        setToken(newToken);
        ApiService.setToken(newToken);
        console.log('✅ Token saved successfully');
      }
    } catch (error) {
      console.error('Error saving token:', error);
    }
  };

  const clearToken = () => {
    try {
      localStorage.removeItem('token');
      sessionStorage.removeItem('token');
      setToken(null);
      ApiService.removeToken();
      console.log('✅ Token cleared successfully');
    } catch (error) {
      console.error('Error clearing token:', error);
    }
  };

  // Initialize app with better error handling
  useEffect(() => {
    console.log('🔄 ShopContext initializing...');
    
    const initializeApp = async () => {
      try {
        setLoading(true);
        
        // Get stored token
        const storedToken = getStoredToken();
        if (storedToken) {
          console.log('🔑 Token found, setting up API...');
          setToken(storedToken);
          ApiService.setToken(storedToken);
          
          try {
            await fetchUserProfile();
          } catch (error) {
            console.error('❌ Token validation failed, clearing:', error);
            clearToken();
          }
        } else {
          console.log('❌ No token found');
        }
        
        // Always try to fetch products (with retries)
        await fetchProductsWithRetry();
        
      } catch (error) {
        console.error('❌ App initialization error:', error);
      } finally {
        setLoading(false);
        console.log('✅ App initialization complete');
      }
    };

    initializeApp();
  }, []); // Only run once on mount

  // Fetch products with retry logic
  const fetchProductsWithRetry = async (retries = 3) => {
    for (let i = 0; i < retries; i++) {
      try {
        console.log(`🔄 Fetching products (attempt ${i + 1}/${retries})...`);
        const response = await ApiService.getProducts();
        
        if (response.data && response.data.products) {
          setProducts(response.data.products);
          console.log(`✅ Loaded ${response.data.products.length} products`);
          return; // Success, exit retry loop
        } else {
          throw new Error('Invalid response structure');
        }
      } catch (error) {
        console.error(`❌ Attempt ${i + 1} failed:`, error.message);
        
        if (i === retries - 1) {
          // Last attempt failed
          console.error('❌ All product fetch attempts failed');
          toast.error('Unable to load products. Please check your connection.');
          setProducts([]);
        } else {
          // Wait before retry
          await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)));
        }
      }
    }
  };

  const fetchProducts = async () => {
    return fetchProductsWithRetry();
  };

  // Enhanced user profile fetching
  const fetchUserProfile = async () => {
    try {
      console.log('👤 Fetching user profile...');
      const response = await ApiService.fetchWithAuth('/auth/profile');
      console.log('✅ User profile fetched:', response.user);
      setUser(response.user);
      
      // Fetch cart if user is authenticated
      if (response.user) {
        await fetchCart();
      }
    } catch (error) {
      console.error('❌ Failed to fetch user profile:', error);
      // Only logout if it's an authentication error
      if (error.message.includes('401') || error.message.includes('unauthorized')) {
        console.log('🔄 Invalid token, logging out...');
        logout();
      }
      throw error; // Re-throw for initialization to handle
    }
  };

  // Enhanced cart fetching
  const fetchCart = async () => {
    try {
      const response = await ApiService.getCart();
      const backendCart = response.data;
      
      const frontendCart = {};
      let invalidItemsCount = 0;
      
      if (backendCart && backendCart.items && Array.isArray(backendCart.items)) {
        backendCart.items.forEach(item => {
          if (item && item.productId && item.size && item.quantity) {
            const productId = item.productId._id || item.productId;
            
            if (!frontendCart[productId]) {
              frontendCart[productId] = {};
            }
            frontendCart[productId][item.size] = item.quantity;
          } else {
            invalidItemsCount++;
          }
        });
      }
      
      if (invalidItemsCount > 0) {
        console.warn(`⚠️ Found ${invalidItemsCount} invalid cart items`);
      }
      
      setCartItems(frontendCart);
    } catch (error) {
      console.error('Failed to fetch cart:', error);
      setCartItems({});
    }
  };

  // Enhanced authentication functions
  const login = async (email, password) => {
    try {
      setLoading(true);
      console.log('🔄 Attempting login...');
      
      const response = await ApiService.login({ email, password });
      console.log('✅ Login successful:', response);
      
      // Save token and user data
      saveToken(response.token);
      setUser(response.user);
      
      toast.success('Login successful');
      
      // Navigate based on user role
      if (response.user.role === 'admin') {
        console.log('👑 Admin user detected, navigating to admin dashboard');
        navigate('/admin');
      } else {
        navigate('/');
      }
      
      // Fetch cart after successful login
      await fetchCart();
      
    } catch (error) {
      console.error('❌ Login failed:', error);
      toast.error(error.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData) => {
    try {
      setLoading(true);
      console.log('🔄 Attempting registration...');
      
      const response = await ApiService.register(userData);
      console.log('✅ Registration successful:', response);
      
      // Save token and user data
      saveToken(response.token);
      setUser(response.user);
      
      toast.success('Registration successful');
      navigate('/');
    } catch (error) {
      console.error('❌ Registration failed:', error);
      toast.error(error.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    console.log('🔄 Logging out...');
    clearToken();
    setUser(null);
    setCartItems({});
    toast.success('Logged out successfully');
    navigate('/');
  };

  // Add to cart with better error handling
  const addToCart = async (itemId, size) => {
    if (!size) {
      toast.error('Select Product Size');
      return;
    }

    if (!token) {
      toast.error('Please login to add items to cart');
      navigate('/login');
      return;
    }

    try {
      await ApiService.addToCart(itemId, size, 1);
      
      // Update local state
      let cartData = structuredClone(cartItems);
      if (cartData[itemId]) {
        if (cartData[itemId][size]) {
          cartData[itemId][size] += 1;
        } else {
          cartData[itemId][size] = 1;
        }
      } else {
        cartData[itemId] = {};
        cartData[itemId][size] = 1;
      }
      setCartItems(cartData);
      toast.success('Item added to cart');
    } catch (error) {
      toast.error(error.message || 'Failed to add item to cart');
    }
  };

  const getCartCount = () => {
    let totalCount = 0;
    try {
      for (const items in cartItems) {
        for (const item in cartItems[items]) {
          if (cartItems[items][item] > 0) {
            totalCount += cartItems[items][item];
          }
        }
      }
    } catch (error) {
      console.error('Error calculating cart count:', error);
    }
    return totalCount;
  };

  const updateQuantity = async (itemId, size, quantity) => {
    if (!token) {
      toast.error('Please login to update cart');
      return;
    }

    try {
      await ApiService.updateCartItem(itemId, size, quantity);
      
      let cartData = structuredClone(cartItems);
      if (quantity === 0) {
        delete cartData[itemId][size];
        if (Object.keys(cartData[itemId]).length === 0) {
          delete cartData[itemId];
        }
      } else {
        cartData[itemId][size] = quantity;
      }
      setCartItems(cartData);
    } catch (error) {
      toast.error(error.message || 'Failed to update cart');
    }
  };

  const getCartAmount = () => {
    let totalAmount = 0;
    try {
      for (const items in cartItems) {
        let itemInfo = products.find((product) => product._id === items);
        if (itemInfo) {
          for (const item in cartItems[items]) {
            if (cartItems[items][item] > 0) {
              totalAmount += itemInfo.price * cartItems[items][item];
            }
          }
        }
      }
    } catch (error) {
      console.error('Error calculating cart amount:', error);
    }
    return totalAmount;
  };

  // Debug current state
  console.log('🔍 ShopContext state:', {
    loading,
    hasToken: !!token,
    hasUser: !!user,
    userRole: user?.role,
    userName: user?.name,
    productsCount: products.length
  });

  const value = {
    products,
    currency,
    delivery_fee,
    search,
    setSearch,
    showSearch,
    setShowSearch,
    cartItems,
    addToCart,
    getCartCount,
    updateQuantity,
    getCartAmount,
    navigate,
    loading,
    user,
    token,
    login,
    register,
    logout,
    fetchProducts
  };

  return (
    <ShopContext.Provider value={value}>
      {props.children}
    </ShopContext.Provider>
  );
};

export default ShopContextProvider;