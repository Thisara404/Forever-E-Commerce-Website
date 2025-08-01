import { createContext, useEffect, useState, useCallback } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import ApiService from "../services/api";

export const ShopContext = createContext();

const ShopContextProvider = (props) => {
  const currency = 'LKR';
  const delivery_fee = 10;
  const [search, setSearch] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const [cartItems, setCartItems] = useState({});
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const navigate = useNavigate();

  // Initialize
  useEffect(() => {
    if (token) {
      ApiService.setToken(token);
      fetchUserProfile();
    }
    fetchProducts();
    if (token) {
      fetchCart();
    }
  }, [token]);

  // Fetch products from backend
  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await ApiService.getProducts();
      setProducts(response.data.products);
    } catch (error) {
      toast.error('Failed to fetch products');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch user profile
  const fetchUserProfile = async () => {
    try {
      const response = await ApiService.fetchWithAuth('/auth/profile');
      setUser(response.user);
    } catch (error) {
      console.error('Failed to fetch user profile:', error);
      logout();
    }
  };

  // Fetch cart from backend
  const fetchCart = async () => {
    try {
      const response = await ApiService.getCart();
      const backendCart = response.data;
      
      // Convert backend cart format to frontend format
      const frontendCart = {};
      if (backendCart.items && backendCart.items.length > 0) {
        backendCart.items.forEach(item => {
          if (!frontendCart[item.productId._id]) {
            frontendCart[item.productId._id] = {};
          }
          frontendCart[item.productId._id][item.size] = item.quantity;
        });
      }
      
      setCartItems(frontendCart);
    } catch (error) {
      console.error('Failed to fetch cart:', error);
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
    for (const items in cartItems) {
      for (const item in cartItems[items]) {
        try {
          if (cartItems[items][item] > 0) {
            totalCount += cartItems[items][item];
          }
        } catch (error) {
          console.error(error);
        }
      }
    }
    return totalCount;
  };

  const updateQuantity = async (itemId, size, quantity) => {
    if (!token) return;

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
      toast.error('Failed to update cart');
    }
  };

  const getCartAmount = () => {
    let totalAmount = 0;
    for (const items in cartItems) {
      let itemInfo = products.find((product) => product._id === items);
      if (itemInfo) {
        for (const item in cartItems[items]) {
          try {
            if (cartItems[items][item] > 0) {
              totalAmount += itemInfo.price * cartItems[items][item];
            }
          } catch (error) {
            console.error(error);
          }
        }
      }
    }
    return totalAmount;
  };

  // Authentication functions
  const login = async (email, password) => {
    try {
      setLoading(true);
      const response = await ApiService.login({ email, password });
      
      // FIX: Access response properties correctly
      setToken(response.token);
      setUser(response.user);
      ApiService.setToken(response.token);
      localStorage.setItem('token', response.token);
      
      toast.success('Login successful');
      navigate('/');
      await fetchCart();
    } catch (error) {
      toast.error(error.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData) => {
    try {
      setLoading(true);
      const response = await ApiService.register(userData);
      
      // FIX: Access response properties correctly
      setToken(response.token);
      setUser(response.user);
      ApiService.setToken(response.token);
      localStorage.setItem('token', response.token);
      
      toast.success('Registration successful');
      navigate('/');
    } catch (error) {
      toast.error(error.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    setCartItems({});
    ApiService.removeToken();
    localStorage.removeItem('token');
    toast.success('Logged out successfully');
    navigate('/');
  };

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