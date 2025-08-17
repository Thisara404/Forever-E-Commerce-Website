import { useSelector, useDispatch } from 'react-redux';
import { useCallback } from 'react';

// Custom hooks to replace Context usage
export const useAuth = () => {
  const auth = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  
  return {
    user: auth.user,
    token: auth.token,
    loading: auth.loading,
    error: auth.error,
    isAuthenticated: auth.isAuthenticated,
    dispatch,
  };
};

export const useCart = () => {
  const cart = useSelector((state) => state.cart);
  const products = useSelector((state) => state.products.items);
  const dispatch = useDispatch();
  
  const getCartCount = useCallback(() => {
    let totalCount = 0;
    try {
      for (const items in cart.items) {
        for (const item in cart.items[items]) {
          if (cart.items[items][item] > 0) {
            totalCount += cart.items[items][item];
          }
        }
      }
    } catch (error) {
      console.error('Error calculating cart count:', error);
    }
    return totalCount;
  }, [cart.items]);

  const getCartAmount = useCallback(() => {
    let totalAmount = 0;
    try {
      for (const items in cart.items) {
        let itemInfo = products.find((product) => product._id === items);
        if (itemInfo) {
          for (const item in cart.items[items]) {
            if (cart.items[items][item] > 0) {
              totalAmount += itemInfo.price * cart.items[items][item];
            }
          }
        }
      }
    } catch (error) {
      console.error('Error calculating cart amount:', error);
    }
    return totalAmount;
  }, [cart.items, products]);
  
  return {
    cartItems: cart.items,
    loading: cart.loading,
    error: cart.error,
    getCartCount,
    getCartAmount,
    dispatch,
  };
};

export const useProducts = () => {
  const products = useSelector((state) => state.products);
  const dispatch = useDispatch();
  
  return {
    products: products.items,
    loading: products.loading,
    error: products.error,
    lastFetched: products.lastFetched,
    dispatch,
  };
};

export const useUI = () => {
  const ui = useSelector((state) => state.ui);
  const dispatch = useDispatch();
  
  return {
    search: ui.search,
    showSearch: ui.showSearch,
    loading: ui.loading,
    dispatch,
  };
};