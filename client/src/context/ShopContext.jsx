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
  const [loading, setLoading] = useState(true); // Start with true
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const navigate = useNavigate();

  // Initialize - Fixed order and debugging
  useEffect(() => {
    console.log('🔄 ShopContext initializing...');
    console.log('Token from localStorage:', token ? 'EXISTS' : 'MISSING');
    
    const initializeApp = async () => {
      try {
        setLoading(true);
        
        if (token) {
          console.log('🔑 Token found, setting up API and fetching user...');
          ApiService.setToken(token);
          await fetchUserProfile();
        } else {
          console.log('❌ No token found');
        }
        
        // Always fetch products
        await fetchProducts();
        
        // Fetch cart only if user is authenticated
        if (token && user) {
          await fetchCart();
        }
        
      } catch (error) {
        console.error('❌ App initialization error:', error);
      } finally {
        setLoading(false);
        console.log('✅ App initialization complete');
      }
    };

    initializeApp();
  }, []); // Only run once on mount

  // Separate effect for token changes
  useEffect(() => {
    if (token && !user) {
      console.log('🔄 Token changed, fetching user profile...');
      fetchUserProfile();
    }
  }, [token]);

  // Fetch user profile with better error handling
  const fetchUserProfile = async () => {
    try {
      console.log('👤 Fetching user profile...');
      const response = await ApiService.fetchWithAuth('/auth/profile');
      console.log('✅ User profile fetched:', response.user);
      setUser(response.user);
      
      // If user has cart, fetch it
      if (response.user) {
        await fetchCart();
      }
    } catch (error) {
      console.error('❌ Failed to fetch user profile:', error);
      console.log('🔄 Logging out due to profile fetch failure');
      logout();
    }
  };

  // Fetch products from backend
  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await ApiService.getProducts();
      if (response.data && response.data.products) {
        setProducts(response.data.products);
        console.log(`✅ Loaded ${response.data.products.length} products`);
      } else {
        console.warn('⚠️ No products found in response');
        setProducts([]);
      }
    } catch (error) {
      console.error('❌ Failed to fetch products:', error);
      toast.error('Failed to fetch products');
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  // Enhanced cart fetching with better error handling
  const fetchCart = async () => {
    try {
      const response = await ApiService.getCart();
      const backendCart = response.data;
      
      // Convert backend cart format to frontend format
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
            console.warn('⚠️ Invalid cart item found:', {
              hasProductId: !!item?.productId,
              productIdType: typeof item?.productId,
              hasSize: !!item?.size,
              hasQuantity: !!item?.quantity,
              item: item
            });
          }
        });
      }
      
      if (invalidItemsCount > 0) {
        console.warn(`⚠️ Found ${invalidItemsCount} invalid cart items. Consider clearing cart data.`);
        toast.warning(`Found ${invalidItemsCount} invalid items in cart. Please refresh.`);
      }
      
      setCartItems(frontendCart);
    } catch (error) {
      console.error('Failed to fetch cart:', error);
      // Clear cart if there's an error to prevent infinite error loops
      setCartItems({});
      
      // Only show error toast if it's not a authentication error
      if (error.status !== 401 && error.status !== 403) {
        toast.error('Failed to load cart items');
      }
    }
  };

  // Add to cart (backend integrated)
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

  // Authentication functions
  const login = async (email, password) => {
    try {
      setLoading(true);
      console.log('🔄 Attempting login...');
      
      const response = await ApiService.login({ email, password });
      console.log('✅ Login successful:', response);
      
      setToken(response.token);
      setUser(response.user);
      ApiService.setToken(response.token);
      localStorage.setItem('token', response.token);
      
      toast.success('Login successful');
      
      // Navigate based on user role
      if (response.user.role === 'admin') {
        console.log('👑 Admin user detected, navigating to admin dashboard');
        navigate('/admin');
      } else {
        navigate('/');
      }
      
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
      
      setToken(response.token);
      setUser(response.user);
      ApiService.setToken(response.token);
      localStorage.setItem('token', response.token);
      
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
    setToken(null);
    setUser(null);
    setCartItems({});
    ApiService.removeToken();
    localStorage.removeItem('token');
    toast.success('Logged out successfully');
    navigate('/');
  };

  // Debug current state
  console.log('🔍 ShopContext state:', {
    loading,
    hasToken: !!token,
    hasUser: !!user,
    userRole: user?.role,
    userName: user?.name
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